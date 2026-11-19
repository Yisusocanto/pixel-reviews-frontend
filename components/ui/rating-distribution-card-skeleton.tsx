import { Skeleton } from "@/components/ui/skeleton"

function RatingDistributionCardSkeleton() {
  return (
    <div className="flex flex-col items-center gap-6 rounded-2xl border border-border/60 bg-card/40 p-4 sm:flex-row sm:gap-8 sm:p-6 md:gap-10">
      <div className="flex w-full shrink-0 flex-col items-center justify-center gap-2.5 border-b border-border/40 pb-4 sm:w-auto sm:min-w-44 sm:border-r sm:border-b-0 sm:pr-8 sm:pb-0">
        <Skeleton className="h-12 w-28" />
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-3 w-16" />
      </div>
      <div className="flex w-full flex-1 flex-col gap-2.5">
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-3 w-6" />
            <Skeleton className="h-2 flex-1 rounded-full" />
            <Skeleton className="h-3 w-8" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default RatingDistributionCardSkeleton
