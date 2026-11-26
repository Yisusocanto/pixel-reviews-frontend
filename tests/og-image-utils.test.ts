import {
  buildRedditShareUrl,
  buildWhatsAppShareUrl,
  buildXShareUrl,
  getOgSafeImageUrl,
  getShareCardDimensions,
  truncateText,
} from "@/lib/og-image-utils"
import { describe, expect, it } from "vitest"

describe("og-image-utils", () => {
  it("converts IGDB webp URLs to OG-compatible jpg URLs with requested preset", () => {
    const raw =
      "https://images.igdb.com/igdb/image/upload/t_thumb/co1nmw.webp"
    expect(getOgSafeImageUrl(raw, "t_cover_big_2x")).toBe(
      "https://images.igdb.com/igdb/image/upload/t_cover_big_2x/co1nmw.jpg"
    )
  })

  it("rejects non-OG-safe webp avatars while keeping png and jpg URLs", () => {
    expect(
      getOgSafeImageUrl("https://cdn.pixelreviews.app/profile/u1.webp")
    ).toBeNull()
    expect(
      getOgSafeImageUrl("https://cdn.pixelreviews.app/profile/u1.png")
    ).toBe("https://cdn.pixelreviews.app/profile/u1.png")
  })

  it("returns expected Story and Post card dimensions", () => {
    expect(getShareCardDimensions("story")).toEqual({
      width: 1080,
      height: 1920,
    })
    expect(getShareCardDimensions("post")).toEqual({
      width: 1080,
      height: 1350,
    })
  })

  it("truncates long strings and builds social share URLs", () => {
    expect(truncateText("  Hello   world   from   Pixel Reviews  ", 15)).toBe(
      "Hello world fr…"
    )
    const xUrl = buildXShareUrl("Great game", "https://www.pixelreviews.app/reviews/1")
    expect(xUrl).toContain("https://x.com/intent/tweet")
    expect(xUrl).toContain("Great+game")
    expect(
      buildRedditShareUrl("Title", "https://www.pixelreviews.app")
    ).toContain("reddit.com/submit")
    expect(
      buildWhatsAppShareUrl("Look", "https://www.pixelreviews.app")
    ).toContain("wa.me")
  })
})
