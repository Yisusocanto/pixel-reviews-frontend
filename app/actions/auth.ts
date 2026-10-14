"use server"

import { signIn, signOut } from "@/auth"
import { AuthError } from "next-auth"
import {
  loginSchema,
  registerSchema,
  type LoginInput,
  type RegisterInput,
} from "@/lib/validations/auth"

const API_BASE_URL =
  process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8000"

export type ActionState = {
  success: boolean
  error?: string
}

/**
 * Server Action to sign in with email and password credentials.
 */
export async function loginAction(values: LoginInput): Promise<ActionState> {
  const validated = loginSchema.safeParse(values)
  if (!validated.success) {
    return {
      success: false,
      error: validated.error.issues[0]?.message || "Invalid form data",
    }
  }

  try {
    await signIn("credentials", {
      email: validated.data.email,
      password: validated.data.password,
      redirect: false,
    })
    return { success: true }
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { success: false, error: "Invalid email or password" }
        default:
          return {
            success: false,
            error: "Authentication failed. Please try again.",
          }
      }
    }
    throw error
  }
}

/**
 * Server Action to register a new user in the FastAPI backend
 * and automatically authenticate upon successful creation.
 */
export async function registerAction(
  values: RegisterInput
): Promise<ActionState> {
  const validated = registerSchema.safeParse(values)
  if (!validated.success) {
    return {
      success: false,
      error: validated.error.issues[0]?.message || "Invalid form data",
    }
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: validated.data.email,
        username: validated.data.username,
        password: validated.data.password,
        bio: validated.data.bio || null,
      }),
    })

    if (!response.ok) {
      let detail = "Failed to create account"
      try {
        const errorJson = await response.json()
        detail = errorJson.detail || detail
      } catch {
        // Ignore json parse error
      }
      return { success: false, error: detail }
    }

    // Auto-login with registered credentials
    await signIn("credentials", {
      email: validated.data.email,
      password: validated.data.password,
      redirect: false,
    })

    return { success: true }
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        success: false,
        error:
          "Account created successfully, but an error occurred while signing in.",
      }
    }
    throw error
  }
}

export async function logoutAction() {
  await signOut()
}

export async function googleLoginAction() {
  await signIn("google")
}
