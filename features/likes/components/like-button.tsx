"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import LoginModal from "@/components/auth/login-modal"
import { useLikeToggle } from "@/features/reviews/hooks"
import { cn } from "cn"

interface LikeButtonProps {
  reviewId: string
  likesCount: number
  likedByUser: boolean
  className?: string
}

export function LikeButton({
  reviewId,
  likesCount,
  likedByUser,
  className,
}: LikeButtonProps) {
  const { data: session } = useSession()
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const { mutate: toggleLike, isPending } = useLikeToggle()

  const handleLike = () => {
    if (!session?.user) {
      setAuthModalOpen(true)
      return
    }

    toggleLike(reviewId)
  }

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon-lg"
        onClick={handleLike}
        disabled={isPending}
        className={cn(
          "flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium transition-colors hover:bg-muted/60",
          likedByUser
            ? "text-red-500 hover:text-red-600"
            : "text-muted-foreground hover:text-foreground",
          className
        )}
      >
        <Heart
          className={cn(
            "h-4 w-4 transition-transform duration-200 active:scale-125",
            likedByUser && "fill-current"
          )}
        />
        <span>{likesCount}</span>
      </Button>

      <LoginModal
        open={authModalOpen}
        onOpenChange={setAuthModalOpen}
        defaultTab="sign-in"
      />
    </>
  )
}

export default LikeButton
