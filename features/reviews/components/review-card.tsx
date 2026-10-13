import ExpandableText from "@/components/expandable-text"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import StarRating from "@/components/ui/star-rating"
import LikeButton from "@/features/likes/components/like-button"
import { Review } from "@/features/reviews/types"
import { cn } from "cn"
import dayjs from "dayjs"
import { MessageSquare } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import React from "react"

interface Props {
  review: Review
  onCommentButtonClick: (review: Review) => void
  commentsSelected?: boolean
}

function ReviewCard({
  review,
  onCommentButtonClick,
  commentsSelected = false,
}: Props) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 border-b border-b-border py-8 transition-colors",
        commentsSelected && "bg-muted/15"
      )}
    >
      <div className="flex gap-2">
        <span className="flex items-center gap-2 text-muted-foreground">
          <Avatar className="size-8">
            <AvatarImage src={review.user?.profilePhotoUrl} />
            <AvatarFallback>
              <span>{review.user?.username.slice(0, 2)}</span>
            </AvatarFallback>
          </Avatar>
          <Link
            href={`/users/${review.user?.username}`}
            className="font-bold text-foreground transition-colors duration-300 ease-in-out hover:text-primary"
          >
            {review.user?.username}
          </Link>{" "}
          reviewed a game on{" "}
          <strong>
            {dayjs(review.createdAt).format("DD/MM/YYYY")}
          </strong>
        </span>
      </div>
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <div className="leading-tight">
            <Link
              href={`/games/${review.game?.slug}`}
              className="font-heading text-2xl font-extrabold uppercase transition-colors duration-300 hover:text-primary sm:text-3xl lg:text-4xl"
            >
              {review.game?.title}
            </Link>
            {review.game?.releaseDate && (
              <span className="ml-2.5 inline-block font-sans text-sm font-normal text-muted-foreground sm:text-base">
                {dayjs(review.game.releaseDate).format("YYYY")}
              </span>
            )}
          </div>
          <StarRating value={review.score} showValue readOnly size="md" />
          <div className="space-y-1">
            <h3 className="text-xl font-bold break-words sm:text-2xl">
              {review.title}
            </h3>
            <ExpandableText content={review.content} />
          </div>
          <div className="flex items-center gap-2 pt-1">
            <LikeButton
              reviewId={review.id}
              likesCount={review.likesCount ?? 0}
              likedByUser={Boolean(review.likedByUser)}
            />
            <Button
              variant={"ghost"}
              onClick={() => onCommentButtonClick(review)}
              className={cn(
                "text-xs font-medium",
                commentsSelected && "text-primary"
              )}
            >
              <MessageSquare className="h-4 w-4 transition-transform duration-200 active:scale-125" />
              {review.commentsCount} comments
            </Button>
          </div>
        </div>
        <div className="shrink-0">
          <div className="relative aspect-2/3 w-24 overflow-hidden rounded-md border bg-card/10 shadow-2xl sm:w-28 md:w-32 lg:w-36">
            {review.game?.imageUrl && (
              <Image
                src={review.game.imageUrl}
                alt={review.game.title || "Game cover"}
                fill
                sizes="(max-width: 640px) 96px, (max-width: 1024px) 128px, 144px"
                className="object-cover"
                priority
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReviewCard
