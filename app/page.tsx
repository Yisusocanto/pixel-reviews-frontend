import FinalCta from "@/features/landing/components/final-cta"
import Features from "@/features/landing/components/features"
import Hero from "@/features/landing/components/hero"
import LandingShell from "@/features/landing/components/landing-shell"
import VerdictTape from "@/features/landing/components/verdict-tape"

const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://www.pixelreviews.app"

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Pixel Reviews",
  alternateName: "PixelReviews",
  url: SITE_URL,
  description:
    "Rate the games you finish, read unfiltered player reviews, track your gaming wishlist, and see real community rating distributions on Pixel Reviews.",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
}

export default function LandingPage() {
  return (
    <LandingShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <main>
        <Hero />
        <VerdictTape />
        <Features />
        <FinalCta />
      </main>
    </LandingShell>
  )
}
