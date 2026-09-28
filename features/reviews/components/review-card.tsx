import StarRating from "@/components/ui/star-rating"
import { Review } from "@/features/reviews/types"
import dayjs from "dayjs"
import Image from "next/image"
import Link from "next/link"
import React from "react"

interface Props {
  review: Review
}

function ReviewCard({ review }: Props) {
  return (
    <div className="flex flex-col gap-4 border-b border-b-border py-8">
      <div className="flex gap-2">
        <span className="text-muted-foreground">
          <Link
            href={`/users/${review.user?.username}`}
            className="font-bold text-foreground hover:text-primary"
          >
            {review.user?.username}
          </Link>{" "}
          reviewed a game on
        </span>
        <span className="text-muted-foreground">
          {dayjs(review.createAt).format("DD/MM/YYYY")}
        </span>
      </div>
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-3">
          <div className="flex gap-2">
            <Link
              href={`/games/${review.game?.slug}`}
              className="font-heading text-4xl font-extrabold uppercase hover:text-primary"
            >
              {review.game?.title}
            </Link>
            <span className="flex-col place-content-end text-muted-foreground">
              {dayjs(review.game?.releaseDate).format("YYYY")}
            </span>
          </div>
          <StarRating value={review.score} showValue readOnly size="md" />
          <div>
            <h3 className="text-2xl font-bold">{review.title}</h3>
            <p className="text-lg text-muted-foreground">{review.content}</p>
          </div>
        </div>
        <div className="shrink-0">
          <div className="relative aspect-2/3 w-28 overflow-hidden rounded-md border bg-card/10 shadow-2xl sm:w-36">
            {review.game?.imageUrl && (
              <Image
                src={review.game.imageUrl}
                alt={review.game.title || "Game cover"}
                fill
                sizes="(max-width: 768px) 192px, 224px"
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
