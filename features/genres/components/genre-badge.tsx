import { ComponentType } from "react"
import {
  Flame,
  Compass,
  Crosshair,
  ShieldAlert,
  Puzzle,
  Trophy,
  Flag,
  Car,
  Sparkles,
  Gamepad2,
  Sword,
  Bot,
  Layers,
  HeartHandshake,
  Crown,
  Zap,
} from "lucide-react"

interface GenreTheme {
  icon: ComponentType<{ className?: string }>
  badgeClass: string
}

const GENRE_MAP: Record<string, GenreTheme> = {
  action: {
    icon: Flame,
    badgeClass:
      "border-orange-500/30 bg-orange-500/10 text-orange-400 hover:border-orange-500/60 hover:bg-orange-500/20",
  },
  adventure: {
    icon: Compass,
    badgeClass:
      "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:border-emerald-500/60 hover:bg-emerald-500/20",
  },
  "role-playing-games-rpg": {
    icon: Sword,
    badgeClass:
      "border-purple-500/30 bg-purple-500/10 text-purple-400 hover:border-purple-500/60 hover:bg-purple-500/20",
  },
  rpg: {
    icon: Sword,
    badgeClass:
      "border-purple-500/30 bg-purple-500/10 text-purple-400 hover:border-purple-500/60 hover:bg-purple-500/20",
  },
  shooter: {
    icon: Crosshair,
    badgeClass:
      "border-red-500/30 bg-red-500/10 text-red-400 hover:border-red-500/60 hover:bg-red-500/20",
  },
  strategy: {
    icon: Crown,
    badgeClass:
      "border-blue-500/30 bg-blue-500/10 text-blue-400 hover:border-blue-500/60 hover:bg-blue-500/20",
  },
  puzzle: {
    icon: Puzzle,
    badgeClass:
      "border-teal-500/30 bg-teal-500/10 text-teal-400 hover:border-teal-500/60 hover:bg-teal-500/20",
  },
  racing: {
    icon: Car,
    badgeClass:
      "border-amber-500/30 bg-amber-500/10 text-amber-400 hover:border-amber-500/60 hover:bg-amber-500/20",
  },
  sports: {
    icon: Trophy,
    badgeClass:
      "border-lime-500/30 bg-lime-500/10 text-lime-400 hover:border-lime-500/60 hover:bg-lime-500/20",
  },
  simulation: {
    icon: Bot,
    badgeClass:
      "border-cyan-500/30 bg-cyan-500/10 text-cyan-400 hover:border-cyan-500/60 hover:bg-cyan-500/20",
  },
  indie: {
    icon: Sparkles,
    badgeClass:
      "border-pink-500/30 bg-pink-500/10 text-pink-400 hover:border-pink-500/60 hover:bg-pink-500/20",
  },
  fighting: {
    icon: Zap,
    badgeClass:
      "border-rose-500/30 bg-rose-500/10 text-rose-400 hover:border-rose-500/60 hover:bg-rose-500/20",
  },
  arcade: {
    icon: Gamepad2,
    badgeClass:
      "border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-400 hover:border-fuchsia-500/60 hover:bg-fuchsia-500/20",
  },
  platformer: {
    icon: Flag,
    badgeClass:
      "border-yellow-500/30 bg-yellow-500/10 text-yellow-400 hover:border-yellow-500/60 hover:bg-yellow-500/20",
  },
  family: {
    icon: HeartHandshake,
    badgeClass:
      "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:border-emerald-500/60 hover:bg-emerald-500/20",
  },
  casual: {
    icon: Layers,
    badgeClass:
      "border-sky-500/30 bg-sky-500/10 text-sky-400 hover:border-sky-500/60 hover:bg-sky-500/20",
  },
  horror: {
    icon: ShieldAlert,
    badgeClass:
      "border-red-600/30 bg-red-600/10 text-red-400 hover:border-red-600/60 hover:bg-red-600/20",
  },
}

export function getGenreTheme(slug?: string, name?: string): GenreTheme {
  const s = (slug || "").toLowerCase()
  const n = (name || "").toLowerCase()

  for (const [key, theme] of Object.entries(GENRE_MAP)) {
    if (s.includes(key) || n.includes(key)) {
      return theme
    }
  }

  return {
    icon: Gamepad2,
    badgeClass:
      "border-primary/30 bg-primary/10 text-primary hover:border-primary/60 hover:bg-primary/20",
  }
}
