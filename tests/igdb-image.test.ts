import { describe, expect, it } from "vitest"
import { getIgdbImageUrl } from "@/lib/igdb-image"

describe("getIgdbImageUrl", () => {
  it("rewrites IGDB upload size presets", () => {
    const original =
      "https://images.igdb.com/igdb/image/upload/t_1080p/ga0lj5zqeqd7moyzxij9.webp"
    expect(getIgdbImageUrl(original, "t_screenshot_med")).toBe(
      "https://images.igdb.com/igdb/image/upload/t_screenshot_med/ga0lj5zqeqd7moyzxij9.webp"
    )
    expect(
      getIgdbImageUrl(
        "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/co1nmw.webp",
        "t_cover_big"
      )
    ).toBe("https://images.igdb.com/igdb/image/upload/t_cover_big/co1nmw.webp")
  })

  it("leaves non-IGDB URLs untouched", () => {
    const cdnUrl = "https://cdn.pixelreviews.app/profile/user.webp"
    expect(getIgdbImageUrl(cdnUrl, "t_thumb")).toBe(cdnUrl)
  })

  it("returns empty string for null or undefined", () => {
    expect(getIgdbImageUrl(null, "t_thumb")).toBe("")
    expect(getIgdbImageUrl(undefined, "t_thumb")).toBe("")
  })
})
