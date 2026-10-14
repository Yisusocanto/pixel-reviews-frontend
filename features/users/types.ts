import { RatingDistributionRow } from "@/components/ui/c-rating-6"

export interface User {
  id: string
  username: string
  email: string
  bio?: string | null
  profilePhotoUrl?: string | null
  createdAt?: string | null
  updatedAt?: string | null
}

export type AuthUser = User

export interface UserUpdate {
  username?: string
  bio?: string
}

export interface UserStats {
  totalReviews: number
  totalRatings: number
  ratingDistribution: RatingDistributionRow[]
  totalLikes: number
  avgRating: number
}
