import { auth } from "@/auth"

const API_BASE_URL =
  process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8000"

export class ApiError extends Error {
  status: number
  detail: unknown

  constructor(status: number, message: string, detail?: unknown) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.detail = detail
  }
}

/**
 * Typed HTTP client for the FastAPI backend.
 * - On the server, automatically retrieves the active session and appends `Authorization: Bearer <token>`.
 * - Handles JSON serialization and structured HTTP error responses.
 */
export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const session = await auth()
  const headers = new Headers(options.headers)

  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json")
  }

  if (session?.accessToken) {
    headers.set("Authorization", `Bearer ${session.accessToken}`)
  }

  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`

  const response = await fetch(url, {
    ...options,
    headers,
  })

  if (!response.ok) {
    let errorDetail: unknown = null
    let errorMessage = `HTTP Error ${response.status}: ${response.statusText}`
    try {
      const data = await response.json()
      errorDetail = data
      if (typeof data.detail === "string") {
        errorMessage = data.detail
      } else if (Array.isArray(data.detail)) {
        errorMessage = data.detail.map((d: { msg?: string }) => d.msg).join(", ")
      } else if (data.message) {
        errorMessage = data.message
      }
    } catch {
      // Ignore if body is not JSON
    }
    throw new ApiError(response.status, errorMessage, errorDetail)
  }

  if (response.status === 204) {
    return null as T
  }

  return response.json() as Promise<T>
}
