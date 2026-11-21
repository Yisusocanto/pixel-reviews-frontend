export type IgdbImageSize =
  | "t_thumb"
  | "t_cover_small"
  | "t_cover_big"
  | "t_cover_big_2x"
  | "t_screenshot_med"
  | "t_screenshot_big"
  | "t_720p"
  | "t_1080p"

const IGDB_UPLOAD_SIZE_PATTERN =
  /(\/igdb\/image\/upload\/)t_[a-z0-9_]+(\/)/i

/**
 * Rewrites an IGDB CDN image URL to request a specific size preset directly from
 * `images.igdb.com`, reducing image payload without relying on Vercel Image Optimization.
 */
export function getIgdbImageUrl(
  url: string | null | undefined,
  size: IgdbImageSize
): string {
  if (!url) return ""
  if (!url.includes("images.igdb.com")) return url

  return url.replace(IGDB_UPLOAD_SIZE_PATTERN, `$1${size}$2`)
}
