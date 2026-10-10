import { RatingDistributionRow } from "@/components/ui/c-rating-6"
import { Developer } from "@/types/developer"
import { Publisher } from "@/types/publisher"
import { Store } from "@/types/store"

export interface Game {
  id: string
  title: string
  slug: string
  rawgId: string
  releaseDate: string
  imageUrl: string
  backgroundImage?: string
  description: string
  screenshots: string[]
  developers: Developer[]
  publishers: Publisher[]
  metacriticScore?: number | null
  metacriticUrl?: string | null
  metacritic_score?: number | null
  metacritic_url?: string | null
  website?: string | null
  stores?: Store[]
}

export interface GameSearch {
  title: string
  slug: string
  releaseDate: string
  backgroundImage: string
}

export interface GameStats {
  totalReviews: number
  avgRatings: number
  ratingDistribution: RatingDistributionRow[]
}
