import { auth } from "@/auth"
import LoginModal from "@/components/auth/login-modal"
import ExpandableText from "@/components/expandable-text"
import { Button } from "@/components/ui/button"
import { CarouselItem } from "@/components/ui/framer-thumbnail-carousel"
import {
  getGameAction,
  getGameReviewsAction,
  getGameStatsAction,
} from "@/features/games/actions"
import GameCommunitySection from "@/features/games/components/game-community-section"
import GameMetacriticCard from "@/features/games/components/game-metacritic-card"
import GameRatingSection from "@/features/games/components/game-rating-section"
import GameScreenshotsSection from "@/features/games/components/game-screenshots-section"
import GameStoresSection from "@/features/games/components/game-stores-section"
import GameTrailerSection from "@/features/games/components/game-trailer-section"
import { Game, GameStats } from "@/features/games/types"
import { GameGenresList } from "@/features/genres/components/game-genres-list"
import { GamePlatformsList } from "@/features/platforms/components/game-platforms-list"
import { getUserGameReviewAction } from "@/features/reviews/actions"
import ReviewDialog from "@/features/reviews/components/review-dialog"
import { Review, ReviewPagination } from "@/features/reviews/types"
import { getUserGameWishlistAction } from "@/features/wishlists/actions"
import WishlistButton from "@/features/wishlists/components/wishlist-button"
import { InUserWishlist } from "@/features/wishlists/types"
import {
  AppLocale,
  Dictionary,
  buildLanguageAlternates,
  getDictionary,
} from "@/lib/i18n/dictionaries"
import { getServerLocale } from "@/lib/i18n/server"
import { getIgdbImageUrl } from "@/lib/igdb-image"
import dayjs from "dayjs"
import {
  BookOpen,
  Building2,
  Calendar,
  Code2,
  Cpu,
  ExternalLink,
  Eye,
  Gamepad2,
  Globe,
  Sparkles,
  Star,
} from "lucide-react"
import type { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"
import { cache } from "react"

const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://www.pixelreviews.app"

const getCachedGameData = cache(
  async (
    slug: string,
    locale: AppLocale
  ): Promise<{
    game: Game
    gameStats: GameStats
    initialReviews?: ReviewPagination
  }> => {
    const [game, gameStats, initialReviews] = await Promise.all([
      getGameAction(slug, locale),
      getGameStatsAction(slug),
      getGameReviewsAction(slug, 1, 10).catch(() => undefined),
    ])

    return { game, gameStats, initialReviews }
  }
)

function truncateDescription(text: string, maxLength: number = 155): string {
  const cleaned = text.replace(/\s+/g, " ").trim()
  if (cleaned.length <= maxLength) {
    return cleaned
  }
  return `${cleaned.slice(0, maxLength - 1).trimEnd()}…`
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const locale = await getServerLocale()

  try {
    const { game, gameStats } = await getCachedGameData(slug, locale)
    const releaseYear =
      game.releaseDate && dayjs(game.releaseDate).isValid()
        ? dayjs(game.releaseDate).format("YYYY")
        : null

    const pageTitle =
      locale === "es"
        ? releaseYear
          ? `${game.title} (${releaseYear}) Reseñas, Notas y Opiniones`
          : `${game.title} Reseñas, Notas y Opiniones`
        : releaseYear
          ? `${game.title} (${releaseYear}) Reviews & Ratings`
          : `${game.title} Reviews & Ratings`

    const localizedDesc =
      locale === "es"
        ? game.descriptionEs || game.description || ""
        : game.description || ""

    const ratingSummary =
      locale === "es"
        ? gameStats.totalReviews > 0
          ? `Lee ${gameStats.totalReviews} ${gameStats.totalReviews === 1 ? "reseña" : "reseñas"} de jugadores (${gameStats.avgRatings.toFixed(1)}/5★) sobre ${game.title}. `
          : `Lee opiniones sin filtro, notas de jugadores y ficha técnica de ${game.title}. `
        : gameStats.totalReviews > 0
          ? `Read ${gameStats.totalReviews} community ${gameStats.totalReviews === 1 ? "review" : "reviews"} (${gameStats.avgRatings.toFixed(1)}/5★) for ${game.title}. `
          : `Read community reviews, player ratings, and specs for ${game.title}. `

    const description = truncateDescription(
      `${ratingSummary}${localizedDesc}`,
      158
    )

    const alternates = buildLanguageAlternates(`/games/${game.slug}`, locale)

    return {
      title: pageTitle,
      description,
      alternates,
      openGraph: {
        type: "website",
        locale: locale === "es" ? "es_ES" : "en_US",
        title: `${pageTitle} | Pixel Reviews`,
        description,
        url: alternates.canonical,
      },
      twitter: {
        card: "summary_large_image",
        title: `${pageTitle} | Pixel Reviews`,
        description,
      },
    }
  } catch {
    return {
      title: "Game Not Found",
      robots: {
        index: false,
      },
    }
  }
}

function TechnicalSpecificationsSection({
  game,
  website,
  labels,
}: {
  game: Game
  website?: string
  labels: Dictionary["game"]
}) {
  const formattedRelease =
    game.releaseDate && dayjs(game.releaseDate).isValid()
      ? dayjs(game.releaseDate).format("DD/MM/YYYY")
      : "TBA"

  return (
    <section>
      <h2 className="mb-4 font-mono text-xs font-semibold tracking-[0.22em] text-primary uppercase">
        {labels.technicalSpecs}
      </h2>
      <div className="divide-y divide-border/70 rounded-xl border border-border bg-card p-5 shadow-sm">
        <div className="flex items-center justify-between gap-6 py-3 first:pt-0 last:pb-0">
          <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            <Calendar className="size-3.5 shrink-0 text-primary" />
            <span>{labels.releaseDate}</span>
          </span>
          <span className="text-sm font-semibold text-foreground">
            {formattedRelease}
          </span>
        </div>

        {website && (
          <div className="flex items-center justify-between gap-6 py-3 first:pt-0 last:pb-0">
            <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              <Globe className="size-3.5 shrink-0 text-primary" />
              <span>{labels.website}</span>
            </span>
            <a
              href={website.startsWith("http") ? website : `https://${website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex max-w-52 items-center gap-1.5 truncate text-end text-sm font-semibold text-primary hover:underline"
            >
              <span className="truncate">{labels.officialSite}</span>
              <ExternalLink className="size-3 shrink-0" />
            </a>
          </div>
        )}

        {game.developers.length > 0 && (
          <div className="flex items-start justify-between gap-6 py-3 first:pt-0 last:pb-0">
            <span className="inline-flex items-center gap-2 pt-0.5 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              <Code2 className="size-3.5 shrink-0 text-primary" />
              <span>{labels.developers}</span>
            </span>
            <div className="flex flex-col gap-0.5 text-end">
              {game.developers.map((dev) => (
                <span
                  key={dev.id}
                  className="text-sm font-semibold text-foreground"
                >
                  {dev.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {game.publishers.length > 0 && (
          <div className="flex items-start justify-between gap-6 py-3 first:pt-0 last:pb-0">
            <span className="inline-flex items-center gap-2 pt-0.5 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              <Building2 className="size-3.5 shrink-0 text-primary" />
              <span>{labels.publishers}</span>
            </span>
            <div className="flex flex-col gap-0.5 text-end">
              {game.publishers.map((pub) => (
                <span
                  key={pub.id}
                  className="text-sm font-semibold text-foreground"
                >
                  {pub.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {game.playerPerspectives && game.playerPerspectives.length > 0 && (
          <div className="flex items-center justify-between gap-6 py-3 first:pt-0 last:pb-0">
            <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              <Eye className="size-3.5 shrink-0 text-primary" />
              <span>{labels.perspective}</span>
            </span>
            <span className="text-end text-sm font-semibold text-foreground">
              {game.playerPerspectives.join(", ")}
            </span>
          </div>
        )}

        {game.gameModes && game.gameModes.length > 0 && (
          <div className="flex flex-col gap-2.5 py-3.5 first:pt-0 last:pb-0">
            <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              <Gamepad2 className="size-3.5 shrink-0 text-primary" />
              <span>{labels.gameModes}</span>
            </span>
            <div className="flex flex-wrap gap-1.5">
              {game.gameModes.map((mode) => (
                <span
                  key={mode}
                  className="inline-flex items-center rounded-lg border border-border/80 bg-secondary/60 px-2.5 py-1 text-xs font-medium text-foreground"
                >
                  {mode}
                </span>
              ))}
            </div>
          </div>
        )}

        {game.themes && game.themes.length > 0 && (
          <div className="flex flex-col gap-2.5 py-3.5 first:pt-0 last:pb-0">
            <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              <Sparkles className="size-3.5 shrink-0 text-primary" />
              <span>{labels.themes}</span>
            </span>
            <div className="flex flex-wrap gap-1.5">
              {game.themes.map((theme) => (
                <span
                  key={theme}
                  className="inline-flex items-center rounded-lg border border-border/80 bg-secondary/60 px-2.5 py-1 text-xs font-medium text-foreground"
                >
                  {theme}
                </span>
              ))}
            </div>
          </div>
        )}

        {game.platforms.length > 0 && (
          <div className="flex flex-col gap-2.5 py-3.5 first:pt-0 last:pb-0">
            <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              <Cpu className="size-3.5 shrink-0 text-primary" />
              <span>{labels.platforms}</span>
            </span>
            <GamePlatformsList platforms={game.platforms} />
          </div>
        )}
      </div>
    </section>
  )
}

async function GameDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const locale = await getServerLocale()
  const dict = getDictionary(locale)
  const session = await auth()
  let game: Game
  let gameStats: GameStats
  let initialReviews: ReviewPagination | undefined
  let review: Review | undefined = undefined
  try {
    ;({ game, gameStats, initialReviews } = await getCachedGameData(
      slug,
      locale
    ))
  } catch {
    notFound()
  }

  let wishlistStatus: InUserWishlist = { inWishlist: false }

  if (session) {
    try {
      ;[review, wishlistStatus] = await Promise.all([
        getUserGameReviewAction(game.id).then((r) => r ?? undefined),
        getUserGameWishlistAction(game.id),
      ])
    } catch (error) {
      console.error("Failed to load user review or wishlist status", error)
    }
  }

  const screenshots: CarouselItem[] = game.screenshots.map((s, index) => ({
    id: s,
    url: s,
    title: `${game.title} gameplay screenshot ${index + 1}`,
  }))

  const backgroundImage = game.backgroundImage || game.imageUrl
  const website = game.website?.trim()
  const displayDescription =
    locale === "es"
      ? game.descriptionEs || game.description
      : game.description
  const displayStoryline =
    locale === "es"
      ? game.storylineEs || game.storyline
      : game.storyline

  const writtenReviews = (initialReviews?.items ?? []).filter((r) =>
    Boolean(r.title?.trim() && r.content?.trim())
  )

  const videoGameJsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    name: game.title,
    url: `${SITE_URL}/games/${game.slug}`,
    description: game.description,
    image: game.imageUrl || backgroundImage,
    ...(game.releaseDate && dayjs(game.releaseDate).isValid()
      ? { datePublished: dayjs(game.releaseDate).format("YYYY-MM-DD") }
      : {}),
    ...(game.genres.length > 0
      ? { genre: game.genres.map((g) => g.name) }
      : {}),
    ...(game.platforms.length > 0
      ? { gamePlatform: game.platforms.map((p) => p.name) }
      : {}),
    ...(game.developers.length > 0
      ? {
          author: game.developers.map((dev) => ({
            "@type": "Organization",
            name: dev.name,
          })),
        }
      : {}),
    ...(game.publishers.length > 0
      ? {
          publisher: game.publishers.map((pub) => ({
            "@type": "Organization",
            name: pub.name,
          })),
        }
      : {}),
    ...(gameStats.totalReviews > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: Number(gameStats.avgRatings.toFixed(2)),
            reviewCount: gameStats.totalReviews,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
    ...(writtenReviews.length > 0
      ? {
          review: writtenReviews.slice(0, 5).map((r) => ({
            "@type": "Review",
            name: r.title,
            reviewBody: r.content,
            datePublished: dayjs(r.createdAt).isValid()
              ? dayjs(r.createdAt).format("YYYY-MM-DD")
              : undefined,
            author: {
              "@type": "Person",
              name: r.user?.username || "Player",
              ...(r.user?.username
                ? { url: `${SITE_URL}/users/${r.user.username}` }
                : {}),
            },
            reviewRating: {
              "@type": "Rating",
              ratingValue: r.score,
              bestRating: 5,
              worstRating: 1,
            },
          })),
        }
      : {}),
  }

  return (
    <div className="relative min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(videoGameJsonLd) }}
      />
      <div className="relative min-h-95 w-full overflow-hidden border-b border-b-border bg-zinc-950 sm:h-96">
        {backgroundImage && (
          <Image
            src={getIgdbImageUrl(backgroundImage, "t_720p")}
            alt=""
            aria-hidden="true"
            fill
            priority
            fetchPriority="high"
            className="absolute inset-0 h-full w-full scale-105 object-cover object-center opacity-50 blur-[1px] saturate-110"
          />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-background via-zinc-950/65 to-zinc-950/25" />
        <div className="absolute inset-0 bg-linear-to-r from-zinc-950/85 via-zinc-950/45 to-transparent" />

        <div className="relative z-10 flex flex-col items-center gap-6 p-4 pt-8 text-center sm:absolute sm:bottom-6 sm:left-8 sm:flex-row sm:items-end sm:p-0 sm:pt-0 sm:text-left">
          <div className="relative aspect-2/3 w-36 shrink-0 overflow-hidden rounded-lg border border-white/15 bg-card shadow-2xl ring-1 ring-black/40 sm:w-48 md:w-56">
            {game.imageUrl && (
              <Image
                src={getIgdbImageUrl(game.imageUrl, "t_cover_big")}
                alt={`${game.title} official cover art`}
                fill
                sizes="(max-width: 640px) 144px, (max-width: 768px) 192px, 224px"
                className="object-cover"
                priority
                fetchPriority="high"
              />
            )}
          </div>

          <div className="flex flex-col items-center gap-3 pb-2 sm:items-start sm:gap-4">
            <GameGenresList
              genres={game.genres}
              className="justify-center sm:justify-start"
            />
            <div className="flex flex-wrap items-baseline justify-center gap-2 sm:justify-start sm:gap-3">
              <h1 className="font-heading text-2xl font-bold tracking-tight text-white uppercase drop-shadow-md sm:text-3xl md:text-4xl">
                {game.title}
              </h1>
              {game.releaseDate && dayjs(game.releaseDate).isValid() && (
                <span className="font-mono text-base font-medium text-zinc-300 drop-shadow-xs sm:text-lg">
                  {dayjs(game.releaseDate).format("YYYY")}
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2.5 sm:justify-start sm:gap-3">
              <a
                href="#community-ratings"
                className="group inline-flex items-center gap-2.5 rounded-lg border border-white/15 bg-zinc-950/75 px-3 py-1.5 backdrop-blur-md transition-colors hover:border-primary/60"
              >
                <Star
                  className="size-4 shrink-0 fill-primary text-primary"
                  aria-hidden="true"
                />
                {gameStats.totalReviews > 0 ? (
                  <>
                    <span className="font-heading text-lg leading-none font-black text-white tabular-nums">
                      {gameStats.avgRatings.toFixed(1)}
                    </span>
                    <span className="font-mono text-xs text-zinc-400">/ 5</span>
                    <span className="h-3.5 w-px bg-white/15" aria-hidden="true" />
                    <span className="font-mono text-xs text-zinc-300 transition-colors group-hover:text-white">
                      {gameStats.totalReviews.toLocaleString()}{" "}
                      {gameStats.totalReviews === 1
                        ? dict.game.reviewSingular
                        : dict.game.reviewPlural}
                    </span>
                  </>
                ) : (
                  <span className="font-mono text-xs text-zinc-300">
                    {dict.game.noCommunityRatings}
                  </span>
                )}
              </a>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2.5 sm:justify-start sm:gap-3">
              {session ? (
                <>
                  <ReviewDialog game={game} review={review} />
                  <WishlistButton
                    gameId={game.id}
                    initialData={wishlistStatus}
                  />
                </>
              ) : (
                <>
                  <LoginModal
                    trigger={<Button>{dict.game.signInToReview}</Button>}
                  />
                  <WishlistButton gameId={game.id} />
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-10 p-4 sm:p-6 lg:grid-cols-3 lg:items-start lg:gap-14 lg:p-10">
        <div className="flex flex-col gap-12 sm:gap-14 lg:col-span-2">
          <section>
            <h2 className="mb-4 font-mono text-xs font-semibold tracking-[0.22em] text-primary uppercase">
              {dict.game.description}
            </h2>
            <p className="leading-relaxed whitespace-pre-line text-foreground/90">
              {displayDescription}
            </p>
          </section>

          {displayStoryline && (
            <section className="rounded-xl border border-primary/25 bg-card p-5 shadow-sm sm:p-6">
              <div className="mb-3 flex items-center gap-2">
                <BookOpen className="size-4 text-primary" />
                <h2 className="font-mono text-xs font-semibold tracking-[0.22em] text-primary uppercase">
                  {dict.game.storyline}
                </h2>
              </div>
              <ExpandableText
                content={displayStoryline}
                className="text-sm leading-relaxed text-muted-foreground italic sm:text-base"
              />
            </section>
          )}

          {game.trailerYoutubeId && (
            <GameTrailerSection
              videoId={game.trailerYoutubeId}
              title={game.trailerTitle}
            />
          )}

          {game.screenshots.length > 0 && (
            <GameScreenshotsSection screenshots={screenshots} />
          )}

          <GameRatingSection gameStats={gameStats} />
        </div>

        <aside className="flex flex-col gap-10 lg:col-start-3 lg:row-span-2 lg:row-start-1">
          <GameMetacriticCard
            score={game.criticScore}
            count={game.criticScoreCount}
            url={game.igdbUrl}
          />
          <TechnicalSpecificationsSection
            game={game}
            website={website}
            labels={dict.game}
          />
          <GameStoresSection stores={game.stores} />
        </aside>

        <section className="lg:col-span-2">
          <GameCommunitySection
            gameId={game.id}
            gameSlug={game.slug}
            initialUserReview={review}
            initialReviews={initialReviews}
          />
        </section>
      </div>
    </div>
  )
}

export default GameDetailPage
