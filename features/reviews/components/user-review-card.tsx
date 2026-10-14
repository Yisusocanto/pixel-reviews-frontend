"use client"

import ExpandableText from "@/components/expandable-text"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import StarRating from "@/components/ui/star-rating"
import LikeButton from "@/features/likes/components/like-button"
import ReviewDetailDialog from "@/features/reviews/components/review-detail-dialog"
import ReviewDialog from "@/features/reviews/components/review-dialog"
import { useDeleteReview } from "@/features/reviews/hooks"
import { Review } from "@/features/reviews/types"
import { cn } from "cn"
import dayjs from "dayjs"
import { Ellipsis, Trash } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface Props {
  review: Review
  className?: string
  ownReview?: boolean
}

function UserReviewCard({ review, className, ownReview = false }: Props) {
  const { mutate: deleteReview } = useDeleteReview()
  return (
    <div
      className={cn(
        "flex flex-col justify-between gap-4 p-4 sm:flex-row sm:p-6 lg:p-8",
        className
      )}
    >
      {review.game?.imageUrl && (
        <Link
          href={`/games/${review.game.slug}`}
          className="group relative block aspect-21/9 w-full overflow-hidden rounded-lg border border-border/60 bg-card/40 shadow-md transition-all duration-300 hover:border-primary/50 sm:hidden"
        >
          <Image
            className="absolute inset-0 object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            src={review.game.imageUrl}
            alt={review.game.title ?? ""}
            fill
            sizes="100vw"
          />
        </Link>
      )}

      <div className="hidden shrink-0 sm:block sm:w-36 md:w-44 lg:w-50">
        <div className="relative aspect-2/3 w-full overflow-hidden rounded-md border">
          {review.game?.imageUrl && (
            <Image
              className="absolute inset-0 object-cover"
              src={review.game.imageUrl}
              alt={review.game.title ?? ""}
              fill
              sizes="(max-width: 768px) 144px, (max-width: 1024px) 176px, 200px"
            />
          )}
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between gap-3 sm:flex-2">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="leading-tight">
              <Link
                href={`/games/${review.game?.slug}`}
                className="font-heading text-lg font-bold uppercase transition-colors duration-300 ease-in-out hover:text-primary sm:text-xl"
              >
                {review.game?.title}
              </Link>
              {review.game?.releaseDate && (
                <span className="ml-2 font-sans text-sm font-normal text-muted-foreground">
                  {dayjs(review.game.releaseDate).format("YYYY")}
                </span>
              )}
            </div>
            <StarRating value={review.score} readOnly showValue size="sm" />
          </div>
          <div className="mt-2 flex flex-col gap-1">
            <h3 className="text-xl font-bold break-words text-primary sm:text-2xl">
              {review.title}
            </h3>
            <ExpandableText content={review.content} />
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
          <div className="flex items-center gap-2">
            <LikeButton
              reviewId={review.id}
              likesCount={review.likesCount ?? 0}
              likedByUser={Boolean(review.likedByUser)}
            />
            <ReviewDetailDialog review={review} />
          </div>
          {ownReview && (
            <div className="flex items-center gap-2">
              {review.game && (
                <ReviewDialog game={review.game} review={review} />
              )}
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button variant={"ghost"}>
                      <Ellipsis />
                    </Button>
                  }
                />
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={() => deleteReview(review.id)}
                    className={"text-destructive hover:bg-destructive/50"}
                  >
                    <Trash className="text-destructive" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserReviewCard
