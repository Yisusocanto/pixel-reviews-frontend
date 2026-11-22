import { getStatisticsAction } from "@/features/charts/actions"
import { MostAnticipatedSection } from "@/features/charts/components/most-anticipated-section"
import { MostReviewedSection } from "@/features/charts/components/most-reviewed-section"
import { TopRatedSection } from "@/features/charts/components/top-rated-section"
import { TopReviewersSection } from "@/features/charts/components/top-reviewers-section"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Charts & Stats",
  description:
    "Rankings, trends and numbers from everything the Pixel Reviews community plays, rates and writes about.",
}

export default async function ChartsPage() {
  const stats = await getStatisticsAction()
  const weeklyReviews = Math.round(stats.totalReviews.lastWeek)

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 p-4 sm:gap-10 sm:p-6 lg:p-10">
      <header className="flex flex-col justify-between gap-6 border-b border-border/60 pb-6 sm:flex-row sm:items-end">
        <div className="space-y-2">
          <span className="text-xs font-semibold tracking-widest text-primary uppercase">
            Community Pulse
          </span>
          <h1 className="font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
            Charts &amp; Stats
          </h1>
          <p className="max-w-xl text-sm text-muted-foreground sm:text-base">
            Rankings, trends and numbers from everything the Pixel Reviews
            community plays, rates and writes about.
          </p>
        </div>

        <div className="flex items-baseline gap-6 sm:text-right">
          <div>
            <p className="text-[11px] font-semibold tracking-widest text-muted-foreground uppercase">
              Total Reviews
            </p>
            <p className="font-heading text-3xl font-extrabold tracking-tight tabular-nums sm:text-4xl">
              {stats.totalReviews.total.toLocaleString()}
            </p>
          </div>

          {weeklyReviews > 0 && (
            <div className="border-l border-border/70 pl-6">
              <p className="text-[11px] font-semibold tracking-widest text-muted-foreground uppercase">
                Last 7 Days
              </p>
              <p className="font-heading text-3xl font-extrabold tracking-tight text-primary tabular-nums sm:text-4xl">
                +{weeklyReviews.toLocaleString()}
              </p>
            </div>
          )}
        </div>
      </header>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
        <TopRatedSection games={stats.topRatedGames} />
        <MostReviewedSection games={stats.topReviewedGames} />
      </div>

      <MostAnticipatedSection games={stats.topWantedGames} />

      <TopReviewersSection users={stats.topUsersWithTheMostReviews} />
    </div>
  )
}
