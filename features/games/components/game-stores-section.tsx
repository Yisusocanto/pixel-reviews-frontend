import { ExternalLink } from "lucide-react"
import { Store } from "@/types/store"
import { StoreIcon } from "./store-icon"

interface Props {
  stores?: Store[]
  className?: string
}

function getStoreHref(store: Store): string {
  const target =
    store.url && store.url.trim().length > 0
      ? store.url.trim()
      : store.domain && store.domain.trim().length > 0
        ? store.domain.trim()
        : ""

  if (!target) return "#"

  if (/^https?:\/\//i.test(target)) {
    return target
  }

  return `https://${target}`
}

function GameStoresSection({ stores, className }: Props) {
  if (!stores || stores.length === 0) {
    return null
  }

  return (
    <section className={className}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-heading text-sm font-bold tracking-widest text-primary uppercase">
          Where to Buy
        </h2>
        <span className="font-mono text-xs text-muted-foreground">
          {stores.length} {stores.length === 1 ? "store" : "stores"}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-2.5">
        {stores.map((store) => {
          const href = getStoreHref(store)
          return (
            <a
              key={store.id || store.slug}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center justify-between overflow-hidden rounded-xl border border-border/70 bg-card/60 p-3.5 backdrop-blur-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:bg-card hover:shadow-md hover:shadow-primary/5"
            >
              <div className="flex min-w-0 items-center gap-3.5">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border/50 bg-secondary/70 text-foreground transition-all duration-200 group-hover:scale-105 group-hover:border-primary/40 group-hover:bg-primary/10 group-hover:text-primary">
                  <StoreIcon
                    slug={store.slug}
                    domain={store.domain}
                    name={store.name}
                    className="size-5 shrink-0"
                  />
                </div>
                <div className="flex min-w-0 flex-col">
                  <span className="truncate text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                    {store.name}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {store.domain || "Official Store"}
                  </span>
                </div>
              </div>

              <div className="flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-all duration-200 group-hover:bg-primary/10 group-hover:text-primary">
                <ExternalLink className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </a>
          )
        })}
      </div>
    </section>
  )
}

export default GameStoresSection
