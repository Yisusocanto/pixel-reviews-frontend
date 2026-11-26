import { getAllGamesAction, searchGamesAction } from "@/features/games/actions"
import { getGenresAction } from "@/features/genres/actions"
import { getPlatformsAction } from "@/features/platforms/actions"
import { getAllReviewsAction } from "@/features/reviews/actions"
import type { MetadataRoute } from "next"

const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://www.pixelreviews.app"

function withBilingualEntry(
  path: string,
  now: Date,
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"],
  priority: number
): MetadataRoute.Sitemap {
  const clean = path === "/" ? "" : path
  const enUrl = `${SITE_URL}${clean || "/"}`
  const esUrl = `${SITE_URL}/es${clean}`

  return [
    {
      url: enUrl,
      lastModified: now,
      changeFrequency,
      priority,
      alternates: {
        languages: {
          en: enUrl,
          es: esUrl,
        },
      },
    },
    {
      url: esUrl,
      lastModified: now,
      changeFrequency,
      priority: Math.max(0.1, Number((priority - 0.05).toFixed(2))),
      alternates: {
        languages: {
          en: enUrl,
          es: esUrl,
        },
      },
    },
  ]
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticEntries: MetadataRoute.Sitemap = [
    ...withBilingualEntry("/", now, "daily", 1.0),
    ...withBilingualEntry("/search", now, "daily", 0.9),
    ...withBilingualEntry("/feed", now, "hourly", 0.9),
    ...withBilingualEntry("/charts", now, "daily", 0.85),
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
  const reviewIds = new Set<string>()
  let genreSlugs: string[] = []
  let platformSlugs: string[] = []

  try {
    const [
      dbGamesPage1,
      dbGamesPage2,
      popularPage1,
      recentReviews1,
      recentReviews2,
      genres,
      platforms,
    ] = await Promise.all([
      getAllGamesAction(1, 100).catch(() => null),
      getAllGamesAction(2, 100).catch(() => null),
      searchGamesAction("", 1, 50).catch(() => null),
      getAllReviewsAction(1, 50).catch(() => null),
      getAllReviewsAction(2, 50).catch(() => null),
      getGenresAction().catch(() => []),
      getPlatformsAction().catch(() => []),
    ])

    for (const dbPage of [dbGamesPage1, dbGamesPage2]) {
      for (const game of dbPage?.items ?? []) {
        if (game.slug) gameSlugs.add(game.slug)
      }
    }

    for (const game of popularPage1?.items ?? []) {
      if (game.slug) gameSlugs.add(game.slug)
    }

    for (const revPage of [recentReviews1, recentReviews2]) {
      for (const review of revPage?.items ?? []) {
        if (review.game?.slug) gameSlugs.add(review.game.slug)
        if (review.user?.username) usernames.add(review.user.username)
        if (review.id && review.title?.trim()) reviewIds.add(review.id)
      }
    }

    genreSlugs = genres.map((g) => g.slug).filter(Boolean)
    platformSlugs = platforms.map((p) => p.slug).filter(Boolean)
  } catch {
    return staticEntries
  }

  const genreEntries = genreSlugs.flatMap((slug) =>
    withBilingualEntry(`/games/genre/${slug}`, now, "weekly", 0.8)
  )

  const platformEntries = platformSlugs.flatMap((slug) =>
    withBilingualEntry(`/games/platform/${slug}`, now, "weekly", 0.75)
  )

  const gameEntries = Array.from(gameSlugs).flatMap((slug) =>
    withBilingualEntry(`/games/${slug}`, now, "weekly", 0.85)
  )

  const reviewEntries: MetadataRoute.Sitemap = Array.from(reviewIds).map(
    (id) => ({
      url: `${SITE_URL}/reviews/${id}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    })
  )

  const userEntries: MetadataRoute.Sitemap = Array.from(usernames).map(
    (username) => ({
      url: `${SITE_URL}/users/${username}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    })
  )

  return [
    ...staticEntries,
    ...genreEntries,
    ...platformEntries,
    ...gameEntries,
    ...reviewEntries,
    ...userEntries,
  ]
}
