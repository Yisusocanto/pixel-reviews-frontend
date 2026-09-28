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

export type QueryParamValue =
  | string
  | number
  | boolean
  | null
  | undefined

export type QueryParams =
  | Record<string, QueryParamValue | QueryParamValue[]>
  | URLSearchParams

export interface ApiClientOptions<TBody = unknown>
  extends Omit<RequestInit, "body"> {
  /**
   * Query parameters as key-value pairs or URLSearchParams.
   * Null and undefined values will be automatically excluded.
   * Arrays will append multiple query parameters with the same key.
   */
  params?: QueryParams
  /**
   * Request body. Supports any plain object/DTO, array, BodyInit, FormData, or custom interface.
   * Plain objects and arrays will be automatically serialized to JSON.
   */
  body?: BodyInit | TBody | null
}

export type MethodOptions<TBody = unknown> = Omit<
  ApiClientOptions<TBody>,
  "body" | "method"
>

/**
 * Builds the full URL with merged query parameters.
 */
function buildUrl(endpoint: string, params?: QueryParams): string {
  const base = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`

  const url = new URL(base)

  if (!params) {
    return url.toString()
  }

  if (params instanceof URLSearchParams) {
    params.forEach((value, key) => {
      url.searchParams.append(key, value)
    })
    return url.toString()
  }

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) {
      continue
    }

    if (Array.isArray(value)) {
      for (const item of value) {
        if (item !== undefined && item !== null) {
          url.searchParams.append(key, String(item))
        }
      }
    } else {
      url.searchParams.set(key, String(value))
    }
  }

  return url.toString()
}

/**
 * Typed HTTP client for the FastAPI backend.
 * - Automatically injects `Authorization: Bearer <token>` from the active server session.
 * - Formats query parameters from an object (`options.params`).
 * - Automatically JSON-stringifies object payloads in `options.body`.
 * - Handles JSON serialization and structured FastAPI error responses.
 * - Provides convenient shorthand methods: `apiClient.get`, `apiClient.post`, etc.
 */
export async function apiClient<TResponse, TBody = unknown>(
  endpoint: string,
  options: ApiClientOptions<TBody> = {}
): Promise<TResponse> {
  const { params, body, headers: customHeaders, ...restOptions } = options

  const session = await auth()
  const headers = new Headers(customHeaders)

  let formattedBody: BodyInit | undefined = undefined

  if (body !== undefined && body !== null) {
    const isFormData = typeof FormData !== "undefined" && body instanceof FormData
    const isBlob = typeof Blob !== "undefined" && body instanceof Blob
    const isSearchParams = typeof URLSearchParams !== "undefined" && body instanceof URLSearchParams
    const isString = typeof body === "string"

    if (isFormData || isBlob || isSearchParams) {
      formattedBody = body as BodyInit
    } else if (isString) {
      formattedBody = body
      if (!headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json")
      }
    } else {
      formattedBody = JSON.stringify(body)
      if (!headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json")
      }
    }
  }

  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json")
  }

  if (session?.accessToken) {
    headers.set("Authorization", `Bearer ${session.accessToken}`)
  }

  const finalUrl = buildUrl(endpoint, params)

  const response = await fetch(finalUrl, {
    ...restOptions,
    headers,
    body: formattedBody,
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
    return null as TResponse
  }

  return response.json() as Promise<TResponse>
}

// ─── Shorthand HTTP Methods ──────────────────────────────────────────────────

apiClient.get = function <TResponse>(
  endpoint: string,
  options?: MethodOptions
): Promise<TResponse> {
  return apiClient<TResponse>(endpoint, {
    ...options,
    method: "GET",
  })
}

apiClient.post = function <TResponse, TBody = unknown>(
  endpoint: string,
  body?: TBody,
  options?: MethodOptions<TBody>
): Promise<TResponse> {
  return apiClient<TResponse, TBody>(endpoint, {
    ...options,
    method: "POST",
    body,
  })
}

apiClient.put = function <TResponse, TBody = unknown>(
  endpoint: string,
  body?: TBody,
  options?: MethodOptions<TBody>
): Promise<TResponse> {
  return apiClient<TResponse, TBody>(endpoint, {
    ...options,
    method: "PUT",
    body,
  })
}

apiClient.patch = function <TResponse, TBody = unknown>(
  endpoint: string,
  body?: TBody,
  options?: MethodOptions<TBody>
): Promise<TResponse> {
  return apiClient<TResponse, TBody>(endpoint, {
    ...options,
    method: "PATCH",
    body,
  })
}

apiClient.delete = function <TResponse>(
  endpoint: string,
  options?: MethodOptions
): Promise<TResponse> {
  return apiClient<TResponse>(endpoint, {
    ...options,
    method: "DELETE",
  })
}
