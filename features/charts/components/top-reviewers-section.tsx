import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge-2"
import { Card, CardContent } from "@/components/ui/card"
import { UserWithTheMostReviews } from "@/features/charts/types"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface TopReviewersSectionProps {
  users: UserWithTheMostReviews[]
}

export function TopReviewersSection({ users }: TopReviewersSectionProps) {
  return (
    <section>
      <div className="mb-4">
        <span className="text-xs font-semibold tracking-widest text-primary uppercase">
          Community
        </span>
        <h2 className="font-heading text-2xl font-extrabold tracking-tight uppercase">
          Top Reviewers
        </h2>
      </div>

      <Card className="py-2">
        <CardContent className="px-2 sm:px-3">
          {users.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-muted-foreground">
              No active reviewers yet.
            </p>
          ) : (
            <ol className="grid grid-cols-1 gap-x-6 divide-y divide-border/60 md:grid-cols-2 md:divide-y-0">
              {users.map((item, i) => (
                <li
                  key={item.user.id}
                  className="md:border-b md:border-border/60 md:nth-last-[-n+2]:border-b-0"
                >
                  <Link
                    href={`/users/${item.user.username}`}
                    className="group/row flex items-center justify-between gap-3 rounded-2xl px-3 py-3 transition-colors hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      <span
                        className={cn(
                          "w-7 shrink-0 text-right font-heading text-lg font-extrabold tabular-nums",
                          i < 3 ? "text-primary" : "text-muted-foreground/70"
                        )}
                      >
                        {i + 1}
                      </span>

                      <Avatar>
                        <AvatarImage
                          src={item.user.profilePhotoUrl}
                          alt={item.user.username}
                        />
                        <AvatarFallback className="font-bold uppercase">
                          {item.user.username.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="min-w-0 flex-1">
                        <h3 className="truncate font-heading text-base font-bold transition-colors group-hover/row:text-primary">
                          @{item.user.username}
                        </h3>
                        <p className="text-xs text-muted-foreground tabular-nums">
                          <strong className="font-semibold text-foreground">
                            {item.count.toLocaleString()}
                          </strong>{" "}
                          {item.count === 1 ? "review" : "reviews"}
                        </p>
                      </div>
                    </div>

                    {item.lastWeek > 0 && (
                      <Badge
                        variant="outline"
                        size="sm"
                        shape="circle"
                        className="shrink-0 border-primary/30 bg-primary/10 text-primary tabular-nums"
                      >
                        +{item.lastWeek} this week
                      </Badge>
                    )}
                  </Link>
                </li>
              ))}
            </ol>
          )}
        </CardContent>
      </Card>
    </section>
  )
}
