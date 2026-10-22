import { describe, expect, it } from "vitest"
import { formatTimeAgo } from "@/lib/format-time"

describe("formatTimeAgo", () => {
  it("returns empty string when date is null or undefined", () => {
    expect(formatTimeAgo(null)).toBe("")
    expect(formatTimeAgo(undefined)).toBe("")
  })

  it("returns a relative time string for a valid ISO date", () => {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()
    const formatted = formatTimeAgo(fiveMinutesAgo)

    expect(formatted).toContain("minutes ago")
  })
})
