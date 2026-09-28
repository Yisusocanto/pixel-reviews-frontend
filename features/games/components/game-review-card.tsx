import StarRating from "@/components/ui/star-rating"
import { Review } from "@/features/reviews/types"
import dayjs from "dayjs"
import Link from "next/link"

interface Props {
  review: Review
}

function GameReviewCard({ review }: Props) {
  return (
    <div className="flex flex-col gap-4 border-b border-b-border py-6">
      <div className="flex flex-col">
        <Link href={`/users/${review.user?.username}`} className="font-bold">
          @{review.user?.username}
        </Link>
        <span className="text-xs text-muted-foreground">
          {dayjs(review.createAt).format("DD/MM/YYYY")}
        </span>
      </div>
      <div>
        <StarRating value={review.score} showValue readOnly />
        <div>
          <h3 className="text-3xl font-bold">{review.title}</h3>
          <p className="text-muted-foreground">{review.content}</p>
        </div>
      </div>
    </div>
  )
}

export default GameReviewCard
