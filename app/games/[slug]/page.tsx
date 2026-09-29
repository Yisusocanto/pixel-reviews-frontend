import RatingDistribution from "@/components/ui/c-rating-6"
import {
  CarouselItem,
  FramerThumbnailCarousel,
} from "@/components/ui/framer-thumbnail-carousel"
import StarRating from "@/components/ui/star-rating"
import { getGameAction, getGameStatsAction } from "@/features/games/actions"
import GameCommunitySection from "@/features/games/components/game-community-section"
import { Game, GameStats } from "@/features/games/types"
import { getUserGameReviewAction } from "@/features/reviews/actions"
import ReviewDialog from "@/features/reviews/components/review-dialog"
import { Review } from "@/features/reviews/types"
import dayjs from "dayjs"
import Image from "next/image"

async function GameDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
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

  try {
    review = (await getUserGameReviewAction(game.id)) ?? undefined
  } catch (error) {
    console.log(error)
    // nothing
  }

  console.log(review)

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
            <img
              src={game.imageUrl}
              alt={game.title}
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

            <div className="flex gap-2">
              <ReviewDialog game={game} review={review} />
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
            <section>
              <h2 className="mb-4 font-heading font-bold tracking-widest text-primary uppercase">
                Screenshots and Art game
              </h2>
              <FramerThumbnailCarousel
                className="mt-2"
                items={screenshots}
                initialIndex={0}
              />
            </section>
          )}
          {/* Community Reception */}
          <section>
            <h2 className="mb-4 font-heading font-bold tracking-widest text-primary uppercase">
              Community Reception
            </h2>
            <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10 rounded-2xl border border-border/60 bg-card/40 p-6 backdrop-blur-sm">
              <div className="flex flex-col items-center justify-center shrink-0 sm:pr-8 sm:border-r border-border/40 min-w-44">
                <div className="flex items-baseline gap-1.5">
                  <span className="font-heading text-5xl font-black tracking-tight text-foreground">
                    {gameStats.avgRatings
                      ? Number(gameStats.avgRatings).toFixed(1)
                      : "0.0"}
                  </span>
                  <span className="text-xl font-semibold text-muted-foreground/70">
                    / 5
                  </span>
                </div>
                <div className="mt-2.5">
                  <StarRating
                    value={Number(gameStats.avgRatings) || 0}
                    size="md"
                    readOnly
                  />
                </div>
                <span className="mt-2 text-xs font-medium text-muted-foreground">
                  {gameStats.totalReviews === 1
                    ? "1 review"
                    : `${gameStats.totalReviews ?? 0} reviews`}
                </span>
              </div>
              <div className="flex-1 w-full">
                <RatingDistribution
                  distribution={gameStats.ratingDistribution}
                  className="w-full"
                />
              </div>
            </div>
          </section>
          {/* Community */}
          <section>
            <GameCommunitySection gameSlug={game.slug} />
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
