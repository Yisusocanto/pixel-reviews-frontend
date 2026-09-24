export interface UserResponse {
  id: string
  email: string
  username: string
  bio: string | null
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  access_token: string
  refresh_token: string
  token_type: string
  user: UserResponse
}

export interface TokenResponse {
  access_token: string
  refresh_token: string
  token_type: string
}

export interface RefreshTokenRequest {
  refresh_token: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  username: string
  password: string
  bio?: string | null
}

export interface JwtPayload {
  sub?: string
  type?: "access" | "refresh"
  exp?: number
  iat?: number
}
