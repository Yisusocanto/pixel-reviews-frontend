import { toast } from "@/components/ui/toast"
import {
  createReviewAction,
  deleteReviewAction,
  getAllReviewsAction,
  getUserGameReviewAction,
  updateReviewAction,
} from "@/features/reviews/actions"
import {
  CreateReview,
  Review,
  UpdateReviewData,
} from "@/features/reviews/types"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useReviews = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ["reviews", page, limit],
    queryFn: () => getAllReviewsAction(page, limit),
  })
}

export const useUserGameReview = (
  gameId: string,
  initialData?: Review | null
) => {
  return useQuery({
    queryKey: ["userReview", gameId],
    queryFn: () => getUserGameReviewAction(gameId),
    initialData: initialData ?? undefined,
    enabled: !!gameId,
  })
}

export const useCreateReview = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateReview) => createReviewAction(data),
    onSuccess: (review) => {
      qc.setQueryData(["userReview", review.gameId], review)
      qc.invalidateQueries({ queryKey: ["reviews"] })
      qc.invalidateQueries({ queryKey: ["gameReviews"] })
      qc.invalidateQueries({ queryKey: ["userReview", review.gameId] })
      toast.add({
        description: "Review created successfully",
        type: "success",
      })
    },
    onError: (error) => {
      toast.add({
        description: `Error creating the review: ${error.message}`,
        type: "error",
      })
    },
  })
}

export const useUpdateReview = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateReviewData }) =>
      updateReviewAction(id, data),
    onSuccess: (review) => {
      qc.setQueryData(["userReview", review.gameId], review)
      qc.invalidateQueries({ queryKey: ["reviews"] })
      qc.invalidateQueries({ queryKey: ["gameReviews"] })
      qc.invalidateQueries({ queryKey: ["userReview", review.gameId] })
      toast.add({
        description: "Review updated successfully",
        type: "success",
      })
    },
    onError: (error) => {
      toast.add({
        description: `Error updating the review: ${error.message}`,
        type: "error",
      })
    },
  })
}

export const useDeleteReview = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (reviewId: string) => deleteReviewAction(reviewId),
    onSuccess: (review) => {
      if (review?.gameId) {
        qc.setQueryData(["userReview", review.gameId], null)
      }
      qc.invalidateQueries({ queryKey: ["reviews"] })
      qc.invalidateQueries({ queryKey: ["gameReviews"] })
      qc.invalidateQueries({ queryKey: ["userReview"] })
      toast.add({
        description: "Review deleted successfully",
        type: "success",
      })
    },
    onError: (error) => {
      toast.add({
        description: `Error deleting the review: ${error.message}`,
        type: "error",
      })
    },
  })
}
