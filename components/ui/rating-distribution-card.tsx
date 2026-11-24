import RatingDistribution, {
  RatingDistributionRow,
} from "@/components/ui/c-rating-6"
import StarRating from "@/components/ui/star-rating"
import { cn } from "@/lib/utils"

export interface RatingDistributionCardProps {
  avgRating?: number | string | null
  totalReviews?: number | null
  distribution?: RatingDistributionRow[]
  showCount?: boolean
  showPercentage?: boolean
  reviewsLabel?: string
  className?: string
}

export function RatingDistributionCard({
  avgRating,
  totalReviews = 0,
  distribution,
  showCount = true,
  showPercentage = true,
  reviewsLabel = "reviews",
  className,
}: RatingDistributionCardProps) {
  const numericAvg = Number(avgRating) || 0
  const formattedAvg = numericAvg > 0 ? numericAvg.toFixed(1) : "0.0"
  const total = totalReviews ?? 0

  const countText =
    total === 1
      ? `1 ${reviewsLabel.replace(/s$/, "")}`
      : `${total} ${reviewsLabel}`

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-6 rounded-xl border border-border bg-card p-5 shadow-sm sm:flex-row sm:gap-8 sm:p-6 md:gap-10",
        className
      )}
    >
      <div className="flex w-full shrink-0 flex-col items-center justify-center border-b border-border/70 pb-5 sm:w-auto sm:min-w-44 sm:border-r sm:border-b-0 sm:pr-8 sm:pb-0">
        <div className="flex items-baseline gap-1.5">
          <span className="font-heading text-5xl font-black tracking-tight text-foreground tabular-nums">
            {formattedAvg}
          </span>
          <span className="font-mono text-base font-semibold text-muted-foreground">
            / 5
          </span>
        </div>
        <div className="mt-2.5">
          <StarRating value={numericAvg} size="md" readOnly />
        </div>
        <span className="mt-2.5 font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
          {countText}
        </span>
      </div>

      <div className="w-full flex-1">
        <RatingDistribution
          distribution={distribution}
          showCount={showCount}
          showPercentage={showPercentage}
          className="w-full"
        />
      </div>
    </div>
  )
}

export default RatingDistributionCard
