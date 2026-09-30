"use client"

import { Separator } from "@/components/ui/separator"
import ReviewCard from "@/features/reviews/components/review-card"
import { useReviews } from "@/features/reviews/hooks"
import dayjs from "dayjs"

export default function Page() {
  const { data: reviews } = useReviews()
  return (
    <div className="flex min-h-svh flex-col bg-secondary p-6">
      <div className="flex h-fit justify-between border-b border-b-secondary py-4">
        <div>
          <span className="tracking-wider text-primary uppercase">
            The games goes on here
          </span>
          <h1 className="font-heading text-6xl">
            Your circle. <br />
            No filters.
          </h1>
        </div>
        <div>{dayjs(Date.now()).format("DD/MM/YYYY")}</div>
      </div>
      <Separator />
      <div>
        {reviews?.items.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  )
}
