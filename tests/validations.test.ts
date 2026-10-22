import { describe, expect, it } from "vitest"
import { loginSchema, registerSchema } from "@/lib/validations/auth"

describe("auth validation schemas", () => {
  it("accepts valid login credentials", () => {
    const result = loginSchema.safeParse({
      email: "user@example.com",
      password: "secret",
    })

    expect(result.success).toBe(true)
  })

  it("rejects login with invalid email or empty password", () => {
    const result = loginSchema.safeParse({
      email: "not-an-email",
      password: "",
    })

    expect(result.success).toBe(false)
  })

  it("accepts valid registration data", () => {
    const result = registerSchema.safeParse({
      email: "gamer@example.com",
      username: "pixel_hero-99",
      password: "Password123",
      confirmPassword: "Password123",
      bio: "Indie game fan",
    })

    expect(result.success).toBe(true)
  })

  it("rejects registration when passwords do not match", () => {
    const result = registerSchema.safeParse({
      email: "gamer@example.com",
      username: "pixel_hero",
      password: "Password123",
      confirmPassword: "DifferentPassword",
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Passwords do not match")
    }
  })

  it("rejects registration when username has invalid characters", () => {
    const result = registerSchema.safeParse({
      email: "gamer@example.com",
      username: "invalid username!",
      password: "Password123",
      confirmPassword: "Password123",
    })

    expect(result.success).toBe(false)
  })
})
