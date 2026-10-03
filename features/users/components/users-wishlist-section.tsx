"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useUserWishlist } from "@/features/users/hooks"
import WishlistCard from "@/features/wishlists/components/wishlist-card"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { useSession } from "next-auth/react"
import { useState } from "react"

interface Props {
  username: string
}

function UsersWishlistSection({ username }: Props) {
  const { data: session } = useSession()
  const [page, setPage] = useState(1)
  const limit = 4
  const { data, isLoading, isError } = useUserWishlist(username, page, limit)

  if (isLoading) return <p>Cargando primera página...</p>
  if (isError) return <p>Ocurrió un error al cargar.</p>
  if (!data) return null

  const hasNextPage = page < data?.totalPages
  const hasPreviousPage = page > 1

  const ownProfile = session?.user.username == username

  return (
    <div>
      <h2 className="font-heading text-2xl font-bold">Wishlist</h2>
      <div className="flex flex-col gap-2">
        {data.items.map((item) => (
          <WishlistCard
            key={item.id}
            wishlist={item}
            ownWishlist={ownProfile}
            className="border-b border-b-border last:border-0"
          />
        ))}
      </div>
      <Separator className="my-2" />
      <div className="flex items-center justify-between">
        <Button
          variant={"ghost"}
          disabled={!hasPreviousPage}
          onClick={() => hasPreviousPage && setPage(page - 1)}
        >
          <ArrowLeft />
          Prev
        </Button>
        <div>
          <span className="text-sm text-muted-foreground">
            page {page}/{data.totalPages}
          </span>
        </div>
        <Button
          variant={"ghost"}
          disabled={!hasNextPage}
          onClick={() => hasNextPage && setPage(page + 1)}
        >
          Next
          <ArrowRight />
        </Button>
      </div>
    </div>
  )
}

export default UsersWishlistSection
