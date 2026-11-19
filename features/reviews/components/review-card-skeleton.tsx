import { Skeleton } from "@/components/ui/skeleton"

function ReviewCardSkeleton() {
  return (
    <div className="flex flex-col gap-4 border-b border-b-border py-8">
      <div className="flex items-center gap-1.5">
        <Skeleton className="size-6 rounded-full sm:size-7" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-36" />
      </div>
      <Skeleton className="aspect-21/9 w-full rounded-lg sm:hidden" />
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <Skeleton className="h-7 w-3/5 sm:h-9 lg:h-10" />
          <Skeleton className="h-5 w-28" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-6 w-2/3 sm:h-8" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
          <div className="flex items-center gap-2 pt-1">
            <Skeleton className="h-9 w-16" />
            <Skeleton className="h-9 w-28" />
          </div>
        </div>
        <Skeleton className="hidden aspect-2/3 w-24 shrink-0 rounded-md sm:block sm:w-28 md:w-32 lg:w-36" />
      </div>
    </div>
  )
}

export default ReviewCardSkeleton
