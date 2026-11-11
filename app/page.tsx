import FinalCta from "@/features/landing/components/final-cta"
import Features from "@/features/landing/components/features"
import Hero from "@/features/landing/components/hero"
import LandingShell from "@/features/landing/components/landing-shell"
import VerdictTape from "@/features/landing/components/verdict-tape"

export default function LandingPage() {
  return (
    <LandingShell>
      <main>
        <Hero />
        <VerdictTape />
        <Features />
        <FinalCta />
      </main>
    </LandingShell>
  )
}
