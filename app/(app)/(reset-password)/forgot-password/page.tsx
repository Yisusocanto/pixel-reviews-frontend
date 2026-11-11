"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { forgotPasswordAction } from "@/features/users/actions"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import z from "zod"

const schema = z.object({
  email: z.email(),
})

function ForgotPasswordPage() {
  const [apiRes, setApiRes] = useState("")
  const [apiError, setApiError] = useState("")
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  })

  const onSubmit = handleSubmit(async (data) => {
    setApiError("")
    setApiRes("")
    try {
      const res = await forgotPasswordAction(data.email)
      setApiRes(res.message)
    } catch (error) {
      const err = error as Error
      setApiError(err.message)
    }
  })

  return (
    <div className="m-auto">
      <Card className="w-sm">
        <CardHeader>
          <CardTitle>Forgot your password</CardTitle>
          <CardDescription>
            Please enter the email address you&apos;d like your password reset
            information sent to
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit}>
            <Field data-invalid={!!errors.email}>
              <FieldLabel>Enter email address</FieldLabel>
              <Input placeholder="johndow@example.com" {...register("email")} />
              <FieldError>{errors.email?.message}</FieldError>
            </Field>
            {apiRes && <span className="text-green-500">{apiRes}</span>}
            {apiError && <span className="text-destructive">{apiError}</span>}
            <Button className="mt-4 w-full">
              {isSubmitting && <Spinner />}
              {isSubmitting ? "Sending..." : "Send Email"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default ForgotPasswordPage
