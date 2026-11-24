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
    <div className="flex flex-1 flex-col">
      <header className="relative isolate overflow-hidden border-b border-border/80 bg-background/60 px-4 py-8 sm:px-6 sm:py-10 lg:px-10">
        <div className="app-grid pointer-events-none absolute inset-0 -z-10" />
        <div className="pointer-events-none absolute -top-24 right-[-10%] -z-10 size-80 rounded-full bg-primary/12 blur-[100px]" />

        <div className="mx-auto flex w-full max-w-7xl flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div className="space-y-2">
            <span className="inline-block font-mono text-xs font-semibold tracking-[0.25em] text-primary uppercase">
              Community Pulse
            </span>
            <h1 className="font-heading text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              Charts &amp; Stats
            </h1>
            <p className="max-w-xl text-sm text-muted-foreground sm:text-base">
              Rankings, trends and numbers from everything the Pixel Reviews
              community plays, rates and writes about.
            </p>
          </div>

          <div className="flex items-stretch gap-3">
            <div className="rounded-xl border border-border bg-card px-4 py-3 shadow-sm sm:min-w-36 sm:text-right">
              <p className="font-mono text-[10px] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                Total Reviews
              </p>
              <p className="mt-1 font-heading text-2xl font-black tracking-tight tabular-nums sm:text-3xl">
                {stats.totalReviews.total.toLocaleString()}
              </p>
            </div>

            {weeklyReviews > 0 && (
              <div className="rounded-xl border border-primary/30 bg-primary/8 px-4 py-3 shadow-sm sm:min-w-36 sm:text-right">
                <p className="font-mono text-[10px] font-semibold tracking-[0.2em] text-primary uppercase">
                  Last 7 Days
                </p>
                <p className="mt-1 font-heading text-2xl font-black tracking-tight text-primary tabular-nums sm:text-3xl">
                  +{weeklyReviews.toLocaleString()}
                </p>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 p-4 sm:p-6 lg:p-10">
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
          <TopRatedSection games={stats.topRatedGames} />
          <MostReviewedSection games={stats.topReviewedGames} />
        </div>

        <MostAnticipatedSection games={stats.topWantedGames} />

        <TopReviewersSection users={stats.topUsersWithTheMostReviews} />
      </div>
    </div>
  )
}
