import { Game } from "@/features/games/types"
import { ModerationStatus } from "@/features/reviews/types"
import { User } from "@/features/users/types"

export type ModerationEntityType = "reviews" | "comments"
export type Verdict = "approve" | "reject" | "doubt"
export type Judge = "rules" | "ai_model" | "admin" | "system" | "user_appeal"

export interface ModerationHistoryItem {
  id: string
  reviewId: string
  contentVersion: number
  verdict: Verdict
  judge: Judge
  reason?: string | null
  scores: Record<string, number>
  adminId?: string | null
  note?: string | null
  admin?: User | null
  createdAt: string
  updatedAt: string
}

export interface CommentModerationHistoryItem {
  id: string
  commentId: string
  contentVersion: number
  verdict: Verdict
  judge: Judge
  reason?: string | null
  scores: Record<string, number>
  adminId?: string | null
  note?: string | null
  admin?: User | null
  createdAt: string
  updatedAt: string
}

export interface AdminModerationReviewItem {
  id: string
  userId: string
  gameId: string
  title?: string | null
  content?: string | null
  score: number
  moderationStatus: ModerationStatus
  moderationReason?: string | null
  contentVersion: number
  moderatedVersion: number
  user: User
  game: Game
  latestModeration?: ModerationHistoryItem | null
  isAppeal: boolean
  createdAt: string
  updatedAt: string
}

export interface AdminModerationCommentReviewSummary {
  id: string
  title?: string | null
  user: User
  game: Game
}

export interface AdminModerationCommentItem {
  id: string
  userId: string
  reviewId: string
  content: string
  moderationStatus: ModerationStatus
  moderationReason?: string | null
  contentVersion: number
  moderatedVersion: number
  user: User
  review: AdminModerationCommentReviewSummary
  latestModeration?: CommentModerationHistoryItem | null
  isAppeal: boolean
  createdAt: string
  updatedAt: string
}

export interface AdminModerationQueuePagination {
  items: AdminModerationReviewItem[]
  total: number
  totalPages: number
  page: number
}

export interface AdminModerationCommentQueuePagination {
  items: AdminModerationCommentItem[]
  total: number
  totalPages: number
  page: number
}

export interface AdminDecisionPayload {
  decision: "approve" | "reject"
  version: number
  reason?: string | null
  note?: string | null
}
