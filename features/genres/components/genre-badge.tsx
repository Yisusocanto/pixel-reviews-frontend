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
      "border-orange-500/35 bg-orange-500/15 text-orange-700 dark:text-orange-300 hover:border-orange-500/60 hover:bg-orange-500/25",
  },
  adventure: {
    icon: Compass,
    badgeClass:
      "border-emerald-500/35 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 hover:border-emerald-500/60 hover:bg-emerald-500/25",
  },
  "role-playing-games-rpg": {
    icon: Sword,
    badgeClass:
      "border-purple-500/35 bg-purple-500/15 text-purple-700 dark:text-purple-300 hover:border-purple-500/60 hover:bg-purple-500/25",
  },
  rpg: {
    icon: Sword,
    badgeClass:
      "border-purple-500/35 bg-purple-500/15 text-purple-700 dark:text-purple-300 hover:border-purple-500/60 hover:bg-purple-500/25",
  },
  shooter: {
    icon: Crosshair,
    badgeClass:
      "border-red-500/35 bg-red-500/15 text-red-700 dark:text-red-300 hover:border-red-500/60 hover:bg-red-500/25",
  },
  strategy: {
    icon: Crown,
    badgeClass:
      "border-blue-500/35 bg-blue-500/15 text-blue-700 dark:text-blue-300 hover:border-blue-500/60 hover:bg-blue-500/25",
  },
  puzzle: {
    icon: Puzzle,
    badgeClass:
      "border-teal-500/35 bg-teal-500/15 text-teal-700 dark:text-teal-300 hover:border-teal-500/60 hover:bg-teal-500/25",
  },
  racing: {
    icon: Car,
    badgeClass:
      "border-amber-500/35 bg-amber-500/15 text-amber-700 dark:text-amber-300 hover:border-amber-500/60 hover:bg-amber-500/25",
  },
  sports: {
    icon: Trophy,
    badgeClass:
      "border-lime-500/35 bg-lime-500/15 text-lime-700 dark:text-lime-300 hover:border-lime-500/60 hover:bg-lime-500/25",
  },
  simulation: {
    icon: Bot,
    badgeClass:
      "border-cyan-500/35 bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 hover:border-cyan-500/60 hover:bg-cyan-500/25",
  },
  indie: {
    icon: Sparkles,
    badgeClass:
      "border-pink-500/35 bg-pink-500/15 text-pink-700 dark:text-pink-300 hover:border-pink-500/60 hover:bg-pink-500/25",
  },
  fighting: {
    icon: Zap,
    badgeClass:
      "border-rose-500/35 bg-rose-500/15 text-rose-700 dark:text-rose-300 hover:border-rose-500/60 hover:bg-rose-500/25",
  },
  arcade: {
    icon: Gamepad2,
    badgeClass:
      "border-fuchsia-500/35 bg-fuchsia-500/15 text-fuchsia-700 dark:text-fuchsia-300 hover:border-fuchsia-500/60 hover:bg-fuchsia-500/25",
  },
  platformer: {
    icon: Flag,
    badgeClass:
      "border-yellow-500/35 bg-yellow-500/15 text-yellow-700 dark:text-yellow-300 hover:border-yellow-500/60 hover:bg-yellow-500/25",
  },
  family: {
    icon: HeartHandshake,
    badgeClass:
      "border-emerald-500/35 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 hover:border-emerald-500/60 hover:bg-emerald-500/25",
  },
  casual: {
    icon: Layers,
    badgeClass:
      "border-sky-500/35 bg-sky-500/15 text-sky-700 dark:text-sky-300 hover:border-sky-500/60 hover:bg-sky-500/25",
  },
  horror: {
    icon: ShieldAlert,
    badgeClass:
      "border-red-600/35 bg-red-600/15 text-red-700 dark:text-red-300 hover:border-red-600/60 hover:bg-red-600/25",
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
      "border-primary/35 bg-primary/15 text-primary hover:border-primary/60 hover:bg-primary/25",
  }
}
