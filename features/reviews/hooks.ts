import { toast } from "@/components/ui/toast"
import {
  createReviewAction,
  deleteReviewAction,
  getAllReviewsAction,
  getUserGameReviewAction,
  likeToggleAction,
  updateReviewAction,
} from "@/features/reviews/actions"
import {
  CreateReview,
  Review,
  ReviewPagination,
  UpdateReviewData,
} from "@/features/reviews/types"
import {
  InfiniteData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"

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

export const useLikeToggle = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (reviewId: string) => likeToggleAction(reviewId),
    onMutate: async (reviewId: string) => {
      await qc.cancelQueries({ queryKey: ["reviews"] })
      await qc.cancelQueries({ queryKey: ["gameReviews"] })
      await qc.cancelQueries({ queryKey: ["userReview"] })

      const previousReviews = qc.getQueriesData({ queryKey: ["reviews"] })
      const previousGameReviews = qc.getQueriesData({
        queryKey: ["gameReviews"],
      })
      const previousUserReviews = qc.getQueriesData({
        queryKey: ["userReview"],
      })

      // Helper to calculate next like state
      const updateReviewLike = (r: Review): Review => {
        if (r.id !== reviewId) return r
        const willBeLiked = !r.likedByUser
        return {
          ...r,
          likedByUser: willBeLiked,
          likesCount: willBeLiked
            ? (r.likesCount ?? 0) + 1
            : Math.max(0, (r.likesCount ?? 0) - 1),
        }
      }

      // 1. Optimistically update infinite queries: ["gameReviews", slug]
      qc.setQueriesData<InfiniteData<ReviewPagination>>(
        { queryKey: ["gameReviews"] },
        (old) => {
          if (!old?.pages) return old
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              items: page.items.map(updateReviewLike),
            })),
          }
        }
      )

      // 2. Optimistically update paginated queries: ["reviews", page, limit]
      qc.setQueriesData<ReviewPagination>({ queryKey: ["reviews"] }, (old) => {
        if (!old?.items) return old
        return {
          ...old,
          items: old.items.map(updateReviewLike),
        }
      })

      // 3. Optimistically update single review: ["userReview", gameId]
      qc.setQueriesData<Review | null>({ queryKey: ["userReview"] }, (old) => {
        if (!old) return old
        return updateReviewLike(old)
      })

      return { previousReviews, previousGameReviews, previousUserReviews }
    },
    onError: (_err, _reviewId, context) => {
      if (context?.previousReviews) {
        context.previousReviews.forEach(([queryKey, data]) => {
          qc.setQueryData(queryKey, data)
        })
      }
      if (context?.previousGameReviews) {
        context.previousGameReviews.forEach(([queryKey, data]) => {
          qc.setQueryData(queryKey, data)
        })
      }
      if (context?.previousUserReviews) {
        context.previousUserReviews.forEach(([queryKey, data]) => {
          qc.setQueryData(queryKey, data)
        })
      }
      toast.add({
        description: "Failed to update like status",
        type: "error",
      })
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["gameReviews"] })
      qc.invalidateQueries({ queryKey: ["reviews"] })
      qc.invalidateQueries({ queryKey: ["userReview"] })
    },
  })
}
