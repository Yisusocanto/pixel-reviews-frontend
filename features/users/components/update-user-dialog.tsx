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
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { updateUserAction } from "@/features/users/actions"
import { User } from "@/features/users/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import z from "zod"

const schema = z.object({
  bio: z
    .string()
    .trim()
    .min(3, "Minimun 3 characters")
    .optional()
    .or(z.literal("").transform(() => undefined)),
})

interface Props {
  user?: User
}

function UpdateUserDialog({ user }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [apiError, setApiError] = useState("")
  const {
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      bio: user?.bio ?? "",
    },
  })

  const onSubmit = handleSubmit(async (data) => {
    try {
      await updateUserAction(data)
      setOpen(false)
      router.refresh()
    } catch (error) {
      const err = error as Error
      setApiError(err.message)
    }
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button>Edit Profile</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit your profile</DialogTitle>
        </DialogHeader>
        <form id="user-form" onSubmit={onSubmit}>
          <FieldGroup>
            <Controller
              control={control}
              name="bio"
              render={({ field }) => (
                <Field data-invalid={!!errors.bio}>
                  <FieldLabel>Biography</FieldLabel>
                  <Textarea
                    value={field.value}
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
