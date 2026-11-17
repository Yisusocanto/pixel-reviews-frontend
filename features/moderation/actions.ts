"use server"

import {
  AdminDecisionPayload,
  AdminModerationQueuePagination,
  AdminModerationReviewItem,
  ModerationHistoryItem,
} from "@/features/moderation/types"
import { ModerationStatus } from "@/features/reviews/types"
import { apiClient, ApiError } from "@/lib/api/client"

export interface DecisionActionResult {
  ok: boolean
  conflict?: boolean
  error?: string
  item?: AdminModerationReviewItem
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
): Promise<DecisionActionResult> {
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
