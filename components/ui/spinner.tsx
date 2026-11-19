import { cn } from "cn"

function Spinner({ className, ...props }: React.ComponentProps<"progress">) {
  return (
    <progress
      data-slot="spinner"
      aria-label="Loading"
      className={cn("loading-spinner size-4", className)}
      {...props}
    />
  )
}

export { Spinner }
