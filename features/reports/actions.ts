"use server"

import {
  AdminReportItem,
  AdminReportPagination,
  CreateReportPayload,
  ReportResponse,
  ReportStatus,
  ReportTargetType,
  ReportVerdictPayload,
} from "@/features/reports/types"
import { apiClient, ApiError } from "@/lib/api/client"

export interface CreateReportActionResult {
  ok: boolean
  duplicate?: boolean
  error?: string
  report?: ReportResponse
}

export interface ReportVerdictActionResult {
  ok: boolean
  conflict?: boolean
  error?: string
  item?: AdminReportItem
}

export async function createReportAction(
  payload: CreateReportPayload
): Promise<CreateReportActionResult> {
  try {
    const report = await apiClient.post<ReportResponse, CreateReportPayload>(
      "/reports",
      payload
    )
    return { ok: true, report }
  } catch (err) {
    if (err instanceof ApiError && err.status === 409) {
      return {
        ok: false,
        duplicate: true,
        error: err.message,
      }
    }
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to submit report",
    }
  }
}

export async function getReportsQueueAction(
  status?: ReportStatus | "all",
  targetType?: ReportTargetType | "all",
  page: number = 1,
  limit: number = 10
): Promise<AdminReportPagination> {
  const params: Record<string, string | number | undefined> = {
    page,
    limit,
  }
  if (status && status !== "all") {
    params.status = status
  }
  if (targetType && targetType !== "all") {
    params.targetType = targetType
  }

  return await apiClient.get<AdminReportPagination>(
    "/admin/moderation/reports",
    { params }
  )
}

export async function submitReportVerdictAction(
  reportId: string,
  payload: ReportVerdictPayload
): Promise<ReportVerdictActionResult> {
  try {
    const item = await apiClient.post<AdminReportItem, ReportVerdictPayload>(
      `/admin/moderation/reports/${reportId}/verdict`,
      payload
    )
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
      error: err instanceof Error ? err.message : "Failed to apply verdict",
    }
  }
}
