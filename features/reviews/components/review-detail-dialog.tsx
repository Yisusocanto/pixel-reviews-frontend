"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Review } from "@/features/reviews/types"
import { MessageSquare } from "lucide-react"
import { formatTimeAgo } from "@/lib/format-time"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import Image from "next/image"
import StarRating from "@/components/ui/star-rating"
import LikeButton from "@/features/likes/components/like-button"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { useReviewComments } from "@/features/reviews/hooks"
import { useSession } from "next-auth/react"
import { useInView } from "react-intersection-observer"
import { useEffect } from "react"
import { useCreateComment } from "@/features/comments/hooks"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"
import { Spinner } from "@/components/ui/spinner"
import LoginModal from "@/components/auth/login-modal"
import MessageCommentCard from "@/features/comments/components/message-comment-card"
import ExpandableText from "@/components/expandable-text"

interface Props {
  review: Review
}

const schema = z.object({
  content: z.string().trim().min(3, "Minimum 3 characters"),
})

type FormData = z.infer<typeof schema>

function ReviewDetailDialog({ review }: Props) {
  const { data: session } = useSession()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })
  const { data, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useReviewComments(review.id)
  const comments = data?.pages.flatMap((page) => page.items)

  const {
    mutate: createComment,
    isPending,
    isError,
    error,
  } = useCreateComment()

  const onSubmit = handleSubmit((formData) => {
    createComment(
      { content: formData.content.trim(), reviewId: review.id },
      {
        onSuccess: () => {
          reset()
        },
      }
    )
  })

  const { ref, inView } = useInView({
    threshold: 0,
  })

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage])

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            className="flex w-auto items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
          >
            <MessageSquare className="h-4 w-4 transition-transform duration-200 active:scale-125" />
            <span>{review.commentsCount ?? 0} comments</span>
          </Button>
        }
      />
      <DialogContent className="w-[calc(100%-1rem)] max-w-2xl! p-4 sm:p-6 max-h-[90dvh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg">{review.user?.username}&apos;s review</DialogTitle>
        </DialogHeader>
        <Separator />
        <div className="-mx-2 no-scrollbar flex flex-1 flex-col gap-5 overflow-y-auto px-2 sm:-mx-4 sm:px-4 [&::-webkit-scrollbar]:hidden">
          <div className="flex items-center gap-2">
            <Avatar className="size-7 sm:size-8">
              <AvatarImage src={review.user?.profilePhotoUrl} />
              <AvatarFallback className="text-[10px] sm:text-xs uppercase">
                {review.user?.username?.slice(0, 2) ?? "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <Link
                href={`/users/${review.user?.username}`}
                className="text-sm font-bold transition-colors duration-300 ease-in-out hover:text-primary"
              >
                {review.user?.username}
              </Link>
              <span className="text-xs text-muted-foreground">
                {formatTimeAgo(review.createdAt)}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {review.game?.imageUrl && (
              <div className="relative aspect-21/9 sm:aspect-16/7 w-full overflow-hidden rounded-lg border border-border/60 bg-card/40">
                <Image
                  src={review.game.imageUrl}
                  fill
                  alt={review.game?.title ?? ""}
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 600px"
                />
                <div className="absolute inset-0 bg-linear-to-t from-background/80 via-transparent to-transparent" />
                <div className="absolute bottom-2 left-3 right-3 flex items-end justify-between gap-2">
                  <h3 className="truncate font-heading text-base font-extrabold tracking-tight uppercase text-foreground drop-shadow-md sm:text-xl">
                    {review.game?.title}
                  </h3>
                  <StarRating readOnly showValue value={review.score} size="sm" />
                </div>
              </div>
            )}
            {!review.game?.imageUrl && (
              <div className="flex items-center justify-between gap-2">
                <h3 className="truncate font-heading text-lg font-extrabold tracking-tight sm:text-2xl">
                  {review.game?.title}
                </h3>
                <StarRating readOnly showValue value={review.score} size="sm" />
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <h4 className="text-lg font-bold sm:text-xl">{review.title}</h4>
            <ExpandableText content={review.content} />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <LikeButton
              likedByUser={Boolean(review.likedByUser)}
              likesCount={review.likesCount ?? 0}
              reviewId={review.id}
            />
            <div className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-muted-foreground">
              <MessageSquare className="h-4 w-4" />
              <span>{review.commentsCount ?? 0} comments</span>
            </div>
          </div>

          <Separator />

          <div className="flex flex-col gap-6">
            {comments && comments.length === 0 && (
              <div className="py-8 text-center text-sm text-muted-foreground">
                No comments yet. Be the first to comment!
              </div>
            )}

            {comments?.map((comment) => {
              const isAuthor = review.user?.username === comment.user.username
              const isOwnComment =
                session?.user.username === comment.user.username

              return (
                <MessageCommentCard
                  key={comment.id}
                  comment={comment}
                  isAuthor={isAuthor}
                  isOwnComment={isOwnComment}
                />
              )
            })}

            <div ref={ref} className="py-4 text-center">
              {isFetchingNextPage && <Spinner />}
              {!hasNextPage && comments && comments.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  No more comments
                </p>
              )}
            </div>
          </div>
        </div>

        <Separator />

        <DialogFooter className="w-full shrink-0">
          {session ? (
            <form onSubmit={onSubmit} className="flex w-full flex-col gap-2">
              <div className="flex w-full items-center gap-2 sm:gap-3">
                <Avatar className="size-8 sm:size-9 shrink-0">
                  <AvatarImage
                    src={session.user.profilePhotoUrl ?? undefined}
                  />
                  <AvatarFallback className="text-[10px] sm:text-xs uppercase">
                    {session.user.username?.slice(0, 2) ?? "U"}
                  </AvatarFallback>
                </Avatar>
                <Input
                  placeholder="Write a comment..."
                  className="flex-1 text-sm"
                  disabled={isPending}
                  autoComplete="off"
                  {...register("content")}
                />
                <Button type="submit" disabled={isPending} size="sm" className="sm:h-9 sm:px-4">
                  {isPending ? <Spinner className="size-4" /> : "Send"}
                </Button>
              </div>
              {errors.content && (
                <span className="text-xs text-destructive">
                  {errors.content.message}
                </span>
              )}
              {isError && error && (
                <span className="text-xs text-destructive">
                  {error.message ?? "Error creating comment"}
                </span>
              )}
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ReviewDetailDialog
