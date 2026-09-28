import { toast } from "@/components/ui/toast"
import {
  createReviewAction,
  getAllReviewsAction,
} from "@/features/reviews/actions"
import { CreateReview } from "@/features/reviews/types"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useReviews = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ["reviews", page, limit],
    queryFn: () => getAllReviewsAction(page, limit),
  })
}

export const useCreateReview = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateReview) => createReviewAction(data),
    onSuccess: (review) => {
      qc.invalidateQueries({ queryKey: ["reviews"] })
      qc.invalidateQueries({ queryKey: ["gameReviews", review.game?.slug] })
      toast.add({
        description: "Review created successfully",
        type: "success",
      })
    },
    onError: (error) => {
      toast.add({
        description: `Error creating the toast: ${error.message}`,
        type: "error",
      })
    },
  })
}
