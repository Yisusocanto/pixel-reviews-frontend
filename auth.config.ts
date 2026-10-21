import type { NextAuthConfig } from "next-auth"
import type { JWT } from "next-auth/jwt"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import { loginSchema } from "@/lib/validations/auth"
import type { AuthResponse, TokenResponse } from "@/types/auth"

const API_BASE_URL =
  process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8000"

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

async function exchangeGoogleToken(
  idToken: string
): Promise<AuthResponse | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/google`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id_token: idToken,
      }),
    })

    if (!response.ok) {
      return null
    }

    return (await response.json()) as AuthResponse
  } catch (error) {
    console.error("Error exchanging Google token with backend:", error)
    return null
  }
}

export const authConfig: NextAuthConfig = {
  providers: [
    Google,
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
            ...data.user,
            name: data.user.username,
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
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        if (!account.id_token) return false
        const backendAuth = await exchangeGoogleToken(account.id_token)
        if (!backendAuth) return false

        const expiresAt =
          decodeJwtExpiry(backendAuth.access_token) ??
          Date.now() + 15 * 60 * 1000

        user.id = backendAuth.user.id
        user.email = backendAuth.user.email
        user.username = backendAuth.user.username
        user.name = backendAuth.user.username
        user.bio = backendAuth.user.bio
        user.profilePhotoUrl = backendAuth.user.profilePhotoUrl
        user.createdAt = backendAuth.user.createdAt
        user.updatedAt = backendAuth.user.updatedAt
        user.accessToken = backendAuth.access_token
        user.refreshToken = backendAuth.refresh_token
        user.accessTokenExpires = expiresAt

        return true
      }
      return true
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id ?? token.id ?? ""
        token.email = user.email
        token.username = user.username
        token.bio = user.bio
        token.profilePhotoUrl = user.profilePhotoUrl
        token.createdAt = user.createdAt
        token.updatedAt = user.updatedAt
        token.accessToken = user.accessToken
        token.refreshToken = user.refreshToken
        token.accessTokenExpires = user.accessTokenExpires
        token.error = undefined
        return token
      }

      if (trigger === "update" && session?.user) {
        if (session.user.profilePhotoUrl !== undefined) {
          token.profilePhotoUrl = session.user.profilePhotoUrl
        }
        if (session.user.bio !== undefined) {
          token.bio = session.user.bio
        }
        if (session.user.username !== undefined) {
          token.username = session.user.username
        }
      }

      if (Date.now() < token.accessTokenExpires - 60 * 1000) {
        return token
      }

      return await refreshAccessToken(token)
    },
    async session({ session, token }) {
      if (token) {
        session.accessToken = token.accessToken
        session.error = token.error
        session.user = {
          ...session.user,
          id: token.id,
          username: token.username,
          bio: token.bio ?? null,
          profilePhotoUrl: token.profilePhotoUrl ?? null,
          createdAt: token.createdAt ?? null,
          updatedAt: token.updatedAt ?? null,
          email: token.email ?? session.user?.email ?? "",
          name: token.username ?? session.user?.name ?? "",
          image: token.profilePhotoUrl ?? session.user?.image ?? null,
        }
      }
      return session
    },
  },
  pages: {
    signIn: "/",
    error: "/",
  },
  session: {
    strategy: "jwt",
  },
}
