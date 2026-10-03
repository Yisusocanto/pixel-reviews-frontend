import { auth } from "@/auth"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import RatingDistribution from "@/components/ui/c-rating-6"
import StarRating from "@/components/ui/star-rating"
import { getUserAction, getUserStatsAction } from "@/features/users/actions"
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
            <div>
              <Avatar className="size-30">
                <AvatarFallback className="text-4xl font-bold uppercase">
                  {user?.username.slice(0, 2)}
                </AvatarFallback>
              </Avatar>
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
          <div className="flex flex-col items-center gap-6 rounded-2xl border border-border/60 bg-card/40 p-6 backdrop-blur-sm sm:flex-row sm:gap-10">
            <div className="flex min-w-44 shrink-0 flex-col items-center justify-center border-border/40 sm:border-r sm:pr-8">
              <div className="flex items-baseline gap-1.5">
                <span className="font-heading text-5xl font-black tracking-tight text-foreground">
                  {userStats?.avgRating
                    ? Number(userStats?.avgRating).toFixed(1)
                    : "0.0"}
                </span>
                <span className="text-xl font-semibold text-muted-foreground/70">
                  / 5
                </span>
              </div>
              <div className="mt-2.5">
                <StarRating
                  value={Number(userStats?.avgRating) || 0}
                  size="md"
                  readOnly
                />
              </div>
              <span className="mt-2 text-xs font-medium text-muted-foreground">
                {userStats?.totalReviews === 1
                  ? "1 review"
                  : `${userStats?.totalReviews ?? 0} reviews`}
              </span>
            </div>
            <div className="w-full flex-1">
              <RatingDistribution
                distribution={userStats?.ratingDistribution}
                className="w-full"
              />
            </div>
          </div>

          {/* Reviews */}
          <div>
            <UserReviewSection username={username} />
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
