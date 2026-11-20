import * as React from "react"
import { Progress } from "@/components/ui/c-rating-6-utils/progress"
import { cn } from "@/lib/utils"
import { Star } from "lucide-react"

export interface RatingDistributionRow {
  stars: number
  count: number
  percentage?: number
}

export interface RatingDistributionProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Array of rating distribution rows.
   * If percentage is not provided, it will be automatically computed based on total counts.
   */
  distribution?: RatingDistributionRow[]
  /**
   * Whether to show the review count. Defaults to true.
   */
  showCount?: boolean
  /**
   * Whether to show percentage. Defaults to true.
   */
  showPercentage?: boolean
  /**
   * Whether to show star icon next to the number. Defaults to true.
   */
  showStarIcon?: boolean
  /**
   * Optional custom class for the progress bar.
   */
  progressClassName?: string
}

const defaultDistribution: RatingDistributionRow[] = [
  { stars: 5, count: 124, percentage: 62 },
  { stars: 4, count: 45, percentage: 22 },
  { stars: 3, count: 18, percentage: 9 },
  { stars: 2, count: 8, percentage: 4 },
  { stars: 1, count: 5, percentage: 3 },
]

export function RatingDistribution({
  distribution = defaultDistribution,
  showCount = true,
  showPercentage = true,
  showStarIcon = true,
  progressClassName,
  className,
  ...props
}: RatingDistributionProps) {
  const rowsSource =
    distribution && distribution.length > 0 ? distribution : defaultDistribution

  const map = new Map<number, RatingDistributionRow>()
  for (const row of rowsSource) {
    if (row.stars > 0) {
      map.set(row.stars, row)
    }
  }

  const normalizedDistribution: RatingDistributionRow[] = []
  for (let s = 5; s >= 1; s--) {
    const existing = map.get(s)
    normalizedDistribution.push(existing ?? { stars: s, count: 0 })
  }

  const totalCount = normalizedDistribution.reduce(
    (acc, row) => acc + (row.count || 0),
    0
  )

  return (
    <div className={cn("w-full space-y-1.5", className)} {...props}>
      {normalizedDistribution.map((row) => {
        const rawPercentage =
          row.percentage !== undefined
            ? Number(row.percentage) || 0
            : totalCount > 0
              ? ((row.count || 0) / totalCount) * 100
              : 0
        const percentage = Math.round(rawPercentage)

        return (
          <div
            key={row.stars}
            className="group flex items-center gap-3 py-0.5 text-sm"
            title={`${row.count} ${row.count === 1 ? "review" : "reviews"} (${percentage}%)`}
          >
            <div className="flex w-7 shrink-0 items-center justify-end gap-1 text-xs font-semibold text-foreground/80">
              <span>{row.stars}</span>
              {showStarIcon && (
                <Star
                  aria-hidden="true"
                  className="size-3.5 shrink-0 fill-primary text-primary"
                />
              )}
            </div>

            <Progress
              value={percentage}
              aria-label={`${row.stars} star ratings: ${percentage}% (${row.count} ${row.count === 1 ? "review" : "reviews"})`}
              className={cn("h-2 flex-1", progressClassName)}
            />

            <div className="flex min-w-16 shrink-0 items-center justify-end gap-1.5 text-right text-xs tabular-nums">
              {showPercentage && (
                <span className="font-medium text-foreground/90">
                  {percentage}%
                </span>
              )}
              {showCount && (
                <span className="text-[11px] text-muted-foreground/70">
                  ({row.count})
                </span>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export const Pattern = RatingDistribution
export default RatingDistribution
