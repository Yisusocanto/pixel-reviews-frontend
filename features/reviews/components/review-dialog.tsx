"use client"

import { useState } from "react"
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
import { useCreateReview } from "@/features/reviews/hooks/use-reviews"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Controller } from "react-hook-form"
import z from "zod"

interface Props {
  game: Game
  isOpen?: boolean
  onOpenChange?: (v: boolean) => void
}

const optionalString = () =>
  z.preprocess(
    (val) => (typeof val === "string" && val.trim() === "" ? undefined : val),
    z.string().min(3, "Minimun 3 characters").optional()
  )

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

function ReviewDialog({
  game,
  isOpen: externalOpen,
  onOpenChange: externalOnOpenChange,
}: Props) {
  const [internalOpen, setInternalOpen] = useState(false)
  const isControlled = externalOpen !== undefined
  const open = isControlled ? externalOpen : internalOpen
  const setOpen = (nextOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(nextOpen)
    }
    externalOnOpenChange?.(nextOpen)
  }

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      score: 0,
      title: "",
      content: "",
    },
  })

  const { mutate: createReview, isPending } = useCreateReview()

  const onSubmit = handleSubmit((data) => {
    createReview(
      {
        ...data,
        gameId: game.id,
      },
      {
        onSuccess: () => {
          setOpen(false)
          reset()
        },
      }
    )
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button>Review it</Button>} />
      <DialogContent className={"border-t-2 border-t-primary"}>
        <DialogHeader>
          <DialogTitle>Review {game.title}</DialogTitle>
          <DialogDescription>
            Share your opinion with the community and upgrade your status
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
                      size="lg"
                    />
                    <FieldError>{errors.score?.message}</FieldError>
                  </Field>
                )}
              />
            </div>
            <Separator className={"my-4"} />
            <FieldGroup>
              <Field data-invalid={!!errors.title}>
                <FieldLabel>Title</FieldLabel>
                <Input {...register("title")} placeholder="the review title" />
                <FieldError>{errors.title?.message}</FieldError>
              </Field>
              <Field data-invalid={!!errors.content}>
                <FieldLabel>Content</FieldLabel>
                <Textarea
                  {...register("content")}
                  placeholder="Your amazing opinion"
                />
                <FieldError>{errors.content?.message}</FieldError>
              </Field>
            </FieldGroup>
          </form>
        </div>
        <DialogFooter>
          <DialogClose render={<Button variant={"outline"}>Cancel</Button>} />
          <Button form="review-form" type="submit">
            {isPending && <Spinner />}
            {isPending ? "Creating..." : "Create Review"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ReviewDialog
