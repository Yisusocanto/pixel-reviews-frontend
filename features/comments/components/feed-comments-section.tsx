"use client"

import LoginModal from "@/components/auth/login-modal"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import CommentCard from "@/features/comments/components/comment-card"
import { useCreateComment } from "@/features/comments/hooks"
import { useReviewComments } from "@/features/reviews/hooks"
import { Review } from "@/features/reviews/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { X } from "lucide-react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import React, { useCallback } from "react"
import { useForm } from "react-hook-form"
import z from "zod"

interface Props {
  selectedReview: Review
  onClose?: () => void
}

const schema = z.object({
  content: z.string().min(3, "Minimum 3 characters"),
})

type FormData = z.infer<typeof schema>

function FeedCommentsSection({ selectedReview, onClose }: Props) {
  const { data: session } = useSession()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useReviewComments(selectedReview.id)

  const comments = data?.pages.flatMap((page) => page.items)
  const totalComments = data?.pages?.[0]?.total ?? comments?.length ?? 0

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
      if (scrollHeight - scrollTop - clientHeight < 100) {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage]
  )

  const {
    mutate: createComment,
    isPending,
    isError,
    error,
  } = useCreateComment()

  const onSubmit = handleSubmit((formData) => {
    createComment(
      { content: formData.content, reviewId: selectedReview.id },
      {
        onSuccess: () => {
          reset()
        },
      }
    )
  })

  return (
    <aside
      className="fixed inset-y-0 right-0 z-50 flex w-full max-w-full flex-col justify-between border-l border-border bg-background sm:max-w-md md:sticky md:top-15 md:z-20 md:w-80 md:shrink-0 lg:w-96 xl:w-105"
      style={{ height: "100dvh" }}
    >
      <div className="flex shrink-0 flex-col gap-3 border-b border-border p-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Conversation / {String(totalComments).padStart(2, "0")}
          </span>
          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="size-8 rounded-sm text-muted-foreground hover:text-foreground"
              aria-label="Close conversation"
            >
              <X className="size-4" />
            </Button>
          )}
        </div>

        <div className="flex flex-col border-l-2 border-l-primary bg-secondary p-3">
          <span className="flex flex-col text-xs text-muted-foreground uppercase">
            <span>
              <Link
                href={`/users/${selectedReview.user?.username}`}
                className="font-bold transition-colors duration-300 ease-in-out hover:text-primary"
              >
                {selectedReview.user?.username}
              </Link>
              &apos; Review ·{" "}
            </span>
            <Link
              href={`/games/${selectedReview.game?.slug}`}
              className="font-bold transition-colors duration-300 ease-in-out hover:text-primary"
            >
              {selectedReview.game?.title}
            </Link>
          </span>
          <h3 className="mt-1 line-clamp-2 text-lg font-semibold italic">
            {selectedReview.title}
          </h3>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden">
        <ScrollArea onScroll={handleScroll} className="h-full">
          <div className="flex flex-col gap-6 px-4 py-4">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Skeleton className="size-6 rounded-full" />
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ))
            ) : comments && comments.length > 0 ? (
              <>
                {comments.map((comment) => {
                  const isAuthor = comment.userId === session?.user.id

                  return (
                    <CommentCard
                      key={comment.id}
                      comment={comment}
                      isAuthor={Boolean(isAuthor)}
                    />
                  )
                })}

                {hasNextPage && (
                  <div className="py-2 text-center">
                    {isFetchingNextPage ? (
                      <Spinner className="size-4" />
                    ) : (
                      <button
                        type="button"
                        onClick={() => fetchNextPage()}
                        className="cursor-pointer text-xs text-muted-foreground transition-colors hover:text-foreground"
                      >
                        Load more comments
                      </button>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="py-12 text-center text-sm text-muted-foreground">
                No comments yet. Be the first to comment!
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      <div className="mt-auto shrink-0 border-t border-border bg-background p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] md:pb-4">
        {session ? (
          <form onSubmit={onSubmit} className="flex flex-col gap-3">
            <Field data-invalid={!!errors.content}>
              <FieldLabel className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                Add a comment
              </FieldLabel>
              <Textarea
                {...register("content")}
                placeholder="Join the conversation..."
                className="min-h-20 resize-none"
              />
              <FieldError>{errors.content?.message}</FieldError>
            </Field>

            {isError && error && (
              <span className="text-xs text-destructive">
                {error.message ?? "Error creating comment"}
              </span>
            )}

            <div className="flex justify-end pt-1">
              <Button type="submit" disabled={isPending} size="sm">
                {isPending && <Spinner className="mr-1.5 size-3.5" />}
                {isPending ? "Sending..." : "Send"}
              </Button>
            </div>
          </form>
        ) : (
          <LoginModal
            trigger={
              <Button className="w-full" variant="outline">
                Log in to comment
              </Button>
            }
          />
        )}
      </div>
    </aside>
  )
}

export default FeedCommentsSection
