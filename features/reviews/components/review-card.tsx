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
      <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground sm:text-sm">
        <Avatar className="size-6 sm:size-7">
          <AvatarImage src={review.user?.profilePhotoUrl} />
          <AvatarFallback className="text-[10px] sm:text-xs">
            <span>{review.user?.username?.slice(0, 2) ?? "U"}</span>
          </AvatarFallback>
        </Avatar>
        <Link
          href={`/users/${review.user?.username}`}
          className="font-bold text-foreground transition-colors duration-300 ease-in-out hover:text-primary"
        >
          {review.user?.username}
        </Link>
        <span>reviewed a game on</span>
        <strong className="text-foreground">
          {dayjs(review.createdAt).format("DD/MM/YYYY")}
        </strong>
      </div>
      {review.game?.imageUrl && (
        <Link
          href={`/games/${review.game.slug}`}
          className="group relative block aspect-21/9 sm:aspect-16/7 md:aspect-16/6 w-full overflow-hidden rounded-lg border border-border/60 bg-card/40 shadow-md transition-all duration-300 hover:border-primary/50"
        >
          <Image
            src={review.game.imageUrl}
            alt={review.game.title || "Game cover"}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 900px"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-t from-background/80 via-transparent to-transparent" />
          <div className="absolute bottom-2 left-3 right-3 flex items-end justify-between gap-2">
            <span className="font-heading text-sm font-extrabold tracking-tight uppercase text-foreground drop-shadow-md sm:text-base">
              {review.game.title}
            </span>
            {review.game.releaseDate && (
              <span className="rounded bg-background/80 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-primary backdrop-blur-xs">
                {dayjs(review.game.releaseDate).format("YYYY")}
              </span>
            )}
          </div>
        </Link>
      )}

      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Link
            href={`/games/${review.game?.slug}`}
            className="font-heading text-xl font-extrabold uppercase transition-colors duration-300 hover:text-primary sm:text-2xl md:text-3xl"
          >
            {review.game?.title}
          </Link>
          <StarRating value={review.score} showValue readOnly size="md" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-bold break-words sm:text-xl md:text-2xl">
            {review.title}
          </h3>
          <ExpandableText content={review.content} />
        </div>
        <div className="flex flex-wrap items-center gap-2 pt-1">
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
    </div>
  )
}

export default ReviewCard
