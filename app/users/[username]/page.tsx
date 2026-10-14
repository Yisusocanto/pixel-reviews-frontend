import { auth } from "@/auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import RatingDistributionCard from "@/components/ui/rating-distribution-card"
import { getUserAction, getUserStatsAction } from "@/features/users/actions"
import ProfilePhotoDialog from "@/features/users/components/profile-photo-dialog"
import UpdateUserDialog from "@/features/users/components/update-user-dialog"
import UserReviewSection from "@/features/users/components/users-reviews-section"
import UsersWishlistSection from "@/features/users/components/users-wishlist-section"
import { User, UserStats } from "@/features/users/types"
import dayjs from "dayjs"

async function UserPage({ params }: { params: Promise<{ username: string }> }) {
  const session = await auth()
  const { username } = await params
  let user: User | undefined = undefined
  let userStats: UserStats | undefined = undefined
  try {
    ;[user, userStats] = await Promise.all([
      getUserAction(username),
      getUserStatsAction(username),
    ])
  } catch (error) {
    console.log(error)
  }

  const ownProfile = session?.user.username == username

  return (
    <div>
      <header className="relative flex flex-col gap-4 border-b border-b-border p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="relative inline-block shrink-0">
              <Avatar className="size-20 sm:size-24 md:size-28">
                <AvatarImage
                  src={user?.profilePhotoUrl ?? undefined}
                  alt={user?.username}
                  className="object-cover"
                />
                <AvatarFallback className="text-2xl font-bold uppercase sm:text-3xl md:text-4xl">
                  {user?.username?.slice(0, 2) ?? "U"}
                </AvatarFallback>
              </Avatar>
              {ownProfile && (
                <div className="absolute right-0 bottom-0 z-10 translate-x-1 translate-y-1">
                  <ProfilePhotoDialog initialImageUrl={user?.profilePhotoUrl} />
                </div>
              )}
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-2xl font-extrabold sm:text-3xl md:text-4xl">
                @{user?.username}
              </h1>
              <span className="mt-1 block text-xs text-muted-foreground sm:text-sm">
                joined {dayjs(user?.createdAt).format("DD/MM/YYYY")}
              </span>
            </div>
          </div>
          <div className="self-start sm:self-auto">
            {ownProfile && <UpdateUserDialog user={user} />}
          </div>
        </div>
        {user?.bio && (
          <div>
            <p className="text-sm text-muted-foreground sm:text-base">
              {user.bio}
            </p>
          </div>
        )}
        <div className="flex flex-wrap items-center gap-3 pt-1 sm:gap-6">
          <span className="text-sm text-muted-foreground uppercase sm:text-base">
            <strong className="text-primary">
              {userStats?.totalReviews ?? 0}
            </strong>{" "}
            Reviews
          </span>
          <span className="text-sm text-muted-foreground uppercase sm:text-base">
            <strong className="text-primary">
              {userStats?.totalRatings ?? 0}
            </strong>{" "}
            Ratings
          </span>
          <span className="text-sm text-muted-foreground uppercase sm:text-base">
            <strong className="text-primary">
              {userStats?.totalLikes ?? 0}
            </strong>{" "}
            Likes
          </span>
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-col justify-between gap-8 p-4 sm:p-6 lg:flex-row lg:gap-10 lg:p-8">
        {/* Rating stats & Reviews */}
        <div className="order-2 flex min-w-0 flex-2 flex-col gap-8 sm:gap-10 lg:order-1">
          {/* Rating stats section */}
          <RatingDistributionCard
            avgRating={userStats?.avgRating}
            totalReviews={userStats?.totalReviews}
            distribution={userStats?.ratingDistribution}
          />

          {/* Reviews */}
          <div>
            <UserReviewSection username={username} ownReview={ownProfile} />
          </div>
        </div>

        {/* Wishlist */}
        <div className="order-1 min-w-0 flex-1 lg:order-2">
          <UsersWishlistSection username={username} />
        </div>
      </div>
    </div>
  )
}

export default UserPage
