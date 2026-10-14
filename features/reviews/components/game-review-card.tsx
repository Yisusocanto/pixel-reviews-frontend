"use client"

import ExpandableText from "@/components/expandable-text"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge-2"
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
import Link from "next/link"

interface Props {
  review: Review
  ownReview?: boolean
}

function GameReviewCard({ review, ownReview = false }: Props) {
  const { mutate: deleteReview } = useDeleteReview()

  return (
    <div
      className={cn(
        "flex flex-col gap-4 border-b border-b-border py-4 sm:py-6",
        ownReview && "rounded-2xl border-2 border-primary bg-card p-4 sm:p-6 md:p-8"
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <div className="flex flex-wrap items-center gap-2">
            <Avatar className="size-7 sm:size-8">
              <AvatarImage src={review.user?.profilePhotoUrl} />
              <AvatarFallback className="text-[10px] sm:text-xs uppercase">
                <span>{review.user?.username?.slice(0, 2) ?? "U"}</span>
              </AvatarFallback>
            </Avatar>
            <Link
              href={`/users/${review.user?.username}`}
              className="text-sm sm:text-base font-bold transition-colors duration-300 ease-in-out hover:text-primary"
            >
              @{review.user?.username}
            </Link>
            {ownReview && <Badge className="w-fit text-xs">Your review</Badge>}
          </div>
          <span className="text-[11px] text-muted-foreground sm:text-xs">
            {dayjs(review.createdAt).format("DD/MM/YYYY")}
          </span>
        </div>
        {ownReview && (
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant={"ghost"} size="icon-sm">
                    <Ellipsis className="size-4" />
                  </Button>
                }
              />
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={() => deleteReview(review.id)}
                  className={"text-destructive hover:bg-destructive/50"}
                >
                  <Trash className="text-destructive size-4" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <StarRating value={review.score} showValue readOnly size="sm" />
        <div className="space-y-1">
          {review.title && (
            <h3 className="text-xl font-bold break-words sm:text-2xl md:text-3xl">
              {review.title}
            </h3>
          )}
          {review.content && <ExpandableText content={review.content} />}
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
        <div className="flex flex-wrap items-center gap-2">
          <LikeButton
            reviewId={review.id}
            likesCount={review.likesCount ?? 0}
            likedByUser={Boolean(review.likedByUser)}
          />
          <ReviewDetailDialog review={review} />
        </div>
        {review.game && ownReview && (
          <ReviewDialog game={review.game} review={review} />
        )}
      </div>
    </div>
  )
}

export default GameReviewCard
