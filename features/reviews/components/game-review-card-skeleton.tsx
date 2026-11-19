import { Skeleton } from "@/components/ui/skeleton"

function GameReviewCardSkeleton() {
  return (
    <div className="flex flex-col gap-4 border-b border-b-border py-4 sm:py-6">
      <div className="flex items-center gap-2">
        <Skeleton className="size-7 rounded-full sm:size-8" />
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-7 w-1/2 sm:h-8" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <div className="flex items-center gap-2 pt-2">
        <Skeleton className="h-9 w-16" />
        <Skeleton className="h-9 w-28" />
      </div>
    </div>
  )
}

export default GameReviewCardSkeleton
