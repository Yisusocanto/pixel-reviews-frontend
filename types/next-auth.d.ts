import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    accessToken: string
    error?: "RefreshAccessTokenError"
    user: {
      id: string
      username: string
      bio?: string | null
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    email: string
    username: string
    bio?: string | null
    profilePhotoUrl?: string | null
    accessToken: string
    refreshToken: string
    accessTokenExpires: number
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    email?: string | null
    username: string
    bio?: string | null
    accessToken: string
    refreshToken: string
    accessTokenExpires: number
    error?: "RefreshAccessTokenError"
  }
}
