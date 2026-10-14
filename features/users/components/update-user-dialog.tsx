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
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { updateUserAction } from "@/features/users/actions"
import { User } from "@/features/users/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import z from "zod"

const optionalString = (min = 3, message = "Minimum 3 characters") =>
  z
    .string()
    .trim()
    .optional()
    .transform((val) => (!val ? undefined : val))
    .pipe(z.string().min(min, message).optional())

const optionalUsername = () =>
  z
    .string()
    .trim()
    .optional()
    .transform((val) => (!val ? undefined : val))
    .pipe(
      z
        .string()
        .min(3, "Username must be at least 3 characters")
        .max(30, "Username must not exceed 30 characters")
        .regex(
          /^[a-zA-Z0-9_-]+$/,
          "Username can only contain letters, numbers, hyphens, and underscores"
        )
        .optional()
    )

const schema = z.object({
  username: optionalUsername(),
  bio: optionalString(),
})

interface Props {
  user?: User
}

function UpdateUserDialog({ user }: Props) {
  const router = useRouter()
  const { update } = useSession()
  const [open, setOpen] = useState(false)
  const [apiError, setApiError] = useState("")
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      username: user?.username ?? "",
      bio: user?.bio ?? "",
    },
  })

  useEffect(() => {
    if (open) {
      reset({
        username: user?.username ?? "",
        bio: user?.bio ?? "",
      })
    }
  }, [open, user, reset])

  const onSubmit = handleSubmit(async (data) => {
    try {
      const payload = {
        ...data,
        username: data.username !== user?.username ? data.username : undefined,
      }
      const updatedUser = await updateUserAction(payload)
      await update({
        user: {
          username: updatedUser.username,
          bio: updatedUser.bio,
        },
      })
      setOpen(false)
      if (updatedUser.username && updatedUser.username !== user?.username) {
        router.push(`/users/${updatedUser.username}`)
      } else {
        router.refresh()
      }
    } catch (error) {
      const err = error as Error
      setApiError(err.message)
    }
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button>Edit Profile</Button>} />
      <DialogContent className="w-[calc(100%-1rem)] max-w-md! p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle>Edit your profile</DialogTitle>
        </DialogHeader>
        <form id="user-form" onSubmit={onSubmit}>
          <FieldGroup>
            <Controller
              control={control}
              name="username"
              render={({ field }) => (
                <Field data-invalid={!!errors.username}>
                  <FieldLabel>Username</FieldLabel>
                  <Input
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    placeholder="Your unique username"
                  />
                  <FieldError>{errors.username?.message}</FieldError>
                </Field>
              )}
            />
            <Controller
              control={control}
              name="bio"
              render={({ field }) => (
                <Field data-invalid={!!errors.bio}>
                  <FieldLabel>Biography</FieldLabel>
                  <Textarea
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    placeholder="Your awesome bio..."
                  />
                  <FieldError>{errors.bio?.message}</FieldError>
                </Field>
              )}
            />
          </FieldGroup>
        </form>
        {apiError && <span className="text-destructive">{apiError}</span>}
        <DialogFooter>
          <Button form="user-form" type="submit">
            {isSubmitting && <Spinner />}
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default UpdateUserDialog
