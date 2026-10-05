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
      <header className="relative flex flex-col gap-4 border-b border-b-border p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative inline-block">
              <Avatar className="size-30">
                <AvatarImage
                  src={user?.profilePhotoUrl}
                  alt={user?.username}
                  className="object-cover"
                />
                <AvatarFallback className="text-4xl font-bold uppercase">
                  {user?.username.slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              {ownProfile && (
                <div className="absolute right-0 bottom-0 z-10 translate-x-1 translate-y-1">
                  <ProfilePhotoDialog initialImageUrl={user?.profilePhotoUrl} />
                </div>
              )}
            </div>
            <div>
              <h1 className="text-4xl font-extrabold">@{user?.username}</h1>
              <span className="mt-1 text-muted-foreground">
                joined {dayjs(user?.createdAt).format("DD/MM/YYYY")}
              </span>
            </div>
          </div>
          <div>{ownProfile && <UpdateUserDialog user={user} />}</div>
        </div>
        {user?.bio && (
          <div>
            <p className="text-muted-foreground">{user.bio}</p>
          </div>
        )}
        <div className="flex items-center gap-4">
          <span className="text-lg text-muted-foreground uppercase">
            <strong className="text-primary">{userStats?.totalReviews}</strong>{" "}
            Reviews
          </span>
          <span className="text-lg text-muted-foreground uppercase">
            <strong className="text-primary">{userStats?.totalRatings}</strong>{" "}
            Ratings
          </span>
          <span className="text-lg text-muted-foreground uppercase">
            <strong className="text-primary">{userStats?.totalLikes}</strong>{" "}
            Likes
          </span>
        </div>
      </header>

      {/* Body */}
      <div className="flex justify-between gap-10 p-8">
        {/* left */}
        <div className="flex flex-2 flex-col gap-10">
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

        {/* Right */}
        <div className="flex-1">
          <UsersWishlistSection username={username} />
        </div>
      </div>
    </div>
  )
}

export default UserPage
