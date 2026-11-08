import { RatingDistributionRow } from "@/components/ui/c-rating-6"
import { Genre } from "@/features/genres/types"
import { Platform } from "@/features/platforms/types"
import { Developer } from "@/types/developer"
import { Publisher } from "@/types/publisher"
import { Store } from "@/types/store"

export interface Game {
  id: string
  title: string
  slug: string
  igdbId: number
  releaseDate?: string | null
  imageUrl: string
  backgroundImage?: string | null
  description: string
  storyline?: string | null
  criticScore?: number | null
  criticScoreCount?: number | null
  igdbUrl?: string | null
  website?: string | null
  trailerYoutubeId?: string | null
  trailerTitle?: string | null
  screenshots: string[]
  gameModes: string[]
  themes: string[]
  playerPerspectives: string[]
  developers: Developer[]
  publishers: Publisher[]
  stores?: Store[]
  genres: Genre[]
  platforms: Platform[]
}

export interface GameSearch {
  title: string
  slug: string
  releaseDate?: string | null
  imageUrl?: string | null
  backgroundImage?: string | null
  criticScore?: number | null
}

export interface GameSearchPagination {
  items: GameSearch[]
  total: number
  totalPages: number
  page: number
}

export interface GameStats {
  totalReviews: number
  avgRatings: number
  ratingDistribution: RatingDistributionRow[]
}
