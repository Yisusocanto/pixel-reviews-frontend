import { Game } from "@/features/games/types"
import { ModerationStatus } from "@/features/reviews/types"
import { User } from "@/features/users/types"

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

export interface AdminModerationQueuePagination {
  items: AdminModerationReviewItem[]
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
