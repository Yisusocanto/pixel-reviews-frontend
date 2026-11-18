import { Game } from "@/features/games/types"
import { User } from "@/features/users/types"

export type ModerationStatus =
  | "pending"
  | "approved"
  | "needs_review"
  | "rejected"

export interface ModerationInfo {
  status: ModerationStatus
  reason?: string | null
  canAppeal: boolean
}

export interface Review {
  id: string
  gameId: string
  userId: string
  title: string
  content: string
  updatedAt: Date
  createdAt: Date
  score: number
  likesCount: number
  likedByUser: boolean
  commentsCount: number
  moderation?: ModerationInfo | null

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
