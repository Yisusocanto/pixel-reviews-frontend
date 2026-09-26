"use client"

import { loginAction, registerAction } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  LoginInput,
  RegisterInput,
  loginSchema,
  registerSchema,
} from "@/lib/validations/auth"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

interface LoginModalProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  defaultTab?: "sign-in" | "sign-up"
  trigger?: React.ReactElement
}

function LoginModal({
  open: openProp,
  onOpenChange: onOpenChangeProp,
  defaultTab = "sign-in",
  trigger,
}: LoginModalProps) {
  const router = useRouter()
  const { update } = useSession()

  const [internalOpen, setInternalOpen] = useState(false)
  const isControlled = openProp !== undefined
  const open = isControlled ? openProp : internalOpen
  const setOpen = isControlled ? (onOpenChangeProp ?? (() => {})) : setInternalOpen

  const [activeTab, setActiveTab] = useState<"sign-in" | "sign-up">(defaultTab)

  // Sync activeTab whenever defaultTab changes or modal opens
  useEffect(() => {
    if (defaultTab) {
      setActiveTab(defaultTab)
    }
  }, [defaultTab])

  useEffect(() => {
    if (open) {
      setLoginError("")
      setRegisterError("")
    }
  }, [open])

  // --- Sign In ---
  const [loginError, setLoginError] = useState("")
  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    reset: resetLogin,
    formState: { errors: loginErrors, isSubmitting: isLoginSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) })

  const onLoginSubmit = handleLoginSubmit(async (data) => {
    setLoginError("")
    const response = await loginAction(data)
    if (!response.success) {
      setLoginError(response.error ?? "Authentication failed")
    } else {
      setOpen(false)
      resetLogin()
      await update()
      router.refresh()
    }
  })

  // --- Sign Up ---
  const [registerError, setRegisterError] = useState("")
  const {
    register: registerSignUp,
    handleSubmit: handleRegisterSubmit,
    reset: resetRegister,
    formState: { errors: registerErrors, isSubmitting: isRegisterSubmitting },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) })

  const onRegisterSubmit = handleRegisterSubmit(async (data) => {
    setRegisterError("")
    const response = await registerAction(data)
    if (!response.success) {
      setRegisterError(response.error ?? "Failed to create account")
    } else {
      setOpen(false)
      resetRegister()
      await update()
      router.refresh()
    }
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!isControlled && (
        <DialogTrigger
          render={trigger ?? <Button variant={"ghost"}>Sign in</Button>}
        />
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pixel Reviews</DialogTitle>
          <DialogDescription>FOR THOSE WHO PLAY</DialogDescription>
        </DialogHeader>
        <div>
          <Tabs
            value={activeTab}
            onValueChange={(val) => setActiveTab(val as "sign-in" | "sign-up")}
          >
            <TabsList className={"mb-4 w-full"}>
              <TabsTrigger value={"sign-in"}>Sign in</TabsTrigger>
              <TabsTrigger value={"sign-up"}>Create account</TabsTrigger>
            </TabsList>

            {/* ── Sign In ── */}
            <TabsContent value={"sign-in"}>
              <div>
                <h2 className="font-heading text-4xl">
                  WELCOME <br /> BACK.
                </h2>
                <p className="text-muted-foreground">The games missed you</p>
              </div>
              <div className="mt-4">
                <form onSubmit={onLoginSubmit} className="flex flex-col gap-2">
                  <Field data-invalid={!!loginErrors.email}>
                    <FieldLabel>Email</FieldLabel>
                    <Input
                      {...registerLogin("email")}
                      placeholder="johndoe@something.com"
                    />
                    <FieldError>{loginErrors.email?.message}</FieldError>
                  </Field>
                  <Field data-invalid={!!loginErrors.password}>
                    <FieldLabel>Password</FieldLabel>
                    <Input
                      type="password"
                      {...registerLogin("password")}
                      placeholder="********"
                    />
                    <FieldError>{loginErrors.password?.message}</FieldError>
                  </Field>
                  {loginError && (
                    <p className="text-sm text-red-500">{loginError}</p>
                  )}
                  <Button
                    className="w-full"
                    type="submit"
                    disabled={isLoginSubmitting}
                  >
                    {isLoginSubmitting ? "Signing in..." : "Sign in"}
                  </Button>
                </form>
              </div>
            </TabsContent>

            {/* ── Sign Up ── */}
            <TabsContent value={"sign-up"}>
              <div>
                <h2 className="font-heading text-4xl">
                  JOIN THE <br /> GAME.
                </h2>
                <p className="text-muted-foreground">
                  Create your account and start reviewing
                </p>
              </div>
              <div className="mt-4">
                <form
                  onSubmit={onRegisterSubmit}
                  className="flex flex-col gap-2"
                >
                  <Field data-invalid={!!registerErrors.email}>
                    <FieldLabel>Email</FieldLabel>
                    <Input
                      {...registerSignUp("email")}
                      placeholder="johndoe@something.com"
                    />
                    <FieldError>{registerErrors.email?.message}</FieldError>
                  </Field>
                  <Field data-invalid={!!registerErrors.username}>
                    <FieldLabel>Username</FieldLabel>
                    <Input
                      {...registerSignUp("username")}
                      placeholder="pixel_gamer"
                    />
                    <FieldError>{registerErrors.username?.message}</FieldError>
                  </Field>
                  <Field data-invalid={!!registerErrors.password}>
                    <FieldLabel>Password</FieldLabel>
                    <Input
                      type="password"
                      {...registerSignUp("password")}
                      placeholder="********"
                    />
                    <FieldError>{registerErrors.password?.message}</FieldError>
                  </Field>
                  <Field data-invalid={!!registerErrors.confirmPassword}>
                    <FieldLabel>Confirm password</FieldLabel>
                    <Input
                      type="password"
                      {...registerSignUp("confirmPassword")}
                      placeholder="********"
                    />
                    <FieldError>
                      {registerErrors.confirmPassword?.message}
                    </FieldError>
                  </Field>
                  <Field data-invalid={!!registerErrors.bio}>
                    <FieldLabel>
                      Bio{" "}
                      <span className="text-muted-foreground">(optional)</span>
                    </FieldLabel>
                    <Textarea
                      {...registerSignUp("bio")}
                      placeholder="Tell us about yourself..."
                    />
                    <FieldError>{registerErrors.bio?.message}</FieldError>
                  </Field>
                  {registerError && (
                    <p className="text-sm text-red-500">{registerError}</p>
                  )}
                  <Button
                    className="w-full"
                    type="submit"
                    disabled={isRegisterSubmitting}
                  >
                    {isRegisterSubmitting ? "Creating account..." : "Create account"}
                  </Button>
                </form>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default LoginModal
