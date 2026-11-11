import type { Metadata } from "next"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { Database, ExternalLink, FileText, Mail } from "lucide-react"

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms of Service, community rules, and third-party data attributions for Pixel Reviews.",
}

const LAST_UPDATED = "November 11, 2026"
const CONTACT_EMAIL = "yisusocanto1984@gmail.com"

export default function TermsOfServicePage() {
  return (
    <div className="mx-auto w-full max-w-4xl p-4 sm:p-6 lg:p-10">
      <header className="flex flex-col gap-3 border-b border-b-secondary py-6 sm:py-8">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="inline-flex items-center gap-2 font-mono text-xs font-semibold tracking-widest text-primary uppercase">
            <FileText className="size-3.5" />
            Legal & Community Rules
          </span>
          <span className="font-mono text-xs tracking-wider text-muted-foreground uppercase">
            Last updated: {LAST_UPDATED}
          </span>
        </div>
        <h1 className="font-heading text-4xl font-extrabold tracking-tight sm:text-5xl">
          Terms of Service
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Welcome to Pixel Reviews. By accessing our website, creating an
          account, or posting reviews and comments, you agree to be bound by
          these Terms of Service and our Privacy Policy.
        </p>
        <div className="pt-2">
          <Link
            href="/privacy"
            className="font-mono text-xs font-semibold tracking-wider text-primary uppercase hover:underline"
          >
            Read Privacy Policy →
          </Link>
        </div>
      </header>

      <Separator />

      <div className="mt-8 flex flex-col gap-8 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <section className="rounded-xl border border-border bg-card p-5 sm:p-7">
          <span className="font-mono text-xs font-semibold tracking-widest text-primary uppercase">
            01 / Accounts & Eligibility
          </span>
          <h2 className="mt-2 font-heading text-xl font-bold sm:text-2xl">
            Your Pixel Reviews Account
          </h2>
          <ul className="mt-4 flex list-disc flex-col gap-2.5 pl-5 text-foreground/90">
            <li>
              You must be at least 13 years old (or the minimum age required in
              your jurisdiction) to create an account on Pixel Reviews.
            </li>
            <li>
              You are responsible for safeguarding your account credentials and
              for all activity that occurs under your username.
            </li>
            <li>
              Usernames and profile information must not impersonate other
              individuals, studios, or organizations, or contain offensive or
              unlawful material.
            </li>
          </ul>
        </section>

        <section className="rounded-xl border border-border bg-card p-5 sm:p-7">
          <span className="font-mono text-xs font-semibold tracking-widest text-primary uppercase">
            02 / User-Generated Content
          </span>
          <h2 className="mt-2 font-heading text-xl font-bold sm:text-2xl">
            Reviews, Ratings, and Community Conduct
          </h2>
          <p className="mt-3 text-muted-foreground">
            Pixel Reviews is built for honest, unfiltered video game opinions.
            When posting reviews, ratings, or comments:
          </p>
          <ul className="mt-4 flex list-disc flex-col gap-2.5 pl-5 text-foreground/90">
            <li>
              <strong className="font-semibold text-foreground">
                Ownership & License:
              </strong>{" "}
              You retain ownership of the reviews, comments, and profile content
              you write. By posting content on Pixel Reviews, you grant us a
              worldwide, non-exclusive, royalty-free license to host, display,
              and distribute that content on the Platform.
            </li>
            <li>
              <strong className="font-semibold text-foreground">
                Prohibited Conduct:
              </strong>{" "}
              You agree not to post hate speech, harassment, doxxing, unlawful
              threats, malicious links, automated spam, or content that
              infringes intellectual property rights.
            </li>
            <li>
              <strong className="font-semibold text-foreground">
                Moderation:
              </strong>{" "}
              We reserve the right to remove content or suspend accounts that
              violate these Terms or attempt to manipulate ratings and platform
              integrity.
            </li>
          </ul>
        </section>

        <section className="rounded-xl border border-primary/30 bg-card p-5 sm:p-7">
          <span className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold tracking-widest text-primary uppercase">
            <Database className="size-3.5" />
            03 / Third-Party Data & Attribution
          </span>
          <h2 className="mt-2 font-heading text-xl font-bold sm:text-2xl">
            Video Game Data Provided by IGDB
          </h2>
          <p className="mt-3 text-muted-foreground">
            Game titles, descriptions, storylines, cover artwork, screenshots,
            release dates, developer/publisher credits, platform listings, and
            aggregated critic scores displayed on Pixel Reviews are freely
            provided by the{" "}
            <a
              href="https://www.igdb.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-primary underline"
            >
              IGDB.com (Internet Game Database)
              <ExternalLink className="size-3" />
            </a>{" "}
            API.
          </p>
          <div className="mt-4 rounded-lg border border-border bg-secondary/50 p-4 text-xs leading-relaxed text-muted-foreground sm:text-sm">
            All video game titles, artwork, trademarks, and intellectual
            property belong to their respective developers and publishers. Pixel
            Reviews is an independent community project and is not endorsed by,
            certified by, or officially affiliated with IGDB or Twitch
            Interactive, Inc.
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-5 sm:p-7">
          <span className="font-mono text-xs font-semibold tracking-widest text-primary uppercase">
            04 / Account Deletion & Termination
          </span>
          <h2 className="mt-2 font-heading text-xl font-bold sm:text-2xl">
            Deleting Your Account and Reviews
          </h2>
          <p className="mt-3 text-muted-foreground">
            You may stop using Pixel Reviews at any time. When you delete your
            account (via your account settings or by requesting deletion via
            email), your profile, written reviews, star ratings, comments,
            likes, favorite games, and wishlist entries are permanently removed
            from the Platform.
          </p>
        </section>

        <section className="rounded-xl border border-border bg-card p-5 sm:p-7">
          <span className="font-mono text-xs font-semibold tracking-widest text-primary uppercase">
            05 / Disclaimers & Liability
          </span>
          <h2 className="mt-2 font-heading text-xl font-bold sm:text-2xl">
            Service Provided &ldquo;As Is&rdquo;
          </h2>
          <p className="mt-3 text-muted-foreground">
            Pixel Reviews is provided on an &ldquo;as is&rdquo; and &ldquo;as
            available&rdquo; basis without warranties of any kind, whether
            express or implied. Opinions expressed in user reviews and comments
            belong solely to their respective authors and do not reflect the
            views of Pixel Reviews. To the maximum extent permitted by law,
            Pixel Reviews shall not be liable for any indirect, incidental, or
            consequential damages arising from your use of the Platform.
          </p>
        </section>

        <section className="rounded-xl border border-border bg-card p-5 sm:p-7">
          <span className="font-mono text-xs font-semibold tracking-widest text-primary uppercase">
            06 / Contact
          </span>
          <h2 className="mt-2 font-heading text-xl font-bold sm:text-2xl">
            Get in Touch
          </h2>
          <p className="mt-3 text-muted-foreground">
            For questions regarding these Terms of Service, copyright or
            attribution inquiries, or account support, contact us at:
          </p>
          <div className="mt-4">
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-secondary px-4 py-2.5 font-mono text-xs font-semibold text-foreground transition-colors hover:border-primary hover:text-primary sm:text-sm"
            >
              <Mail className="size-4 text-primary" />
              {CONTACT_EMAIL}
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
