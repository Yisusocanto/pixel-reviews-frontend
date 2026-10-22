import { beforeEach, describe, expect, it, vi } from "vitest"

vi.mock("@/auth", () => ({
  auth: vi.fn(),
}))

import { auth } from "@/auth"
import { ApiError, apiClient } from "@/lib/api/client"

const mockedAuth = vi.mocked(auth)

describe("apiClient", () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    mockedAuth.mockResolvedValue(null as never)
  })

  it("builds query parameters and injects Bearer token when session exists", async () => {
    mockedAuth.mockResolvedValue({
      accessToken: "jwt-token-123",
    } as never)

    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ items: [], total: 0 }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    )
    vi.stubGlobal("fetch", fetchMock)

    const data = await apiClient.get<{ items: unknown[]; total: number }>(
      "/games/search",
      {
        params: {
          title: "zelda",
          page: 1,
          empty: null,
          tags: ["rpg", "adventure"],
        },
      }
    )

    expect(data.total).toBe(0)
    expect(fetchMock).toHaveBeenCalledTimes(1)

    const [calledUrl, options] = fetchMock.mock.calls[0] as [
      string,
      RequestInit,
    ]
    expect(calledUrl).toBe(
      "http://localhost:8000/games/search?title=zelda&page=1&tags=rpg&tags=adventure"
    )

    const headers = new Headers(options.headers)
    expect(headers.get("Authorization")).toBe("Bearer jwt-token-123")
  })

  it("throws ApiError with FastAPI detail message on non-OK response", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ detail: "Invalid credentials" }), {
        status: 401,
        statusText: "Unauthorized",
        headers: { "Content-Type": "application/json" },
      })
    )
    vi.stubGlobal("fetch", fetchMock)

    await expect(
      apiClient.post("/auth/login", { email: "a@b.com", password: "wrong" })
    ).rejects.toThrowError(
      new ApiError(401, "Invalid credentials", {
        detail: "Invalid credentials",
      })
    )
  })

  it("returns null on 204 No Content response", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(null, { status: 204 }))
    vi.stubGlobal("fetch", fetchMock)

    const result = await apiClient.delete("/reviews/123")
    expect(result).toBeNull()
  })
})
