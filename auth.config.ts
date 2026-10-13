import type { NextAuthConfig } from "next-auth"
import type { JWT } from "next-auth/jwt"
import Credentials from "next-auth/providers/credentials"
import { loginSchema } from "@/lib/validations/auth"
import type { AuthResponse, TokenResponse } from "@/types/auth"

const API_BASE_URL =
  process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8000"

/**
 * Safely decodes the expiration (`exp`) timestamp from a JWT access token.
 * Uses standard `atob` for universal runtime support (Edge, Node.js, and browser).
 */
function decodeJwtExpiry(token: string): number | null {
  try {
    const parts = token.split(".")
    if (parts.length < 2) return null
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/")
    const json = atob(base64)
    const payload = JSON.parse(json) as { exp?: number }
    return typeof payload.exp === "number" ? payload.exp * 1000 : null
  } catch {
    return null
  }
}

/**
 * Requests a new pair of tokens (rotation) from the FastAPI backend
 * using the stored `refresh_token`.
 */
async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refresh_token: token.refreshToken,
      }),
    })

    const data = (await response.json()) as TokenResponse

    if (!response.ok) {
      throw data
    }

    const expiresAt =
      decodeJwtExpiry(data.access_token) ?? Date.now() + 15 * 60 * 1000

    return {
      ...token,
      accessToken: data.access_token,
      refreshToken: data.refresh_token ?? token.refreshToken,
      accessTokenExpires: expiresAt,
      error: undefined,
    }
  } catch (error) {
    console.error("Error refreshing access token:", error)
    return {
      ...token,
      error: "RefreshAccessTokenError",
    }
  }
}

export const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const validated = loginSchema.safeParse(credentials)
        if (!validated.success) {
          return null
        }

        try {
          const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: validated.data.email,
              password: validated.data.password,
            }),
          })

          if (!response.ok) {
            return null
          }

          const data = (await response.json()) as AuthResponse

          const expiresAt =
            decodeJwtExpiry(data.access_token) ?? Date.now() + 15 * 60 * 1000

          return {
            id: data.user.id,
            email: data.user.email,
            name: data.user.username,
            username: data.user.username,
            bio: data.user.bio,
            profilePhotoUrl: data.user.profilePhotoUrl,
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
            accessTokenExpires: expiresAt,
          }
        } catch (error) {
          console.error("Error during authorization with backend:", error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // 1. Initial sign-in: `user` is provided from authorize()
      if (user) {
        token.id = user.id
        token.email = user.email
        token.username = user.username
        token.bio = user.bio
        token.accessToken = user.accessToken
        token.refreshToken = user.refreshToken
        token.accessTokenExpires = user.accessTokenExpires
        return token
      }

      // 2. Return previous token if the access token has not expired yet (with a 60-second safety window)
      if (Date.now() < token.accessTokenExpires - 60 * 1000) {
        return token
      }

      // 3. Access token has expired or is close to expiring, rotate tokens
      return await refreshAccessToken(token)
    },
    async session({ session, token }) {
      if (token) {
        session.accessToken = token.accessToken
        session.error = token.error
        if (session.user) {
          session.user.id = token.id
          session.user.username = token.username
          session.user.bio = token.bio
          if (token.email) session.user.email = token.email
          if (token.username) session.user.name = token.username
        }
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
  session: {
    strategy: "jwt",
  },
}
