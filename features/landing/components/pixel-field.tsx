"use client"

import {
  DARK_PATH,
  ORANGE_PATH,
  WHITE_PATH,
} from "@/components/ui/pixel-gamepad-icon"
import { cn } from "@/lib/utils"
import { useEffect, useRef } from "react"

const COLS = 30
const ROWS = 15
const HOT = "#ff5a1f"

interface Particle {
  gx: number
  gy: number
  color: string
  isHot: boolean
  hx: number
  hy: number
  x: number
  y: number
  vx: number
  vy: number
  heat: number
  alpha: number
  delay: number
}

function seeded(gx: number, gy: number, salt: number) {
  const s = Math.sin(gx * 127.1 + gy * 311.7 + salt * 74.7) * 43758.5453
  return s - Math.floor(s)
}

function parse(path: string, color: string, isHot: boolean) {
  const out: Particle[] = []
  const re = /M(\d+) (\d+)h1v1h-1z/g
  let match = re.exec(path)
  while (match) {
    const gx = Number(match[1])
    const gy = Number(match[2])
    out.push({
      gx,
      gy,
      color,
      isHot,
      hx: 0,
      hy: 0,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      heat: 0,
      alpha: 0,
      delay: seeded(gx, gy, 3) * 0.9,
    })
    match = re.exec(path)
  }
  return out
}

export default function PixelField({ className }: { className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const particles = [
      ...parse(ORANGE_PATH, HOT, true),
      ...parse(WHITE_PATH, "#f2f2f2", false),
      ...parse(DARK_PATH, "#18181b", false),
    ]

    let width = 0
    let height = 0
    let cell = 0
    let dpr = 1
    let mouseX = -9999
    let mouseY = -9999
    let raf = 0
    let visible = true
    const start = performance.now()
    let last = start
    let placed = false

    const layout = () => {
      const rect = wrap.getBoundingClientRect()
      width = rect.width
      height = rect.height
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      cell = Math.min((width * 0.92) / COLS, (height * 0.92) / ROWS)
      const ox = (width - COLS * cell) / 2
      const oy = (height - ROWS * cell) / 2

      for (const p of particles) {
        p.hx = ox + p.gx * cell
        p.hy = oy + p.gy * cell
        if (!placed) {
          const angle = seeded(p.gx, p.gy, 1) * Math.PI * 2
          const dist = (0.35 + seeded(p.gx, p.gy, 2) * 0.65) * Math.max(width, height)
          p.x = width / 2 + Math.cos(angle) * dist
          p.y = height / 2 + Math.sin(angle) * dist
          if (reduced) {
            p.x = p.hx
            p.y = p.hy
            p.alpha = 1
          }
        }
      }
      placed = true
    }

    const draw = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, width, height)
      const size = cell * 0.9
      for (const p of particles) {
        if (p.alpha <= 0.01) continue
        ctx.globalAlpha = p.alpha
        ctx.fillStyle = p.color
        ctx.fillRect(p.x, p.y, size, size)
        if (!p.isHot && p.heat > 0.05) {
          ctx.globalAlpha = p.alpha * Math.min(1, p.heat)
          ctx.fillStyle = HOT
          ctx.fillRect(p.x, p.y, size, size)
        }
      }
      ctx.globalAlpha = 1
    }

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick)
      if (!visible) {
        last = now
        return
      }
      const dt = Math.min((now - last) / 16.667, 3)
      last = now
      const elapsed = (now - start) / 1000
      const radius = cell * 5
      const damp = Math.pow(0.84, dt)

      for (const p of particles) {
        if (elapsed < p.delay) continue
        p.alpha = Math.min(1, p.alpha + 0.05 * dt)
        p.vx += (p.hx - p.x) * 0.07 * dt
        p.vy += (p.hy - p.y) * 0.07 * dt

        const dx = p.x - mouseX
        const dy = p.y - mouseY
        const d2 = dx * dx + dy * dy
        if (d2 < radius * radius && d2 > 0.01) {
          const d = Math.sqrt(d2)
          const f = Math.pow(1 - d / radius, 2) * cell * 0.9
          p.vx += (dx / d) * f * dt
          p.vy += (dy / d) * f * dt
        }

        p.vx *= damp
        p.vy *= damp
        p.x += p.vx * dt
        p.y += p.vy * dt

        const speed = Math.hypot(p.vx, p.vy)
        p.heat = Math.max(Math.min(1, speed / (cell * 0.6)), p.heat * Math.pow(0.93, dt))
      }
      draw()
    }

    const onMove = (event: PointerEvent) => {
      const rect = wrap.getBoundingClientRect()
      mouseX = event.clientX - rect.left
      mouseY = event.clientY - rect.top
    }

    const onLeave = () => {
      mouseX = -9999
      mouseY = -9999
    }

    const onDown = (event: PointerEvent) => {
      const rect = wrap.getBoundingClientRect()
      const cx = event.clientX - rect.left
      const cy = event.clientY - rect.top
      const radius = cell * 8
      for (const p of particles) {
        const dx = p.x - cx
        const dy = p.y - cy
        const d = Math.hypot(dx, dy)
        if (d < radius) {
          const f = (1 - d / radius) * cell * 1.6
          const a = Math.atan2(dy, dx) + (seeded(p.gx, p.gy, 5) - 0.5) * 1.2
          p.vx += Math.cos(a) * f
          p.vy += Math.sin(a) * f
        }
      }
    }

    layout()
    if (reduced) {
      draw()
    } else {
      raf = requestAnimationFrame(tick)
    }

    const resizeObserver = new ResizeObserver(() => {
      layout()
      if (reduced) draw()
    })
    resizeObserver.observe(wrap)

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
      },
      { threshold: 0 }
    )
    io.observe(wrap)

    wrap.addEventListener("pointermove", onMove)
    wrap.addEventListener("pointerleave", onLeave)
    wrap.addEventListener("pointerdown", onDown)

    return () => {
      cancelAnimationFrame(raf)
      resizeObserver.disconnect()
      io.disconnect()
      wrap.removeEventListener("pointermove", onMove)
      wrap.removeEventListener("pointerleave", onLeave)
      wrap.removeEventListener("pointerdown", onDown)
    }
  }, [])

  return (
    <div
      ref={wrapRef}
      className={cn("relative", className)}
      role="img"
      aria-label="A pixel-art game controller made of small squares that scatter away from your cursor"
    >
      <canvas ref={canvasRef} className="absolute inset-0 block size-full" />
    </div>
  )
}
