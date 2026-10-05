"use client"

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
        "flex flex-col gap-4 border-b border-b-border py-6",
        ownReview && "rounded-2xl border-2 border-primary bg-card p-8"
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <Avatar className="size-8">
              <AvatarImage src={review.user?.profilePhotoUrl} />
              <AvatarFallback className="uppercase">
                <span>{review.user?.username.slice(0, 2)}</span>
              </AvatarFallback>
            </Avatar>
            <Link
              href={`/users/${review.user?.username}`}
              className="font-bold transition-colors duration-300 ease-in-out hover:text-primary"
            >
              @{review.user?.username}
            </Link>
            {ownReview && <Badge className="w-fit">Your review</Badge>}
          </div>
          <span className="text-xs text-muted-foreground">
            {dayjs(review.createAt).format("DD/MM/YYYY")}
          </span>
        </div>
        {ownReview && (
          <div>
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
      <div>
        <StarRating value={review.score} showValue readOnly />
        <div>
          <h3 className="text-3xl font-bold">{review.title}</h3>
          <p className="text-muted-foreground">{review.content}</p>
        </div>
      </div>
      <div className="flex items-center justify-between pt-2">
        <LikeButton
          reviewId={review.id}
          likesCount={review.likesCount ?? 0}
          likedByUser={Boolean(review.likedByUser)}
        />
        {review.game && ownReview && (
          <ReviewDialog game={review.game} review={review} />
        )}
      </div>
    </div>
  )
}

export default GameReviewCard
