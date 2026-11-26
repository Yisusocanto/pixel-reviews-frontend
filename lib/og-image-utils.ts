import { getIgdbImageUrl, IgdbImageSize } from "@/lib/igdb-image"

export type ShareCardFormat = "story" | "post"

export function getShareCardDimensions(format: ShareCardFormat): {
  width: number
  height: number
} {
  return format === "story"
    ? { width: 1080, height: 1920 }
    : { width: 1080, height: 1350 }
}

export function getOgSafeImageUrl(
  url: string | null | undefined,
  size: IgdbImageSize = "t_cover_big_2x"
): string | null {
  if (!url) return null

  if (url.includes("images.igdb.com")) {
    const sized = getIgdbImageUrl(url, size)
    return sized.replace(/\.webp(\?.*)?$/i, ".jpg$1")
  }

  if (/\.(png|jpe?g|gif|svg)(\?.*)?$/i.test(url)) {
    return url
  }

  return null
}

export function truncateText(text: string, maxLength: number): string {
  const cleaned = text.replace(/\s+/g, " ").trim()
  if (cleaned.length <= maxLength) {
    return cleaned
  }
  return `${cleaned.slice(0, Math.max(0, maxLength - 1)).trimEnd()}…`
}

export function buildXShareUrl(text: string, url: string): string {
  const endpoint = new URL("https://x.com/intent/tweet")
  endpoint.searchParams.set("text", text)
  endpoint.searchParams.set("url", url)
  return endpoint.toString()
}

export function buildRedditShareUrl(title: string, url: string): string {
  const endpoint = new URL("https://www.reddit.com/submit")
  endpoint.searchParams.set("title", title)
  endpoint.searchParams.set("url", url)
  return endpoint.toString()
}

export function buildWhatsAppShareUrl(text: string, url: string): string {
  const endpoint = new URL("https://wa.me/")
  endpoint.searchParams.set("text", `${text} ${url}`)
  return endpoint.toString()
}
