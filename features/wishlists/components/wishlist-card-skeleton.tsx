import { Skeleton } from "@/components/ui/skeleton"

function WishlistCardSkeleton() {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-b-border py-3 last:border-0">
      <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
        <Skeleton className="aspect-2/3 w-12 shrink-0 rounded-md" />
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <Skeleton className="h-5 w-3/4 sm:h-6" />
          <Skeleton className="h-3.5 w-10" />
        </div>
      </div>
    </div>
  )
}

export default WishlistCardSkeleton
