import { Skeleton } from "@/components/ui/skeleton"

function UserReviewCardSkeleton() {
  return (
    <div className="flex flex-col justify-between gap-4 border-b border-b-border p-4 last:border-0 sm:flex-row sm:p-6 lg:p-8">
      <Skeleton className="aspect-21/9 w-full rounded-lg sm:hidden" />
      <Skeleton className="hidden aspect-2/3 shrink-0 rounded-md sm:block sm:w-36 md:w-44 lg:w-50" />
      <div className="flex min-w-0 flex-1 flex-col justify-between gap-3 sm:flex-2">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Skeleton className="h-6 w-2/5" />
            <Skeleton className="h-5 w-24" />
          </div>
          <div className="mt-2 flex flex-col gap-2">
            <Skeleton className="h-7 w-1/2 sm:h-8" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
        <div className="flex items-center gap-2 pt-2">
          <Skeleton className="h-9 w-16" />
          <Skeleton className="h-9 w-28" />
        </div>
      </div>
    </div>
  )
}

export default UserReviewCardSkeleton
