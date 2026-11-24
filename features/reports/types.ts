import { ModerationStatus } from "@/features/reviews/types"
import { User } from "@/features/users/types"

export type ReportTargetType = "review" | "comment"
export type ReportType =
  | "spam"
  | "spoiler"
  | "harassment"
  | "hate_speech"
  | "inappropriate"
  | "off_topic"
  | "other"
export type ReportStatus = "open" | "resolved" | "dismissed"

export interface CreateReportPayload {
  targetId: string
  targetType: ReportTargetType
  type: ReportType
  reason?: string | null
}

export interface ReportResponse {
  id: string
  targetId: string
  targetType: ReportTargetType
  type: ReportType
  reason?: string | null
  reporterId: string
  status: ReportStatus
  createdAt: string
  updatedAt: string
  reporter: User
}

export interface ReportedTargetPreview {
  id: string
  targetType: ReportTargetType
  title?: string | null
  content?: string | null
  moderationStatus: ModerationStatus
  author: User
  gameTitle?: string | null
  gameSlug?: string | null
  reviewId?: string | null
}

export interface AdminReportItem extends ReportResponse {
  target?: ReportedTargetPreview | null
  openReportsCount: number
}

export interface AdminReportPagination {
  items: AdminReportItem[]
  total: number
  totalPages: number
  page: number
}

export interface ReportVerdictPayload {
  status: "resolved" | "dismissed"
}
