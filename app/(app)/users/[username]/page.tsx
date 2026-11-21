import { auth } from "@/auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import RatingDistributionCard from "@/components/ui/rating-distribution-card"
import { Game } from "@/features/games/types"
import { ReviewPagination } from "@/features/reviews/types"
import {
  getUserAction,
  getUserFavGamesAction,
  getUserReviewsAction,
  getUserStatsAction,
} from "@/features/users/actions"
import FavGamesSection from "@/features/users/components/fav-games-section"
import ProfilePhotoDialog from "@/features/users/components/profile-photo-dialog"
import UpdateUserDialog from "@/features/users/components/update-user-dialog"
import UserReviewSection from "@/features/users/components/users-reviews-section"
import UsersWishlistSection from "@/features/users/components/users-wishlist-section"
import { User, UserStats } from "@/features/users/types"
import dayjs from "dayjs"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { cache } from "react"

const getCachedUserData = cache(
  async (
    username: string
  ): Promise<{
    user: User
    userStats?: UserStats
    initialReviews?: ReviewPagination
    initialFavGames?: Game[]
  }> => {
    const [user, userStats, initialReviews, initialFavGames] =
      await Promise.all([
        getUserAction(username),
        getUserStatsAction(username).catch(() => undefined),
        getUserReviewsAction(username, 1, 10).catch(() => undefined),
        getUserFavGamesAction(username).catch(() => undefined),
      ])

    return { user, userStats, initialReviews, initialFavGames }
  }
)

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>
}): Promise<Metadata> {
  const { username } = await params

  try {
    const { user, userStats } = await getCachedUserData(username)

    if (!user) {
      return {
        title: "Player Not Found",
        robots: { index: false },
      }
    }

    const pageTitle = `@${user.username}'s Game Reviews & Wishlist`
    const reviewSummary =
      userStats && userStats.totalReviews > 0
        ? `${userStats.totalReviews} game ${userStats.totalReviews === 1 ? "review" : "reviews"} and ${userStats.totalRatings} ratings`
        : "video game reviews, favorite games, and wishlist"

    const bioSnippet = user.bio ? ` ${user.bio.trim()}` : ""
    const rawDescription = `Explore @${user.username}'s ${reviewSummary} on Pixel Reviews.${bioSnippet}`
    const description =
      rawDescription.length > 158
        ? `${rawDescription.slice(0, 157).trimEnd()}…`
        : rawDescription

    return {
      title: pageTitle,
      description,
      alternates: {
        canonical: `/users/${user.username}`,
      },
      openGraph: {
        type: "profile",
        title: `${pageTitle} | Pixel Reviews`,
        description,
        url: `/users/${user.username}`,
        images: user.profilePhotoUrl
          ? [
              {
                url: user.profilePhotoUrl,
                alt: `@${user.username}'s profile photo`,
              },
            ]
          : undefined,
      },
      twitter: {
        card: "summary",
        title: `${pageTitle} | Pixel Reviews`,
        description,
        images: user.profilePhotoUrl ? [user.profilePhotoUrl] : undefined,
      },
    }
  } catch {
    return {
      title: "Player Not Found",
      robots: {
        index: false,
      },
    }
  }
}

async function UserPage({ params }: { params: Promise<{ username: string }> }) {
  const session = await auth()
  const { username } = await params
  let user: User | undefined = undefined
  let userStats: UserStats | undefined = undefined
  let initialReviews: ReviewPagination | undefined = undefined
  let initialFavGames: Game[] | undefined = undefined

  try {
    ;({ user, userStats, initialReviews, initialFavGames } =
      await getCachedUserData(username))
  } catch {
    notFound()
  }

  if (!user) {
    notFound()
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
                  alt={`@${user.username}'s profile photo`}
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
                joined{" "}
                <time
                  dateTime={
                    user.createdAt && dayjs(user.createdAt).isValid()
                      ? dayjs(user.createdAt).toISOString()
                      : undefined
                  }
                >
                  {dayjs(user?.createdAt).format("DD/MM/YYYY")}
                </time>
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

      <div className="flex flex-col gap-8 p-4 sm:p-6 lg:p-8">
        <FavGamesSection username={username} initialGames={initialFavGames} />
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:gap-10">
          <div className="order-2 flex min-w-0 flex-2 flex-col gap-8 sm:gap-10 lg:order-1">
            <RatingDistributionCard
              avgRating={userStats?.avgRating}
              totalReviews={userStats?.totalReviews}
              distribution={userStats?.ratingDistribution}
            />

            <div>
              <UserReviewSection
                username={username}
                ownReview={ownProfile}
                initialReviews={initialReviews}
              />
            </div>
          </div>

          <div className="order-1 min-w-0 flex-1 lg:order-2">
            <UsersWishlistSection username={username} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserPage
