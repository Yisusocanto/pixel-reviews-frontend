import { toast } from "@/components/ui/toast"
import {
  getModerationHistoryAction,
  getModerationQueueAction,
  submitModerationDecisionAction,
} from "@/features/moderation/actions"
import { AdminDecisionPayload } from "@/features/moderation/types"
import { ModerationStatus } from "@/features/reviews/types"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useModerationQueue = (
  status: ModerationStatus | "all" = "needs_review",
  page: number = 1,
  limit: number = 10
) => {
  return useQuery({
    queryKey: ["moderationQueue", status, page, limit],
    queryFn: () => getModerationQueueAction(status, page, limit),
  })
}

export const useModerationHistory = (reviewId: string, enabled: boolean) => {
  return useQuery({
    queryKey: ["moderationHistory", reviewId],
    queryFn: () => getModerationHistoryAction(reviewId),
    enabled: Boolean(reviewId) && enabled,
  })
}

export const useModerationDecision = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      reviewId,
      payload,
    }: {
      reviewId: string
      payload: AdminDecisionPayload
    }) => submitModerationDecisionAction(reviewId, payload),
    onSuccess: (res, variables) => {
      qc.invalidateQueries({ queryKey: ["moderationQueue"] })
      qc.invalidateQueries({
        queryKey: ["moderationHistory", variables.reviewId],
      })
      qc.invalidateQueries({ queryKey: ["reviews"] })
      qc.invalidateQueries({ queryKey: ["gameReviews"] })
      qc.invalidateQueries({ queryKey: ["userReviews"] })

      if (!res.ok) {
        if (res.conflict) {
          toast.add({
            description:
              "This review was edited by the author while you were viewing it. The queue has been refreshed.",
            type: "warning",
          })
          return
        }
        toast.add({
          description: res.error ?? "Could not save moderation decision",
          type: "error",
        })
        return
      }

      toast.add({
        description:
          variables.payload.decision === "approve"
            ? "Review approved and published"
            : "Review rejected and hidden from public",
        type: "success",
      })
    },
    onError: (error) => {
      toast.add({
        description: `Error saving decision: ${error.message}`,
        type: "error",
      })
    },
  })
}
