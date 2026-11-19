import { Skeleton } from "@/components/ui/skeleton"

function ModerationItemSkeleton() {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 shadow-xs sm:p-6">
      <div className="flex flex-col gap-2.5 border-b border-border/60 pb-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-40 sm:h-7" />
            <Skeleton className="h-5 w-8" />
            <Skeleton className="h-5 w-16" />
          </div>
          <Skeleton className="h-3 w-36" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="size-6 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-5 w-1/2" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      <div className="flex gap-2 pt-1">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-24" />
      </div>
    </div>
  )
}

export default ModerationItemSkeleton
