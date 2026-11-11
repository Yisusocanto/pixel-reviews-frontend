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
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "@/components/ui/toast"
import { resetPasswordAction } from "@/features/users/actions"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeClosed } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useState } from "react"
import { useForm } from "react-hook-form"
import z from "zod"

const schema = z
  .object({
    newPassword: z.string().min(6, "Minimum 6 characters"),
    confirmPassword: z.string().min(6, "Minimum 6 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    error: "The passwords do not match",
    path: ["confirmPassword"],
  })

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [apiError, setApiError] = useState("")
  const [passwordVisible, setPasswordVisible] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  })

  const token = searchParams.get("token") ?? ""

  const onSubmit = handleSubmit(async (data) => {
    setApiError("")
    try {
      const res = await resetPasswordAction(token, data.newPassword)
      toast.add({
        type: "success",
        title: "Password updated",
        description:
          res.message || "Your password has been reset. You can now sign in.",
      })
      router.replace("/")
    } catch (error) {
      const err = error as Error
      setApiError(err.message)
    }
  })

  return (
    <div className="m-auto">
      <Card className="w-sm">
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>
            Enter your new password below to regain access to your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit}>
            <FieldGroup>
              <Field data-invalid={!!errors.newPassword}>
                <FieldLabel>New Password</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    {...register("newPassword")}
                    placeholder="********"
                    type={passwordVisible ? "text" : "password"}
                  />
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton
                      type="button"
                      aria-label="Toggle password visibility"
                      onClick={() => setPasswordVisible((prev) => !prev)}
                    >
                      {passwordVisible ? <EyeClosed /> : <Eye />}
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
                <FieldError>{errors.newPassword?.message}</FieldError>
              </Field>
              <Field data-invalid={!!errors.confirmPassword}>
                <FieldLabel>Confirm Password</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    {...register("confirmPassword")}
                    placeholder="********"
                    type={passwordVisible ? "text" : "password"}
                  />
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton
                      type="button"
                      aria-label="Toggle password visibility"
                      onClick={() => setPasswordVisible((prev) => !prev)}
                    >
                      {passwordVisible ? <EyeClosed /> : <Eye />}
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
                <FieldError>{errors.confirmPassword?.message}</FieldError>
              </Field>
            </FieldGroup>
            {apiError && (
              <p className="mt-2 text-sm text-destructive">{apiError}</p>
            )}
            <Button
              type="submit"
              disabled={isSubmitting || !token}
              className="mt-4 w-full"
            >
              {isSubmitting && <Spinner />}
              {isSubmitting ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  )
}

export default ResetPasswordPage
