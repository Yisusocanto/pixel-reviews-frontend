import { Award, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"

interface Props {
  score?: number | null
  count?: number | null
  url?: string | null
  className?: string
}

function GameMetacriticCard({ score, count, url, className }: Props) {
  if (score === null || score === undefined || Number.isNaN(score)) {
    return null
  }

  const scoreBadgeColor =
    score >= 75
      ? "bg-emerald-600"
      : score >= 50
        ? "bg-amber-500"
        : "bg-rose-600"

  const scoreLabel =
    score >= 75
      ? "Generally Favorable"
      : score >= 50
        ? "Mixed or Average"
        : "Generally Unfavorable"

  return (
    <section className={className}>
      <h2 className="mb-4 font-heading text-sm font-bold tracking-widest text-primary uppercase">
        Critic Consensus
      </h2>
      <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex size-6 items-center justify-center rounded bg-primary/15 text-primary">
              <Award className="size-3.5" />
            </div>
            <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              IGDB Critic Score
            </span>
          </div>
          {url && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              <span>IGDB page</span>
              <ExternalLink className="size-3 transition-transform group-hover:translate-x-0.5" />
            </a>
          )}
        </div>
        <div className="flex items-center gap-4 pt-1">
          <div
            className={cn(
              "flex size-14 shrink-0 items-center justify-center rounded-lg text-2xl font-black text-white shadow-sm",
              scoreBadgeColor
            )}
          >
            {score}
          </div>
          <div className="flex min-w-0 flex-col">
            <span className="text-sm font-bold text-foreground">
              {scoreLabel}
            </span>
            <span className="text-xs text-muted-foreground">
              {count && count > 0
                ? `Aggregated from ${count} critic ${count === 1 ? "source" : "sources"}`
                : "Based on aggregated critic ratings"}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default GameMetacriticCard
