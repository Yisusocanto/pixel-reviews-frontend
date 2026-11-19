import RatingDistributionCardSkeleton from "@/components/ui/rating-distribution-card-skeleton"
import { Skeleton, SkeletonGroup } from "@/components/ui/skeleton"
import UserReviewCardSkeleton from "@/features/reviews/components/user-review-card-skeleton"
import WishlistCardSkeleton from "@/features/wishlists/components/wishlist-card-skeleton"

function UserProfileSkeleton() {
  return (
    <SkeletonGroup label="Loading profile">
      <header className="flex flex-col gap-4 border-b border-b-border p-4 sm:p-6 lg:p-8">
        <div className="flex items-center gap-4">
          <Skeleton className="size-20 shrink-0 rounded-full sm:size-24 md:size-28" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-8 w-40 sm:h-9 md:h-10 md:w-56" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <Skeleton className="h-4 w-full max-w-md" />
        <div className="flex flex-wrap items-center gap-3 pt-1 sm:gap-6">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-16" />
        </div>
      </header>
      <div className="flex flex-col gap-8 p-4 sm:p-6 lg:p-8">
        <div>
          <Skeleton className="mb-4 h-8 w-48" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-5 lg:gap-6">
            {Array.from({ length: 5 }, (_, i) => (
              <Skeleton key={i} className="aspect-2/3 w-full rounded-lg" />
            ))}
          </div>
        </div>
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:gap-10">
          <div className="order-2 flex min-w-0 flex-2 flex-col gap-8 sm:gap-10 lg:order-1">
            <RatingDistributionCardSkeleton />
            <div className="border-t border-t-border">
              <Skeleton className="mt-3 h-8 w-28" />
              <UserReviewCardSkeleton />
            </div>
          </div>
          <div className="order-1 min-w-0 flex-1 lg:order-2">
            <Skeleton className="mb-2 h-8 w-32" />
            {Array.from({ length: 3 }, (_, i) => (
              <WishlistCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </SkeletonGroup>
  )
}

export default UserProfileSkeleton
