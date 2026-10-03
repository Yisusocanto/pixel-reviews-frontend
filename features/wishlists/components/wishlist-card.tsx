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
    <div className={cn("flex justify-between py-3", className)}>
      <div className="flex items-center gap-4">
        <div className="relative aspect-2/3 w-12 overflow-hidden rounded-md border">
          <Image
            className="absolute inset-0 object-cover"
            src={wishlist.game?.imageUrl}
            alt={wishlist.game?.title}
            fill
          />
        </div>
        <div className="flex flex-col">
          <Link
            href={`/games/${wishlist.game.slug}`}
            className="text-xl font-bold transition-colors duration-300 ease-in-out hover:text-primary"
          >
            {wishlist.game?.title}
          </Link>
          <span className="text-muted-foreground">
            {dayjs(wishlist.game?.releaseDate).format("YYYY")}
          </span>
        </div>
      </div>
      {ownWishlist && (
        <WishlistButton
          gameId={wishlist.game?.id ?? wishlist.gameId}
          initialData={{ inWishlist: true, wishlistId: wishlist.id }}
        />
      )}
    </div>
  )
}

export default WishlistCard
