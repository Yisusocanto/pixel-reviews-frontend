import { Skeleton, SkeletonGroup } from "@/components/ui/skeleton"
import GameReviewCardSkeleton from "@/features/reviews/components/game-review-card-skeleton"

function SidePanelSkeleton() {
  return (
    <>
      <Skeleton className="h-28 w-full rounded-xl" />
      <div className="flex flex-col gap-4">
        <Skeleton className="h-4 w-48" />
        <div className="divide-y divide-border/70 rounded-xl border border-border bg-card p-5">
          {Array.from({ length: 5 }, (_, i) => (
            <div
              key={i}
              className="flex items-center justify-between gap-6 py-3 first:pt-0 last:pb-0"
            >
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="h-4 w-28" />
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

function GameDetailSkeleton() {
  return (
    <SkeletonGroup label="Loading game" className="relative min-h-screen">
      <div className="relative min-h-95 w-full overflow-hidden border-b border-b-border bg-zinc-950 sm:h-96">
        <div className="relative z-10 flex flex-col items-center gap-6 p-4 pt-8 text-center sm:absolute sm:bottom-6 sm:left-8 sm:flex-row sm:items-end sm:p-0 sm:pt-0 sm:text-left">
          <Skeleton className="aspect-2/3 w-36 shrink-0 rounded-lg bg-white/10 sm:w-48 md:w-56" />
          <div className="flex flex-col items-center gap-3 pb-2 sm:items-start sm:gap-4">
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16 rounded-full bg-white/10" />
              <Skeleton className="h-6 w-20 rounded-full bg-white/10" />
            </div>
            <Skeleton className="h-8 w-64 bg-white/10 md:h-10 md:w-96" />
            <div className="flex gap-3">
              <Skeleton className="h-9 w-40 bg-white/10" />
              <Skeleton className="h-9 w-32 bg-white/10" />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-between gap-10 p-4 sm:p-6 lg:flex-row lg:gap-16 lg:p-12">
        <div className="flex flex-2 flex-col gap-12 sm:gap-16">
          <div className="flex flex-col gap-2.5">
            <Skeleton className="mb-2 h-4 w-28" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <Skeleton className="aspect-video w-full rounded-xl" />
          <div className="flex flex-col gap-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-32 w-full rounded-xl" />
          </div>
          <div className="flex flex-col gap-8 lg:hidden">
            <SidePanelSkeleton />
          </div>
          <div className="flex flex-col gap-4">
            <Skeleton className="h-4 w-40" />
            <GameReviewCardSkeleton />
            <GameReviewCardSkeleton />
          </div>
        </div>
        <div className="hidden flex-1 flex-col gap-10 lg:flex">
          <SidePanelSkeleton />
        </div>
      </div>
    </SkeletonGroup>
  )
}

export default GameDetailSkeleton
