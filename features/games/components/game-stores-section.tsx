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
      <h2 className="mb-4 font-heading font-bold tracking-widest text-primary uppercase">
        Where to Buy
      </h2>
      <div className="flex flex-col gap-2.5">
        {stores.map((store) => {
          const href = getStoreHref(store)
          return (
            <a
              key={store.id || store.slug}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between rounded-lg border border-border bg-card/60 p-3 transition-colors hover:border-primary/50 hover:bg-card"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                  <StoreIcon
                    slug={store.slug}
                    domain={store.domain}
                    name={store.name}
                    className="size-4.5"
                  />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="truncate text-sm font-semibold transition-colors group-hover:text-primary">
                    {store.name}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {store.domain}
                  </span>
                </div>
              </div>
              <ExternalLink className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
            </a>
          )
        })}
      </div>
    </section>
  )
}

export default GameStoresSection
