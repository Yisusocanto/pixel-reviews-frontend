import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden="true"
      className={cn(
        "rounded-md bg-foreground/10 motion-safe:animate-pulse",
        className
      )}
      {...props}
    />
  )
}

function SkeletonGroup({
  className,
  label = "Loading",
  ...props
}: React.ComponentProps<"div"> & { label?: string }) {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label={label}
      className={className}
      {...props}
    />
  )
}

export { Skeleton, SkeletonGroup }
