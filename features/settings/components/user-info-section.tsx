"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/toast"
import { updateUserAction } from "@/features/users/actions"
import { User } from "@/features/users/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import React, { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import z from "zod"

interface Props {
  user: User
}

const optionalString = (min = 3, message = "Minimun 3 characters") =>
  z
    .string()
    .trim()
    .optional()
    .transform((val) => (!val ? undefined : val))
    .pipe(z.string().min(min, message).optional())

const schema = z.object({
  username: optionalString(),
  bio: optionalString(),
})

function UserInfoSection({ user }: Props) {
  const { update } = useSession()
  const router = useRouter()
  const [apiError, setApiError] = useState("")
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      username: user.username,
      bio: user.bio ?? "",
    },
  })

  const onSubmit = handleSubmit(async (data) => {
    try {
      const payload = {
        ...data,
        username: data.username !== user.username ? data.username : undefined,
      }

      const updatedUser = await updateUserAction(payload)
      update({
        user: {
          username: updatedUser.username,
          bio: updatedUser.bio,
        },
      })

      toast.add({
        type: "success",
        description: "User data updated succesfully",
      })

      if (updatedUser.username != user.username) {
        router.replace(`/users/${updatedUser.username}`)
      } else {
        router.refresh()
      }
    } catch (error) {
      const err = error as Error
      setApiError(err.message)
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>User information</CardTitle>
        <CardDescription>Public identity at Pixel Reviews</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit}>
          <FieldGroup>
            <Controller
              control={control}
              name="username"
              render={({ field }) => (
                <Field data-invalid={!!errors.username}>
                  <FieldLabel>Username</FieldLabel>
                  <Input value={field.value} onChange={field.onChange} />
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
                  <Textarea value={field.value} onChange={field.onChange} />
                  <FieldError>{errors.bio?.message}</FieldError>
                </Field>
              )}
            />
          </FieldGroup>
          {apiError && <span className="text-destructive">{apiError}</span>}
          <Button type="submit" className="mt-2">
            {isSubmitting && <Spinner />}
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default UserInfoSection
