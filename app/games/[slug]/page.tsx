import { auth } from "@/auth"
import LoginModal from "@/components/auth/login-modal"
import { Button } from "@/components/ui/button"
import { CarouselItem } from "@/components/ui/framer-thumbnail-carousel"
import { getGameAction, getGameStatsAction } from "@/features/games/actions"
import GameCommunitySection from "@/features/games/components/game-community-section"
import GameMetacriticCard from "@/features/games/components/game-metacritic-card"
import GameRatingSection from "@/features/games/components/game-rating-section"
import GameScreenshotsSection from "@/features/games/components/game-screenshots-section"
import GameStoresSection from "@/features/games/components/game-stores-section"
import GameTrailerSection from "@/features/games/components/game-trailer-section"
import { GameGenresList } from "@/features/genres/components/game-genres-list"
import { GamePlatformsList } from "@/features/platforms/components/game-platforms-list"
import { Game, GameStats } from "@/features/games/types"
import { getUserGameReviewAction } from "@/features/reviews/actions"
import ReviewDialog from "@/features/reviews/components/review-dialog"
import { Review } from "@/features/reviews/types"
import { getUserGameWishlistAction } from "@/features/wishlists/actions"
import WishlistButton from "@/features/wishlists/components/wishlist-button"
import { InUserWishlist } from "@/features/wishlists/types"
import dayjs from "dayjs"
import {
  BookOpen,
  Building2,
  Calendar,
  Code2,
  Cpu,
  Eye,
  ExternalLink,
  Gamepad2,
  Globe,
  Sparkles,
} from "lucide-react"
import Image from "next/image"
import { notFound } from "next/navigation"
import ExpandableText from "@/components/expandable-text"

function TechnicalSpecificationsSection({
  game,
  website,
}: {
  game: Game
  website?: string
}) {
  const formattedRelease =
    game.releaseDate && dayjs(game.releaseDate).isValid()
      ? dayjs(game.releaseDate).format("DD/MM/YYYY")
      : "TBA"

  return (
    <section>
      <h2 className="mb-4 font-heading text-sm font-bold tracking-widest text-primary uppercase">
        Technical Specifications
      </h2>
      <div className="divide-y divide-border/70 rounded-xl border border-border bg-card p-5 shadow-xs">
        <div className="flex items-center justify-between gap-6 py-3 first:pt-0 last:pb-0">
          <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            <Calendar className="size-3.5 shrink-0 text-primary" />
            <span>Release Date</span>
          </span>
          <span className="text-sm font-semibold text-foreground">
            {formattedRelease}
          </span>
        </div>

        {website && (
          <div className="flex items-center justify-between gap-6 py-3 first:pt-0 last:pb-0">
            <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              <Globe className="size-3.5 shrink-0 text-primary" />
              <span>Website</span>
            </span>
            <a
              href={website.startsWith("http") ? website : `https://${website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex max-w-52 items-center gap-1.5 truncate text-end text-sm font-semibold text-primary hover:underline"
            >
              <span className="truncate">Official site</span>
              <ExternalLink className="size-3 shrink-0" />
            </a>
          </div>
        )}

        {game.developers.length > 0 && (
          <div className="flex items-start justify-between gap-6 py-3 first:pt-0 last:pb-0">
            <span className="inline-flex items-center gap-2 pt-0.5 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              <Code2 className="size-3.5 shrink-0 text-primary" />
              <span>Developers</span>
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
              <span>Publishers</span>
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
              <span>Perspective</span>
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
              <span>Game Modes</span>
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
              <span>Themes</span>
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
              <span>Available Platforms</span>
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
  const session = await auth()
  let game: Game
  let gameStats: GameStats
  let review: Review | undefined = undefined
  try {
    ;[game, gameStats] = await Promise.all([
      getGameAction(slug),
      getGameStatsAction(slug),
    ])
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

  const screenshots: CarouselItem[] = game.screenshots.map((s) => ({
    id: s,
    url: s,
    title: s,
  }))

  const backgroundImage = game.backgroundImage || game.imageUrl
  const website = game.website?.trim()

  return (
    <div className="relative min-h-screen">
      <div className="relative min-h-95 w-full overflow-hidden border-b border-b-border bg-zinc-950 sm:h-96">
        {backgroundImage && (
          <Image
            src={backgroundImage}
            alt={game.title}
            fill
            priority
            className="absolute inset-0 h-full w-full scale-105 object-cover object-center opacity-50 blur-[1px] saturate-110"
          />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-background via-zinc-950/65 to-zinc-950/25" />
        <div className="absolute inset-0 bg-linear-to-r from-zinc-950/85 via-zinc-950/45 to-transparent" />

        <div className="relative z-10 flex flex-col items-center gap-6 p-4 pt-8 text-center sm:absolute sm:bottom-6 sm:left-8 sm:flex-row sm:items-end sm:p-0 sm:pt-0 sm:text-left">
          <div className="relative aspect-2/3 w-36 shrink-0 overflow-hidden rounded-lg border border-white/15 bg-card shadow-2xl ring-1 ring-black/40 sm:w-48 md:w-56">
            {game.imageUrl && (
              <Image
                src={game.imageUrl}
                alt={game.title}
                fill
                sizes="(max-width: 640px) 144px, (max-width: 768px) 192px, 224px"
                className="object-cover"
                priority
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
                    trigger={<Button>Sign in to write a review</Button>}
                  />
                  <WishlistButton gameId={game.id} />
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-between gap-10 p-4 sm:p-6 lg:flex-row lg:gap-16 lg:p-12">
        <div className="flex flex-2 flex-col gap-12 sm:gap-16">
          <section>
            <h2 className="mb-4 font-heading text-sm font-bold tracking-widest text-primary uppercase">
              Description
            </h2>
            <p className="leading-relaxed whitespace-pre-line text-foreground/90">
              {game.description}
            </p>
          </section>

          {game.storyline && (
            <section className="rounded-xl border border-primary/20 bg-card/60 p-5 sm:p-6">
              <div className="mb-3 flex items-center gap-2">
                <BookOpen className="size-4 text-primary" />
                <h2 className="font-heading text-sm font-bold tracking-widest text-primary uppercase">
                  Storyline
                </h2>
              </div>
              <ExpandableText
                content={game.storyline}
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

          <div className="flex flex-col gap-10 lg:hidden">
            <GameMetacriticCard
              score={game.criticScore}
              count={game.criticScoreCount}
              url={game.igdbUrl}
            />
            <TechnicalSpecificationsSection game={game} website={website} />
            <GameStoresSection stores={game.stores} />
          </div>

          <section>
            <GameCommunitySection
              gameId={game.id}
              gameSlug={game.slug}
              initialUserReview={review}
            />
          </section>
        </div>

        <div className="hidden flex-1 flex-col gap-10 lg:flex">
          <GameMetacriticCard
            score={game.criticScore}
            count={game.criticScoreCount}
            url={game.igdbUrl}
          />
          <TechnicalSpecificationsSection game={game} website={website} />
          <GameStoresSection stores={game.stores} />
        </div>
      </div>
    </div>
  )
}

export default GameDetailPage
