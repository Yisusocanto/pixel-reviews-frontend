import { Review } from "@/features/reviews/types"
import { User } from "@/features/users/types"

export interface Comment {
  id: string
  content: string
  userId: string
  reviewId: string
  createdAt: Date
  updatedAt: Date

  user: User
  review: Review
}

export interface CommentCreate {
  content: string
  reviewId: string
}

export interface CommentUpdate {
  content: string
}

export interface CommentsPagination {
  items: Comment[]
  page: number
  total: number
  totalPages: number
}
