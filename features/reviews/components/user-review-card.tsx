"use client"

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
    <div className={cn("flex justify-between gap-4 p-8", className)}>
      <div className="flex-1">
        <div className="relative aspect-2/3 w-50 overflow-hidden border">
          <Image
            className="absolute inset-0 object-cover"
            src={review.game?.imageUrl ?? ""}
            alt={review.game?.title ?? ""}
            fill
          />
        </div>
      </div>
      <div className="flex flex-2 flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Link
              href={`/games/${review.game?.slug}`}
              className="text-lg font-bold transition-colors duration-300 ease-in-out hover:text-primary"
            >
              {review.game?.title}
            </Link>
            <span className="place-content-end text-muted-foreground">
              {dayjs(review.game?.releaseDate).format("YYYY")}
            </span>
          </div>
          <StarRating value={review.score} readOnly showValue />
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="text-2xl font-bold text-primary">{review.title}</h3>
          <p>{review.content}</p>
        </div>
        <div className="flex items-center justify-between pt-2">
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
