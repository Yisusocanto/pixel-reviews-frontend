import { RatingDistributionRow } from "@/components/ui/c-rating-6"

export interface User {
  id: string
  username: string
  email: string
  bio?: string
  profilePhotoUrl?: string
  createdAt: Date
  updatedAt: Date
}

export interface UserUpdate {
  bio?: string
}

export interface UserStats {
  totalReviews: number
  totalRatings: number
  ratingDistribution: RatingDistributionRow[]
  totalLikes: number
  avgRating: number
}
