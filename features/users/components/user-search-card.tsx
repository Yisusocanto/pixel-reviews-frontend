import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserSearch } from "@/features/users/types"
import Link from "next/link"

interface Props {
  user: UserSearch
}

function UserSearchCard({ user }: Props) {
  return (
    <Link
      href={`/users/${user.username}`}
      className="group flex items-center gap-4 border border-t-2 border-border/50 border-t-primary bg-card/60 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-xl hover:shadow-primary/5"
    >
      <Avatar className="size-14">
        <AvatarImage src={user.profilePhotoUrl} />
        <AvatarFallback className="text-lg font-bold uppercase">
          {user.username.charAt(0)}
        </AvatarFallback>
      </Avatar>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="truncate font-heading text-lg font-bold uppercase transition-colors group-hover:text-primary">
          {user.username}
        </span>
        {user.bio && (
          <p className="line-clamp-2 text-xs text-muted-foreground">
            {user.bio}
          </p>
        )}
      </div>
    </Link>
  )
}

export default UserSearchCard
