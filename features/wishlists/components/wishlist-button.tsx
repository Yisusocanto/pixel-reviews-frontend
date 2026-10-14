"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Bookmark } from "lucide-react"
import { Button } from "@/components/ui/button"
import LoginModal from "@/components/auth/login-modal"
import { InUserWishlist } from "@/features/wishlists/types"
import {
  useToggleWishlist,
  useUserGameWishlist,
} from "@/features/wishlists/hooks"

interface WishlistButtonProps {
  gameId: string
  initialData?: InUserWishlist
  className?: string
}

export function WishlistButton({
  gameId,
  initialData,
  className,
}: WishlistButtonProps) {
  const { data: session } = useSession()
  const [authModalOpen, setAuthModalOpen] = useState(false)

  const { data: wishlistStatus } = useUserGameWishlist(gameId, initialData)
  const { mutate: toggleWishlist } = useToggleWishlist(gameId)

  const inWishlist = Boolean(wishlistStatus?.inWishlist)

  const handleClick = () => {
    if (!session?.user) {
      setAuthModalOpen(true)
      return
    }

    toggleWishlist({ gameId })
  }

  return (
    <>
      <Button
        type="button"
        variant={inWishlist ? "default" : "outline"}
        onClick={handleClick}
        className={className}
      >
        <Bookmark
          className={`h-4 w-4 transition-transform duration-200 ${
            inWishlist
              ? "scale-110 fill-primary-foreground text-primary-foreground"
              : "text-muted-foreground"
          }`}
        />
        <span>{inWishlist ? "In Wishlist" : "Add to Wishlist"}</span>
      </Button>

      <LoginModal
        open={authModalOpen}
        onOpenChange={setAuthModalOpen}
        defaultTab="sign-in"
      />
    </>
  )
}

export default WishlistButton
