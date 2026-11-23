"use server"

import {
  AdminDecisionPayload,
  AdminModerationCommentItem,
  AdminModerationCommentQueuePagination,
  AdminModerationQueuePagination,
  AdminModerationReviewItem,
  CommentModerationHistoryItem,
  ModerationHistoryItem,
} from "@/features/moderation/types"
import { ModerationStatus } from "@/features/reviews/types"
import { apiClient, ApiError } from "@/lib/api/client"

export interface DecisionActionResult<T = AdminModerationReviewItem> {
  ok: boolean
  conflict?: boolean
  error?: string
  item?: T
}

export async function getModerationQueueAction(
  status?: ModerationStatus | "all",
  page: number = 1,
  limit: number = 10
): Promise<AdminModerationQueuePagination> {
  const params: Record<string, string | number | undefined> = {
    page,
    limit,
  }
  if (status && status !== "all") {
    params.status = status
  }

  return await apiClient.get<AdminModerationQueuePagination>(
    "/admin/moderation/reviews",
    { params }
  )
}

export async function getModerationHistoryAction(
  reviewId: string
): Promise<ModerationHistoryItem[]> {
  return await apiClient.get<ModerationHistoryItem[]>(
    `/admin/moderation/reviews/${reviewId}/history`
  )
}

export async function submitModerationDecisionAction(
  reviewId: string,
  payload: AdminDecisionPayload
): Promise<DecisionActionResult<AdminModerationReviewItem>> {
  try {
    const item = await apiClient.post<
      AdminModerationReviewItem,
      AdminDecisionPayload
    >(`/admin/moderation/reviews/${reviewId}/decision`, payload)
    return { ok: true, item }
  } catch (err) {
    if (err instanceof ApiError && err.status === 409) {
      return {
        ok: false,
        conflict: true,
        error: err.message,
      }
    }
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to submit decision",
    }
  }
}

export async function getCommentModerationQueueAction(
  status?: ModerationStatus | "all",
  page: number = 1,
  limit: number = 10
): Promise<AdminModerationCommentQueuePagination> {
  const params: Record<string, string | number | undefined> = {
    page,
    limit,
  }
  if (status && status !== "all") {
    params.status = status
  }

  return await apiClient.get<AdminModerationCommentQueuePagination>(
    "/admin/moderation/comments",
    { params }
  )
}

export async function getCommentModerationHistoryAction(
  commentId: string
): Promise<CommentModerationHistoryItem[]> {
  return await apiClient.get<CommentModerationHistoryItem[]>(
    `/admin/moderation/comments/${commentId}/history`
  )
}

export async function submitCommentModerationDecisionAction(
  commentId: string,
  payload: AdminDecisionPayload
): Promise<DecisionActionResult<AdminModerationCommentItem>> {
  try {
    const item = await apiClient.post<
      AdminModerationCommentItem,
      AdminDecisionPayload
    >(`/admin/moderation/comments/${commentId}/decision`, payload)
    return { ok: true, item }
  } catch (err) {
    if (err instanceof ApiError && err.status === 409) {
      return {
        ok: false,
        conflict: true,
        error: err.message,
      }
    }
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to submit decision",
    }
  }
}
