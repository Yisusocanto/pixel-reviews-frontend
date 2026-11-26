import ShareDialog from "@/components/share/share-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import StarRating from "@/components/ui/star-rating"
import LikeButton from "@/features/likes/components/like-button"
import { getReviewByIdAction } from "@/features/reviews/actions"
import ReviewDetailDialog from "@/features/reviews/components/review-detail-dialog"
import { Review } from "@/features/reviews/types"
import { getIgdbImageUrl } from "@/lib/igdb-image"
import { truncateText } from "@/lib/og-image-utils"
import dayjs from "dayjs"
import { ArrowRight, Share2 } from "lucide-react"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { cache } from "react"

const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://www.pixelreviews.app"

const getCachedReview = cache(async (id: string): Promise<Review> => {
  return getReviewByIdAction(id)
})

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params

  try {
    const review = await getCachedReview(id)
    const username = review.user?.username || "Player"
    const gameTitle = review.game?.title || "Game"
    const pageTitle = review.title?.trim()
      ? `${review.title} — @${username}'s ${gameTitle} Review (${review.score}/5★)`
      : `@${username}'s ${gameTitle} Rating (${review.score}/5★)`
    const description = review.content?.trim()
      ? truncateText(review.content, 158)
      : `See @${username}'s ${review.score}/5 star rating for ${gameTitle} on Pixel Reviews.`

    return {
      title: pageTitle,
      description,
      alternates: {
        canonical: `/reviews/${review.id}`,
      },
      openGraph: {
        type: "article",
        title: `${pageTitle} | Pixel Reviews`,
        description,
        url: `/reviews/${review.id}`,
      },
      twitter: {
        card: "summary_large_image",
        title: `${pageTitle} | Pixel Reviews`,
        description,
      },
    }
  } catch {
    return {
      title: "Review Not Found",
      robots: { index: false },
    }
  }
}

export default async function ReviewPermalinkPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  let review: Review

  try {
    review = await getCachedReview(id)
  } catch {
    notFound()
  }

  const game = review.game
  const username = review.user?.username || "player"
  const backdrop = game?.backgroundImage || game?.imageUrl

  const reviewJsonLd = {
    "@context": "https://schema.org",
    "@type": "Review",
    name: review.title || `${game?.title ?? "Game"} review by @${username}`,
    reviewBody: review.content || undefined,
    datePublished: dayjs(review.createdAt).isValid()
      ? dayjs(review.createdAt).format("YYYY-MM-DD")
      : undefined,
    author: {
      "@type": "Person",
      name: username,
      url: `${SITE_URL}/users/${username}`,
    },
    itemReviewed: game
      ? {
          "@type": "VideoGame",
          name: game.title,
          url: `${SITE_URL}/games/${game.slug}`,
          image: game.imageUrl || undefined,
        }
      : undefined,
    reviewRating: {
      "@type": "Rating",
      ratingValue: review.score,
      bestRating: 5,
      worstRating: 1,
    },
  }

  return (
    <div className="relative min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewJsonLd) }}
      />

      <div className="relative overflow-hidden border-b border-border bg-zinc-950 py-10 sm:py-14">
        {backdrop && (
          <Image
            src={getIgdbImageUrl(backdrop, "t_720p")}
            alt=""
            aria-hidden="true"
            fill
            priority
            className="object-cover opacity-30 blur-[2px]"
          />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-background via-zinc-950/80 to-zinc-950/40" />

        <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Avatar className="size-10 border border-border">
                <AvatarImage
                  src={review.user?.profilePhotoUrl}
                  alt={`@${username}`}
                />
                <AvatarFallback className="font-bold uppercase">
                  {username.slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div>
                <Link
                  href={`/users/${username}`}
                  className="font-mono text-sm font-bold text-foreground transition-colors hover:text-primary"
                >
                  @{username}
                </Link>
                {dayjs(review.createdAt).isValid() && (
                  <p className="font-mono text-xs text-muted-foreground">
                    Logged on {dayjs(review.createdAt).format("DD/MM/YYYY")}
                  </p>
                )}
              </div>
            </div>

            <ShareDialog
              target={{
                kind: "review",
                reviewId: review.id,
                gameTitle: game?.title || "Game",
                score: review.score,
                username,
                reviewTitle: review.title,
              }}
              trigger={
                <Button variant="secondary" size="sm" className="gap-2">
                  <Share2 className="size-4 text-primary" />
                  <span>Share Card</span>
                </Button>
              }
            />
          </div>

          <div className="flex flex-col gap-6 rounded-2xl border border-border bg-card/95 p-6 shadow-2xl backdrop-blur-md sm:flex-row sm:p-8">
            {game?.imageUrl && (
              <Link
                href={`/games/${game.slug}`}
                className="group relative mx-auto aspect-2/3 w-36 shrink-0 overflow-hidden rounded-xl border border-border shadow-lg sm:mx-0 sm:w-44"
              >
                <Image
                  src={getIgdbImageUrl(game.imageUrl, "t_cover_big")}
                  alt={`${game.title} cover art`}
                  fill
                  sizes="176px"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  priority
                />
              </Link>
            )}

            <div className="flex min-w-0 flex-1 flex-col justify-between gap-5">
              <div className="space-y-3">
                {game && (
                  <div className="flex flex-wrap items-baseline gap-2.5">
                    <Link
                      href={`/games/${game.slug}`}
                      className="font-heading text-2xl font-black tracking-tight uppercase transition-colors hover:text-primary sm:text-3xl"
                    >
                      {game.title}
                    </Link>
                    {game.releaseDate && dayjs(game.releaseDate).isValid() && (
                      <span className="font-mono text-sm text-muted-foreground">
                        {dayjs(game.releaseDate).format("YYYY")}
                      </span>
                    )}
                  </div>
                )}

                <StarRating value={review.score} showValue readOnly size="md" />

                {review.title && (
                  <h1 className="pt-1 text-xl font-bold text-foreground sm:text-2xl">
                    {review.title}
                  </h1>
                )}

                {review.content && (
                  <p className="leading-relaxed whitespace-pre-line text-foreground/90">
                    {review.content}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/70 pt-4">
                <div className="flex flex-wrap items-center gap-2">
                  <LikeButton
                    reviewId={review.id}
                    likesCount={review.likesCount ?? 0}
                    likedByUser={Boolean(review.likedByUser)}
                  />
                  <ReviewDetailDialog review={review} />
                </div>

                {game && (
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="gap-1.5"
                  >
                    <Link href={`/games/${game.slug}`}>
                      <span>See all {game.title} reviews</span>
                      <ArrowRight className="size-3.5" />
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>

          {game && (
            <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-primary/30 bg-primary/8 p-6 text-center sm:flex-row sm:text-left">
              <div className="space-y-1">
                <p className="font-mono text-xs font-semibold tracking-[0.2em] text-primary uppercase">
                  Your Turn
                </p>
                <h2 className="font-heading text-lg font-black sm:text-xl">
                  Agree or disagree with @{username} on {game.title}?
                </h2>
                <p className="text-sm text-muted-foreground">
                  Drop your own unfiltered rating and build your gaming profile
                  on Pixel Reviews.
                </p>
              </div>
              <Button asChild className="shrink-0 gap-2">
                <Link href={`/games/${game.slug}`}>
                  <span>Rate {game.title}</span>
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
