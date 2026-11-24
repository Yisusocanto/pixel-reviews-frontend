import { toast } from "@/components/ui/toast"
import {
  createReportAction,
  getReportsQueueAction,
  submitReportVerdictAction,
} from "@/features/reports/actions"
import {
  CreateReportPayload,
  ReportStatus,
  ReportTargetType,
  ReportVerdictPayload,
} from "@/features/reports/types"
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"

export const useCreateReport = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateReportPayload) => createReportAction(payload),
    onSuccess: (res) => {
      if (!res.ok) {
        toast.add({
          description: res.duplicate
            ? "You have already reported this content."
            : (res.error ?? "Could not submit report"),
          type: res.duplicate ? "warning" : "error",
        })
        return
      }

      qc.invalidateQueries({ queryKey: ["reportModerationQueue"] })
      qc.invalidateQueries({ queryKey: ["moderationQueue"] })
      qc.invalidateQueries({ queryKey: ["commentModerationQueue"] })

      toast.add({
        description: "Report submitted. Our moderators will review it soon.",
        type: "success",
      })
    },
    onError: (error) => {
      toast.add({
        description: `Error submitting report: ${error.message}`,
        type: "error",
      })
    },
  })
}

export const useReportModerationQueue = (
  status: ReportStatus | "all" = "open",
  targetType: ReportTargetType | "all" = "all",
  page: number = 1,
  limit: number = 10,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["reportModerationQueue", status, targetType, page, limit],
    queryFn: () => getReportsQueueAction(status, targetType, page, limit),
    placeholderData: keepPreviousData,
    enabled,
  })
}

export const useReportVerdict = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({
      reportId,
      payload,
    }: {
      reportId: string
      payload: ReportVerdictPayload
    }) => submitReportVerdictAction(reportId, payload),
    onSuccess: (res, variables) => {
      qc.invalidateQueries({ queryKey: ["reportModerationQueue"] })
      qc.invalidateQueries({ queryKey: ["moderationQueue"] })
      qc.invalidateQueries({ queryKey: ["commentModerationQueue"] })
      qc.invalidateQueries({ queryKey: ["comments"] })
      qc.invalidateQueries({ queryKey: ["reviews"] })
      qc.invalidateQueries({ queryKey: ["gameReviews"] })
      qc.invalidateQueries({ queryKey: ["userReviews"] })

      if (!res.ok) {
        toast.add({
          description: res.conflict
            ? "This report was already processed. The queue has been refreshed."
            : (res.error ?? "Could not apply verdict"),
          type: res.conflict ? "warning" : "error",
        })
        return
      }

      toast.add({
        description:
          variables.payload.status === "resolved"
            ? "Report resolved and content rejected"
            : "Report dismissed and content kept published",
        type: "success",
      })
    },
    onError: (error) => {
      toast.add({
        description: `Error applying verdict: ${error.message}`,
        type: "error",
      })
    },
  })
}
