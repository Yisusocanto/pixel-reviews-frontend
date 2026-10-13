"use client"

import { useTransition } from "react"
import { FcGoogle } from "react-icons/fc"
import { googleLoginAction } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

interface GoogleSignInButtonProps {
  text?: string
}

export function GoogleSignInButton({
  text = "Continue with Google",
}: GoogleSignInButtonProps) {
  const [isPending, startTransition] = useTransition()

  const handleClick = () => {
    startTransition(async () => {
      await googleLoginAction()
    })
  }

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full gap-2"
      disabled={isPending}
      onClick={handleClick}
    >
      {isPending ? (
        <Spinner className="size-4" />
      ) : (
        <FcGoogle className="size-5" />
      )}
      <span>{text}</span>
    </Button>
  )
}
