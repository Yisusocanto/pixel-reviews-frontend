import WishlistButton from "@/features/wishlists/components/wishlist-button"
import { Wishlist } from "@/features/wishlists/types"
import { cn } from "cn"
import dayjs from "dayjs"
import Image from "next/image"
import Link from "next/link"

interface Props {
  wishlist: Wishlist
  ownWishlist?: boolean
  className?: string
}

function WishlistCard({ wishlist, ownWishlist = false, className }: Props) {
  return (
    <div className={cn("flex items-center justify-between gap-3 py-3", className)}>
      <div className="flex min-w-0 items-center gap-3 sm:gap-4">
        <div className="relative aspect-2/3 w-12 shrink-0 overflow-hidden rounded-md border">
          <Image
            className="absolute inset-0 object-cover"
            src={wishlist.game?.imageUrl}
            alt={wishlist.game?.title}
            fill
            sizes="48px"
          />
        </div>
        <div className="flex min-w-0 flex-col">
          <Link
            href={`/games/${wishlist.game?.slug}`}
            className="truncate text-base font-bold transition-colors duration-300 ease-in-out hover:text-primary sm:text-lg"
          >
            {wishlist.game?.title}
          </Link>
          <span className="text-xs text-muted-foreground sm:text-sm">
            {dayjs(wishlist.game?.releaseDate).format("YYYY")}
          </span>
        </div>
      </div>
      {ownWishlist && (
        <div className="shrink-0">
          <WishlistButton
            gameId={wishlist.game?.id ?? wishlist.gameId}
            initialData={{ inWishlist: true, wishlistId: wishlist.id }}
          />
        </div>
      )}
    </div>
  )
}

export default WishlistCard
