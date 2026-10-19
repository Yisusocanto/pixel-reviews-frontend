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
import { updateUserPasswordAction } from "@/features/users/actions"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import z from "zod"

const schema = z
  .object({
    oldPassword: z.string(),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

function SecuritySection() {
  const [apiError, setApiError] = useState("")
  const [oldPasswordVisible, setOldPasswordVisible] = useState(false)
  const [newPasswordVisible, setNewPasswordVisible] = useState(false)
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false)
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  })

  const onSubmit = handleSubmit(async (data) => {
    try {
      await updateUserPasswordAction(data.oldPassword, data.newPassword)
      toast.add({
        type: "success",
        description: "Password updated succesfully",
      })
    } catch (error) {
      const err = error as Error
      setApiError(err.message)
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Security</CardTitle>
        <CardDescription>
          Update your password periodically to keep your account secure and
          protect your reviews.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit}>
          <FieldGroup>
            <Field data-invalid={!!errors.oldPassword}>
              <FieldLabel>Old Password</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  {...register("oldPassword")}
                  placeholder="Your old password"
                  type={oldPasswordVisible ? "text" : "password"}
                />
                <InputGroupAddon align={"inline-end"}>
                  <InputGroupButton
                    aria-label="see old password"
                    title="see old password"
                    onClick={() => setOldPasswordVisible((pre) => !pre)}
                  >
                    {oldPasswordVisible ? <EyeOff /> : <Eye />}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
              <FieldError>{errors.oldPassword?.message}</FieldError>
            </Field>
            <Field data-invalid={!!errors.newPassword}>
              <FieldLabel>New Password</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  {...register("newPassword")}
                  placeholder="Your new password"
                  type={newPasswordVisible ? "text" : "password"}
                />
                <InputGroupAddon align={"inline-end"}>
                  <InputGroupButton
                    aria-label="see new password"
                    title="see new password"
                    onClick={() => setNewPasswordVisible((pre) => !pre)}
                  >
                    {newPasswordVisible ? <EyeOff /> : <Eye />}
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
                  placeholder="confirm password"
                  type={confirmPasswordVisible ? "text" : "password"}
                />
                <InputGroupAddon align={"inline-end"}>
                  <InputGroupButton
                    aria-label="confirm password"
                    title="confirm password"
                    onClick={() => setConfirmPasswordVisible((pre) => !pre)}
                  >
                    {confirmPasswordVisible ? <EyeOff /> : <Eye />}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
              <FieldError>{errors.confirmPassword?.message}</FieldError>
            </Field>
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

export default SecuritySection
