import { cn } from "@/lib/utils"

const PALETTE = ["#ff5a1f", "#f5f5f5", "#ffb199", "#8a8a8a"]

function hash(input: string) {
  let h = 2166136261
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

export default function PixelAvatar({
  seed,
  className,
}: {
  seed: string
  className?: string
}) {
  const h = hash(seed)
  const color = PALETTE[h % PALETTE.length]
  const cells: { x: number; y: number }[] = []

  for (let y = 0; y < 5; y++) {
    for (let x = 0; x < 3; x++) {
      const bit = (h >>> (y * 3 + x)) & 1
      if (bit) {
        cells.push({ x, y })
        if (x < 2) cells.push({ x: 4 - x, y })
      }
    }
  }

  return (
    <svg
      viewBox="0 0 5 5"
      shapeRendering="crispEdges"
      className={cn("size-9 shrink-0 bg-secondary", className)}
      aria-hidden
    >
      {cells.map((cell) => (
        <rect
          key={`${cell.x}-${cell.y}`}
          x={cell.x}
          y={cell.y}
          width={1}
          height={1}
          fill={color}
        />
      ))}
    </svg>
  )
}
