import { Game } from "@/features/games/types"
import { User } from "@/features/users/types"

export interface Review {
  id: string
  gameId: string
  userId: string
  title: string
  content: string
  updatedAt: Date
  createAt: Date
  score: number
  likesCount: number
  likedByUser: boolean

  game?: Game
  user?: User
}

export interface ReviewPagination {
  items: Review[]
  total: number
  totalPages: number
  page: number
}

export interface CreateReview {
  score: number
  title?: string
  content?: string
  gameId: string
}

export interface UpdateReviewData {
  score?: number
  title?: string | null
  content?: string | null
}
