import type { MetadataRoute } from "next"
import { searchGamesAction } from "@/features/games/actions"
import { getAllReviewsAction } from "@/features/reviews/actions"

const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://pixelreviews.vercel.app"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/search`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/feed`,
      lastModified: now,
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ]

  const gameSlugs = new Set<string>()
  const usernames = new Set<string>()

  try {
    const [popularPage1, popularPage2, recentReviews] = await Promise.all([
      searchGamesAction("", 1, 50).catch(() => null),
      searchGamesAction("", 2, 50).catch(() => null),
      getAllReviewsAction(1, 50).catch(() => null),
    ])

    for (const page of [popularPage1, popularPage2]) {
      if (page?.items) {
        for (const game of page.items) {
          if (game.slug) {
            gameSlugs.add(game.slug)
          }
        }
      }
    }

    if (recentReviews?.items) {
      for (const review of recentReviews.items) {
        if (review.game?.slug) {
          gameSlugs.add(review.game.slug)
        }
        if (review.user?.username) {
          usernames.add(review.user.username)
        }
      }
    }
  } catch {
    return staticRoutes
  }

  const gameRoutes: MetadataRoute.Sitemap = Array.from(gameSlugs).map(
    (slug) => ({
      url: `${SITE_URL}/games/${slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    })
  )

  const userRoutes: MetadataRoute.Sitemap = Array.from(usernames).map(
    (username) => ({
      url: `${SITE_URL}/users/${username}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    })
  )

  return [...staticRoutes, ...gameRoutes, ...userRoutes]
}
