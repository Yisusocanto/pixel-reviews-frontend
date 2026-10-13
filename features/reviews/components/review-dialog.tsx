"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"
import StarRating from "@/components/ui/star-rating"
import { Textarea } from "@/components/ui/textarea"
import { Game } from "@/features/games/types"
import {
  useCreateReview,
  useUpdateReview,
  useUserGameReview,
} from "@/features/reviews/hooks"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import z from "zod"
import { Review } from "@/features/reviews/types"

interface Props {
  game: Game
  review?: Review | null
  isOpen?: boolean
  onOpenChange?: (v: boolean) => void
  trigger?: React.ReactElement
}

const optionalString = () =>
  z
    .string()
    .trim()
    .min(3, "Minimum 3 characters")
    .optional()
    .or(z.literal("").transform(() => undefined))

const schema = z
  .object({
    score: z
      .number()
      .min(1, "The minimun score is 1")
      .max(5, "The maximun score is 5"),
    title: optionalString(),
    content: optionalString(),
  })
  .refine(
    (data) => {
      const hasTitle = Boolean(data.title)
      const hasContent = Boolean(data.content)

      return hasTitle === hasContent
    },
    {
      message:
        "If you provide a title you have to write the content of the review too.",
      path: ["content"],
    }
  )

type ReviewFormValues = {
  score: number
  title?: string
  content?: string
}

function ReviewDialog({
  game,
  review: initialReview,
  isOpen: externalOpen,
  onOpenChange: externalOnOpenChange,
  trigger,
}: Props) {
  const [internalOpen, setInternalOpen] = useState(false)
  const isControlled = externalOpen !== undefined
  const open = isControlled ? externalOpen : internalOpen

  const router = useRouter()
  const { data: userReview } = useUserGameReview(game.id, initialReview)
  const currentReview = userReview !== undefined ? userReview : initialReview
  const isEditing = Boolean(currentReview?.id)

  const defaultValues = useMemo(
    () => ({
      score: currentReview?.score ?? 0,
      title: currentReview?.title ?? "",
      content: currentReview?.content ?? "",
    }),
    [currentReview?.score, currentReview?.title, currentReview?.content]
  )

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(schema),
    values: defaultValues,
  })

  const setOpen = (nextOpen: boolean) => {
    if (!nextOpen) {
      reset(defaultValues)
    }
    if (!isControlled) {
      setInternalOpen(nextOpen)
    }
    externalOnOpenChange?.(nextOpen)
  }

  const { mutate: createReview, isPending: isCreating } = useCreateReview()
  const { mutate: updateReview, isPending: isUpdating } = useUpdateReview()
  const isPending = isCreating || isUpdating

  const onSubmit = handleSubmit((data) => {
    if (isEditing && currentReview) {
      updateReview(
        {
          id: currentReview.id,
          data: {
            score: data.score,
            title: data.title ? data.title.trim() : null,
            content: data.content ? data.content.trim() : null,
          },
        },
        {
          onSuccess: () => {
            setOpen(false)
            router.refresh()
          },
        }
      )
    } else {
      createReview(
        {
          score: data.score,
          title: data.title ? data.title.trim() : undefined,
          content: data.content ? data.content.trim() : undefined,
          gameId: game.id,
        },
        {
          onSuccess: () => {
            setOpen(false)
            router.refresh()
          },
        }
      )
    }
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger !== null && (
        <DialogTrigger
          render={
            trigger ?? (
              <Button
                className="w-fit"
                variant={isEditing ? "outline" : "default"}
              >
                {isEditing ? "Edit review" : "Review it"}
              </Button>
            )
          }
        />
      )}
      <DialogContent className={"w-[calc(100%-1rem)] max-w-lg! p-4 sm:p-6 border-t-2 border-t-primary max-h-[90dvh] overflow-y-auto"}>
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg">
            {isEditing
              ? `Edit review for ${game.title}`
              : `Review ${game.title}`}
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            {isEditing
              ? "Update your review and rating for this game"
              : "Share your opinion with the community and upgrade your status"}
          </DialogDescription>
        </DialogHeader>
        <div>
          <form onSubmit={onSubmit} id="review-form">
            <div>
              <Controller
                control={control}
                name="score"
                render={({ field }) => (
                  <Field data-invalid={!!errors.score}>
                    <StarRating
                      value={field.value}
                      onValueChange={field.onChange}
                      showValue
                      size="md"
                    />
                    <FieldError>{errors.score?.message}</FieldError>
                  </Field>
                )}
              />
            </div>
            <Separator className={"my-4"} />
            <FieldGroup>
              <Controller
                control={control}
                name="title"
                render={({ field }) => (
                  <Field data-invalid={!!errors.title}>
                    <FieldLabel>Title</FieldLabel>
                    <Input
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      placeholder="the review title"
                    />
                    <FieldError>{errors.title?.message}</FieldError>
                  </Field>
                )}
              />
              <Controller
                control={control}
                name="content"
                render={({ field }) => (
                  <Field data-invalid={!!errors.content}>
                    <FieldLabel>Content</FieldLabel>
                    <Textarea
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      placeholder="Your amazing opinion"
                    />
                    <FieldError>{errors.content?.message}</FieldError>
                  </Field>
                )}
              />
            </FieldGroup>
          </form>
        </div>
        <DialogFooter>
          <DialogClose render={<Button variant={"outline"}>Cancel</Button>} />
          <Button form="review-form" type="submit" disabled={isPending}>
            {isPending && <Spinner />}
            {isPending
              ? isEditing
                ? "Updating..."
                : "Creating..."
              : isEditing
                ? "Update Review"
                : "Create Review"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export { ReviewDialog }
export default ReviewDialog
