import { DefaultSession } from "next-auth"
import type { User as AppUser } from "@/features/users/types"

declare module "next-auth" {
  interface Session {
    accessToken: string
    error?: "RefreshAccessTokenError"
    user: AppUser & DefaultSession["user"]
  }

  interface User extends AppUser {
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
    profilePhotoUrl?: string | null
    createdAt?: string | null
    updatedAt?: string | null
    accessToken: string
    refreshToken: string
    accessTokenExpires: number
    error?: "RefreshAccessTokenError"
  }
}
