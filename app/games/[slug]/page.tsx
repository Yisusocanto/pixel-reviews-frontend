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
import { ExternalLink, Globe } from "lucide-react"
import Image from "next/image"

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
    game = await getGameAction(slug)
    gameStats = await getGameStatsAction(slug)
  } catch (error) {
    const err = error as Error
    return (
      <div>
        <h1>{err.message}</h1>
      </div>
    )
  }

  let wishlistStatus: InUserWishlist = { inWishlist: false }

  if (session) {
    try {
      ;[review, wishlistStatus] = await Promise.all([
        getUserGameReviewAction(game.id).then((r) => r ?? undefined),
        getUserGameWishlistAction(game.id),
      ])
    } catch (error) {
      console.log(error)
    }
  }

  const screenshots: CarouselItem[] = game.screenshots.map((s) => ({
    id: s,
    url: s,
    title: s,
  }))

  const backgroundImage = game.backgroundImage || game.imageUrl
  const metacriticScore = game.metacriticScore ?? game.metacritic_score
  const metacriticUrl = game.metacriticUrl ?? game.metacritic_url
  const website = game.website?.trim()

  return (
    <div className="relative min-h-screen">
      <div className="relative min-h-[380px] w-full overflow-hidden border-b border-b-border sm:h-96">
        <Image
          src={backgroundImage}
          alt={game.title}
          fill
          className="absolute inset-0 h-full w-full object-cover opacity-25 blur-[1px] filter"
        />
        <div className="absolute inset-0 bg-linear-to-t from-background/90 via-background/40 to-transparent sm:from-background/60 sm:via-background/10" />

        <div className="relative z-10 flex flex-col items-center gap-6 p-4 pt-8 text-center sm:absolute sm:bottom-6 sm:left-8 sm:flex-row sm:items-end sm:p-0 sm:pt-0 sm:text-left">
          <div className="relative aspect-2/3 w-36 shrink-0 overflow-hidden rounded-md border border-white/10 bg-card shadow-2xl sm:w-48 md:w-56">
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
              <h1 className="font-heading text-2xl font-bold tracking-tight uppercase sm:text-3xl md:text-4xl">
                {game.title}
              </h1>
              {game.releaseDate && (
                <span className="text-base text-muted-foreground sm:text-lg">
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
        {/* Left Column: Description, Screenshots, Rating and Community Reviews */}
        <div className="flex flex-2 flex-col gap-12 sm:gap-16">
          <section>
            <h2 className="mb-4 font-bold tracking-widest text-primary uppercase">
              Description
            </h2>
            <p>{game.description}</p>
          </section>

          {game.screenshots.length > 0 && (
            <GameScreenshotsSection screenshots={screenshots} />
          )}

          <GameRatingSection gameStats={gameStats} />

          {/* Technical info on mobile/tablet (before community reviews) */}
          <div className="flex flex-col gap-10 lg:hidden">
            <GameMetacriticCard score={metacriticScore} url={metacriticUrl} />

            <section>
              <h2 className="mb-4 font-bold tracking-widest text-primary uppercase">
                Technical specifications
              </h2>
              <div className="flex justify-between gap-8 border-b border-b-border py-2">
                <span className="text-muted-foreground">Release Date</span>
                <span className="font-bold">
                  {dayjs(game.releaseDate).format("DD/MM/YYYY")}
                </span>
              </div>

              {website && (
                <div className="flex items-center justify-between gap-8 border-b border-b-border py-2">
                  <span className="text-muted-foreground">Website</span>
                  <a
                    href={
                      website.startsWith("http") ? website : `https://${website}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex max-w-55 items-center gap-1.5 truncate text-end font-bold text-primary hover:underline"
                  >
                    <Globe className="size-3.5 shrink-0" />
                    <span className="truncate">Official site</span>
                    <ExternalLink className="size-3 shrink-0" />
                  </a>
                </div>
              )}

              <div className="flex justify-between gap-8 border-b border-b-border py-2">
                <span className="text-muted-foreground">Developers</span>
                <div className="flex flex-col text-end">
                  {game.developers.map((dev) => (
                    <span key={dev.id} className="font-bold">
                      {dev.name}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex justify-between gap-8 border-b border-b-border py-2">
                <span className="text-muted-foreground">Publishers</span>
                <div className="flex flex-col text-end">
                  {game.publishers.map((pub) => (
                    <span key={pub.id} className="font-bold">
                      {pub.name}
                    </span>
                  ))}
                </div>
              </div>
              {game.platforms.length > 0 && (
                <div className="flex flex-col gap-3 border-b border-b-border py-4">
                  <span className="font-heading text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Available Platforms
                  </span>
                  <GamePlatformsList platforms={game.platforms} />
                </div>
              )}
            </section>

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

        {/* Right Sidebar on desktop */}
        <div className="hidden flex-1 flex-col gap-10 lg:flex">
          <GameMetacriticCard score={metacriticScore} url={metacriticUrl} />

          <section>
            <h2 className="mb-4 font-bold tracking-widest text-primary uppercase">
              Technical specifications
            </h2>
            <div className="flex justify-between gap-8 border-b border-b-border py-2">
              <span className="text-muted-foreground">Release Date</span>
              <span className="font-bold">
                {dayjs(game.releaseDate).format("DD/MM/YYYY")}
              </span>
            </div>

            {website && (
              <div className="flex items-center justify-between gap-8 border-b border-b-border py-2">
                <span className="text-muted-foreground">Website</span>
                <a
                  href={
                    website.startsWith("http") ? website : `https://${website}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex max-w-55 items-center gap-1.5 truncate text-end font-bold text-primary hover:underline"
                >
                  <Globe className="size-3.5 shrink-0" />
                  <span className="truncate">Official site</span>
                  <ExternalLink className="size-3 shrink-0" />
                </a>
              </div>
            )}

            <div className="flex justify-between gap-8 border-b border-b-border py-2">
              <span className="text-muted-foreground">Developers</span>
              <div className="flex flex-col text-end">
                {game.developers.map((dev) => (
                  <span key={dev.id} className="font-bold">
                    {dev.name}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex justify-between gap-8 border-b border-b-border py-2">
              <span className="text-muted-foreground">Publishers</span>
              <div className="flex flex-col text-end">
                {game.publishers.map((pub) => (
                  <span key={pub.id} className="font-bold">
                    {pub.name}
                  </span>
                ))}
              </div>
            </div>
            {game.platforms.length > 0 && (
              <div className="flex flex-col gap-3 border-b border-b-border py-4">
                <span className="font-heading text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Available Platforms
                </span>
                <GamePlatformsList platforms={game.platforms} />
              </div>
            )}
          </section>

          <GameStoresSection stores={game.stores} />
        </div>
      </div>
    </div>
  )
}

export default GameDetailPage
