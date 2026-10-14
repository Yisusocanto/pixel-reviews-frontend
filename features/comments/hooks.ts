import { toast } from "@/components/ui/toast"
import {
  createCommentAction,
  deleteCommentAction,
  updateCommentAction,
} from "@/features/comments/actions"
import { CommentCreate, CommentUpdate } from "@/features/comments/types"
import { Review, ReviewPagination } from "@/features/reviews/types"
import {
  InfiniteData,
  QueryClient,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"

const updateReviewCommentsCount = (
  qc: QueryClient,
  reviewId: string,
  delta: number
) => {
  const updater = (review: Review): Review => {
    if (review.id !== reviewId) return review
    return {
      ...review,
      commentsCount: Math.max(0, (review.commentsCount ?? 0) + delta),
    }
  }

  qc.setQueriesData<InfiniteData<ReviewPagination>>(
    { queryKey: ["reviews"] },
    (old) => {
      if (!old?.pages) return old
      return {
        ...old,
        pages: old.pages.map((page) => ({
          ...page,
          items: page.items.map(updater),
        })),
      }
    }
  )

  qc.setQueriesData<ReviewPagination>({ queryKey: ["reviews"] }, (old) => {
    if (!old?.items) return old
    return {
      ...old,
      items: old.items.map(updater),
    }
  })

  qc.setQueriesData<InfiniteData<ReviewPagination>>(
    { queryKey: ["gameReviews"] },
    (old) => {
      if (!old?.pages) return old
      return {
        ...old,
        pages: old.pages.map((page) => ({
          ...page,
          items: page.items.map(updater),
        })),
      }
    }
  )

  qc.setQueriesData<InfiniteData<ReviewPagination>>(
    { queryKey: ["userReviews"] },
    (old) => {
      if (!old?.pages) return old
      return {
        ...old,
        pages: old.pages.map((page) => ({
          ...page,
          items: page.items.map(updater),
        })),
      }
    }
  )

  qc.setQueriesData<Review | null>({ queryKey: ["userReview"] }, (old) => {
    if (!old) return old
    return updater(old)
  })

  qc.invalidateQueries({ queryKey: ["reviews"] })
  qc.invalidateQueries({ queryKey: ["gameReviews"] })
  qc.invalidateQueries({ queryKey: ["userReviews"] })
  qc.invalidateQueries({ queryKey: ["userReview"] })
}

export const useCreateComment = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CommentCreate) => createCommentAction(data),
    onSuccess: (data) => {
      if (data?.reviewId) {
        qc.invalidateQueries({ queryKey: ["comments", data.reviewId] })
        updateReviewCommentsCount(qc, data.reviewId, 1)
      } else {
        qc.invalidateQueries({ queryKey: ["comments"] })
        qc.invalidateQueries({ queryKey: ["reviews"] })
      }
      toast.add({
        description: "Comment added successfully",
        type: "success",
      })
    },
    onError: (error: Error) => {
      toast.add({
        description: error.message || "Failed to create comment",
        type: "error",
      })
    },
  })
}

export type DeleteCommentParams =
  string | { commentId: string; reviewId?: string }

export const useDeleteComments = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (params: DeleteCommentParams) => {
      const commentId = typeof params === "string" ? params : params.commentId
      return deleteCommentAction(commentId)
    },
    onSuccess: (data, variables) => {
      const reviewId =
        data?.reviewId ??
        (typeof variables === "object" ? variables.reviewId : undefined)

      if (reviewId) {
        qc.invalidateQueries({ queryKey: ["comments", reviewId] })
        updateReviewCommentsCount(qc, reviewId, -1)
      } else {
        qc.invalidateQueries({ queryKey: ["comments"] })
        qc.invalidateQueries({ queryKey: ["reviews"] })
      }

      toast.add({
        description: "Comment deleted successfully",
        type: "success",
      })
    },
    onError: (error: Error) => {
      toast.add({
        description: error.message || "Failed to delete comment",
        type: "error",
      })
    },
  })
}

export const useUpdateComment = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({
      commentId,
      data,
    }: {
      commentId: string
      data: CommentUpdate
    }) => updateCommentAction(data, commentId),
    onSuccess: (data) => {
      if (data?.reviewId) {
        qc.invalidateQueries({ queryKey: ["comments", data.reviewId] })
      }
      toast.add({
        description: "Comment updated successfully",
        type: "success",
      })
    },
    onError: (error: Error) => {
      toast.add({
        description: error.message || "Failed to update comment",
        type: "error",
      })
    },
  })
}
