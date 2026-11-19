import type { MetadataRoute } from "next"

const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://pixelreviews.vercel.app"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin/",
          "/settings",
          "/forgot-password",
          "/reset-password",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
