import ExpandableText from "@/components/expandable-text"
import ShareDialog from "@/components/share/share-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import StarRating from "@/components/ui/star-rating"
import LikeButton from "@/features/likes/components/like-button"
import ReportButton from "@/features/reports/components/report-button"
import { Review } from "@/features/reviews/types"
import { getIgdbImageUrl } from "@/lib/igdb-image"
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
  priority?: boolean
}

function ReviewCard({
  review,
  onCommentButtonClick,
  commentsSelected = false,
  priority = false,
}: Props) {
  return (
    <article
      className={cn(
        "group/card flex flex-col gap-4 rounded-xl border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:border-foreground/18 sm:p-6",
        commentsSelected && "border-primary/60 bg-card ring-1 ring-primary/20"
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-3.5 text-xs text-muted-foreground">
        <div className="flex flex-wrap items-center gap-2">
          <Avatar className="size-6 sm:size-7">
            <AvatarImage
              src={review.user?.profilePhotoUrl}
              alt={
                review.user?.username
                  ? `${review.user.username}'s profile photo`
                  : "User profile photo"
              }
            />
            <AvatarFallback className="text-[10px] font-semibold uppercase sm:text-xs">
              <span>{review.user?.username?.slice(0, 2) ?? "U"}</span>
            </AvatarFallback>
          </Avatar>
          <Link
            href={`/users/${review.user?.username}`}
            className="font-mono text-xs font-semibold text-foreground transition-colors hover:text-primary sm:text-sm"
          >
            @{review.user?.username}
          </Link>
          <span className="text-muted-foreground/80">reviewed</span>
        </div>
        <time
          dateTime={
            dayjs(review.createdAt).isValid()
              ? dayjs(review.createdAt).toISOString()
              : undefined
          }
          className="font-mono text-[11px] tracking-wider text-muted-foreground"
        >
          {dayjs(review.createdAt).format("DD/MM/YYYY")}
        </time>
      </div>
      {review.game?.imageUrl && (
        <Link
          href={`/games/${review.game.slug}`}
          className="group relative block aspect-21/9 w-full overflow-hidden rounded-lg border border-border/80 bg-muted/30 shadow-md transition-all duration-300 hover:border-primary/50 sm:hidden"
        >
          <Image
            src={getIgdbImageUrl(review.game.imageUrl, "t_cover_big")}
            alt={
              review.game.title
                ? `${review.game.title} cover art`
                : "Game cover"
            }
            fill
            sizes="100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            priority={priority}
            {...(priority ? { fetchPriority: "high" } : {})}
          />
        </Link>
      )}

      <div className="flex items-start justify-between gap-5 sm:gap-6">
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1 leading-tight">
            <Link
              href={`/games/${review.game?.slug}`}
              className="font-heading text-xl font-black tracking-tight uppercase transition-colors hover:text-primary sm:text-2xl lg:text-3xl"
            >
              {review.game?.title}
            </Link>
            {review.game?.releaseDate && (
              <span className="font-mono text-xs font-medium text-muted-foreground sm:text-sm">
                {dayjs(review.game.releaseDate).format("YYYY")}
              </span>
            )}
          </div>
          <StarRating value={review.score} showValue readOnly size="md" />
          <div className="space-y-1.5 pt-0.5">
            <h2 className="text-lg font-bold wrap-break-word text-foreground sm:text-xl">
              <Link
                href={`/reviews/${review.id}`}
                className="transition-colors hover:text-primary"
              >
                {review.title}
              </Link>
            </h2>
            <ExpandableText content={review.content} />
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-2 border-t border-border/50 pt-3">
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
                commentsSelected &&
                  "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary"
              )}
            >
              <MessageSquare className="h-4 w-4 transition-transform duration-200 active:scale-125" />
              {review.commentsCount} comments
            </Button>
            <ShareDialog
              target={{
                kind: "review",
                reviewId: review.id,
                gameTitle: review.game?.title || "Game",
                score: review.score,
                username: review.user?.username,
                reviewTitle: review.title,
              }}
            />
            <ReportButton
              targetId={review.id}
              targetType="review"
              authorId={review.userId}
            />
          </div>
        </div>

        <Link
          href={`/games/${review.game?.slug}`}
          className="group/cover hidden shrink-0 sm:block"
        >
          <div className="relative aspect-2/3 w-24 overflow-hidden rounded-lg border border-border/80 bg-muted/30 shadow-lg transition-all duration-300 group-hover/cover:border-primary/60 group-hover/cover:shadow-primary/10 sm:w-28 md:w-32 lg:w-36">
            {review.game?.imageUrl && (
              <Image
                src={getIgdbImageUrl(review.game.imageUrl, "t_cover_big")}
                alt={
                  review.game.title
                    ? `${review.game.title} cover art`
                    : "Game cover"
                }
                fill
                sizes="(max-width: 640px) 96px, (max-width: 1024px) 128px, 144px"
                className="object-cover transition-transform duration-500 group-hover/cover:scale-105"
                priority={priority}
                {...(priority ? { fetchPriority: "high" } : {})}
              />
            )}
          </div>
        </Link>
      </div>
    </article>
  )
}

export default ReviewCard
