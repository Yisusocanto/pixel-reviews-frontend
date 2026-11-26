import { Button } from "@/components/ui/button"
import {
  getPlatformGamesAction,
  getPlatformsAction,
} from "@/features/platforms/actions"
import { Platform, PlatformGamesPagination } from "@/features/platforms/types"
import { getIgdbImageUrl } from "@/lib/igdb-image"
import {
  buildLanguageAlternates,
  buildLocalizedPath,
  getDictionary,
} from "@/lib/i18n/dictionaries"
import { getServerLocale } from "@/lib/i18n/server"
import dayjs from "dayjs"
import { ArrowLeft, ArrowRight, Star } from "lucide-react"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { cache } from "react"

const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://www.pixelreviews.app"

const getCachedPlatformPage = cache(
  async (slug: string, page: number): Promise<PlatformGamesPagination> => {
    return getPlatformGamesAction(slug, page, 24)
  }
)

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const locale = await getServerLocale()
  const dict = getDictionary(locale)

  try {
    const data = await getCachedPlatformPage(slug, 1)
    const title = dict.catalog.bestPlatformTitle(data.platform.name)
    const description = dict.catalog.bestPlatformSubtitle(data.platform.name)
    const alternates = buildLanguageAlternates(
      `/games/platform/${slug}`,
      locale
    )

    return {
      title,
      description,
      alternates,
      openGraph: {
        type: "website",
        locale: locale === "es" ? "es_ES" : "en_US",
        title: `${title} | Pixel Reviews`,
        description,
        url: alternates.canonical,
      },
      twitter: {
        card: "summary_large_image",
        title: `${title} | Pixel Reviews`,
        description,
      },
    }
  } catch {
    return {
      title: "Platform Not Found",
      robots: { index: false },
    }
  }
}

export default async function PlatformLandingPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string }>
}) {
  const { slug } = await params
  const { page: pageParam } = await searchParams
  const page = Math.max(1, Number(pageParam) || 1)
  const locale = await getServerLocale()
  const dict = getDictionary(locale)

  let data: PlatformGamesPagination
  let allPlatforms: Platform[] = []

  try {
    ;[data, allPlatforms] = await Promise.all([
      getCachedPlatformPage(slug, page),
      getPlatformsAction().catch(() => []),
    ])
  } catch {
    notFound()
  }

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: dict.catalog.bestPlatformTitle(data.platform.name),
    description: dict.catalog.bestPlatformSubtitle(data.platform.name),
    numberOfItems: data.items.length,
    itemListElement: data.items.map((game, index) => ({
      "@type": "ListItem",
      position: (page - 1) * 24 + index + 1,
      url: `${SITE_URL}${buildLocalizedPath(`/games/${game.slug}`, locale)}`,
      name: game.title,
    })),
  }

  return (
    <div className="flex flex-1 flex-col pb-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />

      <header className="relative isolate overflow-hidden border-b border-border/80 bg-background/60 px-4 py-8 sm:px-6 sm:py-10 lg:px-10">
        <div className="app-grid pointer-events-none absolute inset-0 -z-10" />
        <div className="pointer-events-none absolute -top-24 right-[-10%] -z-10 size-80 rounded-full bg-primary/12 blur-[100px]" />

        <div className="mx-auto flex w-full max-w-7xl flex-col gap-3">
          <span className="font-mono text-xs font-semibold tracking-[0.25em] text-primary uppercase">
            {dict.catalog.platformEyebrow}
          </span>
          <h1 className="font-heading text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
            {dict.catalog.bestPlatformTitle(data.platform.name)}
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
            {dict.catalog.bestPlatformSubtitle(data.platform.name)}
          </p>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 pt-8 sm:px-6 lg:px-10">
        {data.items.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted-foreground">
            {dict.catalog.emptyCatalog}
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {data.items.map((game) => (
              <Link
                key={game.id}
                href={buildLocalizedPath(`/games/${game.slug}`, locale)}
                className="group flex flex-col gap-2"
              >
                <div className="relative aspect-2/3 w-full overflow-hidden rounded-xl border border-border bg-card shadow-md transition-all duration-300 group-hover:border-primary/60 group-hover:shadow-primary/10">
                  {game.imageUrl && (
                    <Image
                      src={getIgdbImageUrl(game.imageUrl, "t_cover_big")}
                      alt={`${game.title} cover art`}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  )}
                  {typeof game.criticScore === "number" &&
                    game.criticScore > 0 && (
                      <span className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-md border border-white/15 bg-zinc-950/85 px-2 py-0.5 font-mono text-[11px] font-bold text-white backdrop-blur-xs">
                        <Star className="size-3 fill-primary text-primary" />
                        {game.criticScore}
                      </span>
                    )}
                </div>
                <div className="min-w-0">
                  <h2 className="truncate font-heading text-sm font-bold transition-colors group-hover:text-primary">
                    {game.title}
                  </h2>
                  {game.releaseDate && dayjs(game.releaseDate).isValid() && (
                    <span className="font-mono text-xs text-muted-foreground">
                      {dayjs(game.releaseDate).format("YYYY")}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        {data.totalPages > 1 && (
          <div className="flex items-center justify-center gap-4">
            {page > 1 && (
              <Button asChild variant="outline" size="sm">
                <Link
                  href={`${buildLocalizedPath(`/games/platform/${slug}`, locale)}?page=${page - 1}`}
                >
                  <ArrowLeft className="size-4" />
                  <span>{dict.catalog.previousPage}</span>
                </Link>
              </Button>
            )}
            <span className="font-mono text-xs text-muted-foreground">
              {dict.catalog.pageOf(page, data.totalPages)}
            </span>
            {page < data.totalPages && (
              <Button asChild variant="outline" size="sm">
                <Link
                  href={`${buildLocalizedPath(`/games/platform/${slug}`, locale)}?page=${page + 1}`}
                >
                  <span>{dict.catalog.nextPage}</span>
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            )}
          </div>
        )}

        {allPlatforms.length > 1 && (
          <section className="space-y-3 border-t border-border pt-8">
            <h2 className="font-mono text-xs font-semibold tracking-[0.22em] text-primary uppercase">
              {dict.catalog.otherPlatforms}
            </h2>
            <div className="flex flex-wrap gap-2">
              {allPlatforms
                .filter((p) => p.slug !== slug)
                .map((platform) => (
                  <Link
                    key={platform.id}
                    href={buildLocalizedPath(
                      `/games/platform/${platform.slug}`,
                      locale
                    )}
                    className="rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-semibold transition-colors hover:border-primary/50 hover:text-primary"
                  >
                    {platform.name}
                  </Link>
                ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
