"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginAction, registerAction } from "@/app/actions/auth"
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button"
import { Button } from "@/components/ui/button"
import { PixelGamepadIcon } from "@/components/ui/pixel-gamepad-icon"
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
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  LoginInput,
  RegisterInput,
  loginSchema,
  registerSchema,
} from "@/lib/validations/auth"
import Link from "next/link"

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
  const setOpen = isControlled
    ? (onOpenChangeProp ?? (() => {}))
    : setInternalOpen

  const [loginError, setLoginError] = useState("")
  const [registerError, setRegisterError] = useState("")
  const [activeTab, setActiveTab] = useState<"sign-in" | "sign-up">(defaultTab)

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      setLoginError("")
      setRegisterError("")
      setActiveTab(defaultTab)
    }
    setOpen(newOpen)
  }

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
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {!isControlled && (
        <DialogTrigger
          render={trigger ?? <Button variant={"ghost"}>Sign in</Button>}
        />
      )}
      <DialogContent className="max-h-[90dvh] w-[calc(100%-1rem)] max-w-md! overflow-y-auto p-4 sm:p-6">
        <DialogHeader className="gap-1.5">
          <div className="flex items-center gap-2">
            <PixelGamepadIcon className="h-6 w-12 shrink-0 text-primary" />
            <DialogTitle className="text-xl font-black tracking-tight">
              <span className="text-primary">Pixel</span> Reviews
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs tracking-widest uppercase">
            For those who play
          </DialogDescription>
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

            <TabsContent value={"sign-in"}>
              <div>
                <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl">
                  WELCOME <br /> BACK.
                </h2>
                <p className="text-xs text-muted-foreground sm:text-sm">
                  The games missed you
                </p>
              </div>
              <div className="mt-4 flex flex-col gap-4">
                <GoogleSignInButton text="Sign in with Google" />

                <div className="relative flex items-center justify-center">
                  <Separator className="w-full" />
                  <span className="absolute bg-background px-2 text-xs text-muted-foreground uppercase">
                    Or
                  </span>
                </div>

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
                  <Link
                    href={"/forgot-password"}
                    className="text-primary underline"
                    onClick={() => handleOpenChange(false)}
                  >
                    Forgot password?
                  </Link>
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

            <TabsContent value={"sign-up"}>
              <div>
                <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl">
                  JOIN THE <br /> GAME.
                </h2>
                <p className="text-xs text-muted-foreground sm:text-sm">
                  Create your account and start reviewing
                </p>
              </div>
              <div className="mt-4 flex flex-col gap-4">
                <GoogleSignInButton text="Sign up with Google" />

                <div className="relative flex items-center justify-center">
                  <Separator className="w-full" />
                  <span className="absolute bg-background px-2 text-xs text-muted-foreground uppercase">
                    Or
                  </span>
                </div>

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
                  <Link
                    href={"/forgot-password"}
                    className="text-primary underline"
                    onClick={() => handleOpenChange(false)}
                  >
                    Forgot password?
                  </Link>
                  <Button
                    className="w-full"
                    type="submit"
                    disabled={isRegisterSubmitting}
                  >
                    {isRegisterSubmitting
                      ? "Creating account..."
                      : "Create account"}
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
