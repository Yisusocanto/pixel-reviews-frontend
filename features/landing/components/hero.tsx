"use client"

import LanguageSwitcher from "@/components/i18n/language-switcher"
import { useLocale } from "@/components/providers/locale-provider"
import { PixelGamepadIcon } from "@/components/ui/pixel-gamepad-icon"
import { buildLocalizedPath } from "@/lib/i18n/dictionaries"
import { motion, type Variants } from "framer-motion"
import Link from "next/link"
import { useLanding } from "./landing-shell"
import PixelButton from "./pixel-button"
import PixelField from "./pixel-field"

const line: Variants = {
  hidden: { y: "105%" },
  show: (i: number) => ({
    y: 0,
    transition: {
      duration: 0.8,
      delay: 0.15 + i * 0.12,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
}

export default function Hero() {
  const { openAuth } = useLanding()
  const { locale, dict } = useLocale()
  const isEs = locale === "es"

  return (
    <section className="relative isolate flex min-h-svh flex-col overflow-hidden">
      <div className="landing-grid pointer-events-none absolute inset-0 -z-10" />
      <div className="pointer-events-none absolute top-1/2 right-[-10%] -z-10 size-[60vw] -translate-y-1/2 rounded-full bg-primary/15 blur-[120px]" />

      <header className="flex items-center justify-between px-5 py-5 sm:px-8">
        <Link
          href={buildLocalizedPath("/", locale)}
          className="flex items-center gap-3"
        >
          <PixelGamepadIcon className="h-5 w-10 text-primary" />
          <span className="text-lg font-black tracking-tight">
            <span className="text-primary">Pixel</span> Reviews
          </span>
        </Link>
        <nav className="flex items-center gap-1.5 sm:gap-2.5">
          <Link
            href={buildLocalizedPath("/feed", locale)}
            className="hidden px-3 py-2 font-mono text-xs tracking-wider text-muted-foreground uppercase transition-colors hover:text-foreground sm:block"
          >
            {dict.nav.feed}
          </Link>
          <Link
            href={buildLocalizedPath("/search", locale)}
            className="hidden px-3 py-2 font-mono text-xs tracking-wider text-muted-foreground uppercase transition-colors hover:text-foreground sm:block"
          >
            {isEs ? "Buscar juego" : "Find a game"}
          </Link>
          <LanguageSwitcher />
          <button
            type="button"
            onClick={() => openAuth("sign-in")}
            className="px-3 py-2 font-mono text-xs tracking-wider uppercase transition-colors hover:text-primary"
          >
            {dict.nav.signIn}
          </button>
        </nav>
      </header>

      <div className="mx-auto grid w-full max-w-7xl flex-1 items-center gap-6 px-5 pb-10 sm:px-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-4">
        <div className="relative z-10 py-6">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="mb-6 inline-block font-mono text-xs font-semibold tracking-[0.25em] text-primary uppercase"
          >
            {dict.nav.tagline}
          </motion.span>

          <h1 className="font-heading text-[clamp(3rem,6.4vw,6.5rem)] leading-[0.95] font-black tracking-tight">
            <span className="block overflow-hidden pb-[0.08em]">
              <motion.span
                className="block"
                variants={line}
                custom={0}
                initial="hidden"
                animate="show"
              >
                {isEs ? "Tu círculo." : "Your circle."}
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-[0.08em]">
              <motion.span
                className="block text-primary"
                variants={line}
                custom={1}
                initial="hidden"
                animate="show"
              >
                {isEs ? "Sin filtros" : "No filters"}
                <span className="ml-[0.04em] inline-block size-[0.14em] bg-foreground align-baseline" />
              </motion.span>
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.7 }}
            className="mt-8 max-w-md text-lg leading-relaxed text-muted-foreground"
          >
            {isEs
              ? "Califica los juegos que terminas. Di lo que realmente pensaste. Lee a quienes sí llegaron a los créditos, no a un crítico en viaje de prensa."
              : "Rate the games you finish. Say what you really thought. Read the players who actually sat through the credits, not a critic on a press trip."}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.7 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <PixelButton onClick={() => openAuth("sign-up")}>
              {dict.nav.createAccount}
            </PixelButton>
            <PixelButton
              href={buildLocalizedPath("/feed", locale)}
              variant="outline"
            >
              {isEs ? "Ver la comunidad" : "Read the feed"}
            </PixelButton>
          </motion.div>
        </div>

        <div className="relative">
          <PixelField className="aspect-2/1 w-full cursor-crosshair touch-pan-y select-none lg:aspect-auto lg:h-[min(60vh,560px)]" />
          <span className="pointer-events-none absolute right-0 bottom-0 font-mono text-[11px] tracking-widest text-muted-foreground uppercase">
            Poke it. Click to blow it apart.
          </span>
        </div>
      </div>
    </section>
  )
}
