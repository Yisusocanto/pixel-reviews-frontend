import { auth } from "@/auth"
import LoginModal from "@/components/auth/login-modal"
import { Button } from "@/components/ui/button"
import { CarouselItem } from "@/components/ui/framer-thumbnail-carousel"
import { getGameAction, getGameStatsAction } from "@/features/games/actions"
import GameCommunitySection from "@/features/games/components/game-community-section"
import GameRatingSection from "@/features/games/components/game-rating-section"
import GameScreenshotsSection from "@/features/games/components/game-screenshots-section"
import { Game, GameStats } from "@/features/games/types"
import { getUserGameReviewAction } from "@/features/reviews/actions"
import ReviewDialog from "@/features/reviews/components/review-dialog"
import { Review } from "@/features/reviews/types"
import { getUserGameWishlistAction } from "@/features/wishlists/actions"
import WishlistButton from "@/features/wishlists/components/wishlist-button"
import { InUserWishlist } from "@/features/wishlists/types"
import dayjs from "dayjs"
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
    ;[game, gameStats] = await Promise.all([
      getGameAction(slug),
      getGameStatsAction(slug),
    ])
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

  return (
    <div className="relative min-h-screen">
      {/* Hero Banner Background */}
      <div className="relative h-96 w-full overflow-hidden border-b border-b-border">
        {game.imageUrl && (
          <>
            <Image
              src={game.imageUrl}
              alt={game.title}
              fill
              className="absolute inset-0 h-full w-full object-cover opacity-25 blur-[1px] filter"
            />
            <div className="absolute inset-0 bg-linear-to-t from-background via-background/20 to-transparent" />
          </>
        )}

        {/* Poster & Header Info */}
        <div className="absolute bottom-6 left-8 z-10 flex items-end gap-6">
          {/* Vertical Poster Container (aspect 2/3) */}
          <div className="relative aspect-2/3 w-48 shrink-0 overflow-hidden rounded-md border border-white/10 bg-card shadow-2xl sm:w-56">
            {game.imageUrl && (
              <Image
                src={game.imageUrl}
                alt={game.title}
                fill
                sizes="(max-width: 768px) 192px, 224px"
                className="object-cover"
                priority
              />
            )}
          </div>

          <div className="flex flex-col gap-4 pb-2">
            <div className="flex items-baseline gap-3">
              <h1 className="font-heading text-4xl font-bold tracking-tight uppercase">
                {game.title}
              </h1>
              <span className="text-lg text-muted-foreground">
                {dayjs(game.releaseDate).format("YYYY")}
              </span>
            </div>

            <div className="flex items-center gap-3">
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

      <div className="flex justify-between gap-20 p-12">
        {/* left */}
        <div className="flex flex-2 flex-col gap-16">
          {/* Description */}
          <section>
            <h2 className="mb-4 font-bold tracking-widest text-primary uppercase">
              Description
            </h2>
            <p>{game.description}</p>
          </section>
          {/* Screenshots */}
          {game.screenshots.length > 0 && (
            <GameScreenshotsSection screenshots={screenshots} />
          )}
          {/* Community Reception */}
          <GameRatingSection gameStats={gameStats} />
          {/* Community */}
          <section>
            <GameCommunitySection
              gameId={game.id}
              gameSlug={game.slug}
              initialUserReview={review}
            />
          </section>
        </div>

        {/* right */}
        <div className="flex-1">
          {/* Technical specifications */}
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
          </section>
        </div>
      </div>
    </div>
  )
}

export default GameDetailPage
