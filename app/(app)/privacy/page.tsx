import type { Metadata } from "next"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { ExternalLink, Mail, ShieldCheck } from "lucide-react"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Pixel Reviews collects, uses, stores, and protects your personal data and Google account information.",
}

const LAST_UPDATED = "November 11, 2026"
const CONTACT_EMAIL = "yisusocanto1984@gmail.com"

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto w-full max-w-4xl p-4 sm:p-6 lg:p-10">
      <header className="flex flex-col gap-3 border-b border-b-secondary py-6 sm:py-8">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="inline-flex items-center gap-2 font-mono text-xs font-semibold tracking-widest text-primary uppercase">
            <ShieldCheck className="size-3.5" />
            Legal & Privacy
          </span>
          <span className="font-mono text-xs tracking-wider text-muted-foreground uppercase">
            Last updated: {LAST_UPDATED}
          </span>
        </div>
        <h1 className="font-heading text-4xl font-extrabold tracking-tight sm:text-5xl">
          Privacy Policy
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Pixel Reviews (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;the
          Platform&rdquo;) is a community video game review platform. This
          Privacy Policy explains what information we collect, how we use and
          protect it, and how you can manage or delete your account and data.
        </p>
        <div className="pt-2">
          <Link
            href="/terms"
            className="font-mono text-xs font-semibold tracking-wider text-primary uppercase hover:underline"
          >
            Read Terms of Service →
          </Link>
        </div>
      </header>

      <Separator />

      <div className="mt-8 flex flex-col gap-8 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <section className="rounded-xl border border-border bg-card p-5 sm:p-7">
          <span className="font-mono text-xs font-semibold tracking-widest text-primary uppercase">
            01 / Overview
          </span>
          <h2 className="mt-2 font-heading text-xl font-bold sm:text-2xl">
            Information We Collect
          </h2>
          <p className="mt-3 text-muted-foreground">
            We collect only the information needed to operate your profile,
            publish your game reviews, and maintain account security:
          </p>
          <ul className="mt-4 flex list-disc flex-col gap-2.5 pl-5 text-foreground/90">
            <li>
              <strong className="font-semibold text-foreground">
                Account & Profile Information:
              </strong>{" "}
              When you register with email and password or via Google Sign-In,
              we collect your email address, username, optional biography, and
              profile picture URL. Passwords for credentials-based accounts are
              cryptographically hashed before storage.
            </li>
            <li>
              <strong className="font-semibold text-foreground">
                User-Generated Content:
              </strong>{" "}
              Reviews, star ratings, comments, likes, favorite games, and
              wishlists you create on Pixel Reviews. Because Pixel Reviews is a
              public social platform, your profile, reviews, ratings, and
              comments are publicly visible.
            </li>
            <li>
              <strong className="font-semibold text-foreground">
                Authentication & Session Data:
              </strong>{" "}
              Encrypted JSON Web Tokens (JWT) and session cookies required to
              keep you signed in securely.
            </li>
            <li>
              <strong className="font-semibold text-foreground">
                Performance & Diagnostic Metrics:
              </strong>{" "}
              Aggregated, anonymized page-load and web-vitals metrics collected
              via Vercel Analytics and Vercel Speed Insights to keep the site
              fast and reliable.
            </li>
          </ul>
        </section>

        <section className="rounded-xl border border-primary/30 bg-card p-5 sm:p-7">
          <span className="font-mono text-xs font-semibold tracking-widest text-primary uppercase">
            02 / Google OAuth Disclosure
          </span>
          <h2 className="mt-2 font-heading text-xl font-bold sm:text-2xl">
            How We Access, Use, Store, and Share Google User Data
          </h2>
          <p className="mt-3 text-muted-foreground">
            If you choose to sign in or create an account using{" "}
            <strong className="text-foreground">Google Sign-In</strong>, Pixel
            Reviews requests access only to basic OpenID Connect profile scopes
            (<code className="font-mono text-xs text-primary">openid</code>,{" "}
            <code className="font-mono text-xs text-primary">email</code>, and{" "}
            <code className="font-mono text-xs text-primary">profile</code>).
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-border bg-secondary/50 p-4">
              <h3 className="font-mono text-xs font-bold tracking-wider text-primary uppercase">
                Data Accessed
              </h3>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Your Google account email address, display name, unique Google
                identifier, and profile picture URL provided in the Google ID
                token.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-secondary/50 p-4">
              <h3 className="font-mono text-xs font-bold tracking-wider text-primary uppercase">
                How Data Is Used
              </h3>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Solely to authenticate your identity, create or link your Pixel
                Reviews account, and populate your initial username and avatar.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-secondary/50 p-4">
              <h3 className="font-mono text-xs font-bold tracking-wider text-primary uppercase">
                How Data Is Stored
              </h3>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Your email, username, and profile photo URL are stored in our
                secured database over encrypted connections (HTTPS/TLS). We do
                not store access to your Google Drive, Gmail, Contacts, or any
                other Google service.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-secondary/50 p-4">
              <h3 className="font-mono text-xs font-bold tracking-wider text-primary uppercase">
                Sharing & Limited Use
              </h3>
              <p className="mt-1.5 text-sm text-muted-foreground">
                We never sell, rent, or transfer Google user data to third
                parties, ad networks, or data brokers, nor do we use Google user
                data for advertising or AI model training.
              </p>
            </div>
          </div>
          <p className="mt-4 text-xs text-muted-foreground sm:text-sm">
            Pixel Reviews&apos; use and transfer to any other app of information
            received from Google APIs will adhere to the{" "}
            <a
              href="https://developers.google.com/terms/api-services-user-data-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-primary underline"
            >
              Google API Services User Data Policy
              <ExternalLink className="size-3" />
            </a>
            , including the Limited Use requirements.
          </p>
        </section>

        <section className="rounded-xl border border-border bg-card p-5 sm:p-7">
          <span className="font-mono text-xs font-semibold tracking-widest text-primary uppercase">
            03 / Purpose of Processing
          </span>
          <h2 className="mt-2 font-heading text-xl font-bold sm:text-2xl">
            How We Use Your Information
          </h2>
          <ul className="mt-4 flex list-disc flex-col gap-2 pl-5 text-foreground/90">
            <li>
              To create, maintain, and authenticate your Pixel Reviews account.
            </li>
            <li>
              To display your public profile, game ratings, written reviews,
              comments, favorite games, and wishlists to the community.
            </li>
            <li>
              To send essential transactional emails, such as password-reset
              links when you request them.
            </li>
            <li>
              To protect the platform against abuse, spam, unauthorized access,
              and violations of our Terms of Service.
            </li>
          </ul>
        </section>

        <section className="rounded-xl border border-border bg-card p-5 sm:p-7">
          <span className="font-mono text-xs font-semibold tracking-widest text-primary uppercase">
            04 / Third-Party Services
          </span>
          <h2 className="mt-2 font-heading text-xl font-bold sm:text-2xl">
            External Providers & Game Metadata
          </h2>
          <p className="mt-3 text-muted-foreground">
            Pixel Reviews integrates with trusted third-party services to
            deliver core functionality:
          </p>
          <ul className="mt-4 flex list-disc flex-col gap-2.5 pl-5 text-foreground/90">
            <li>
              <strong className="font-semibold text-foreground">
                IGDB (Internet Game Database):
              </strong>{" "}
              Video game metadata, cover art, screenshots, release dates, and
              aggregated critic scores are provided by{" "}
              <a
                href="https://www.igdb.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary underline"
              >
                IGDB.com
                <ExternalLink className="size-3" />
              </a>{" "}
              (operated by Twitch Interactive, Inc.). Searching or viewing games
              does not share your personal account data with IGDB.
            </li>
            <li>
              <strong className="font-semibold text-foreground">
                Google Identity Services:
              </strong>{" "}
              Used for optional OAuth 2.0 authentication when you click
              &ldquo;Sign in with Google&rdquo;.
            </li>
            <li>
              <strong className="font-semibold text-foreground">
                YouTube Embeds:
              </strong>{" "}
              Game pages may embed official game trailers hosted on YouTube.
            </li>
            <li>
              <strong className="font-semibold text-foreground">
                Vercel Analytics & Speed Insights:
              </strong>{" "}
              Used for anonymous, cookie-free performance and traffic
              measurement.
            </li>
          </ul>
        </section>

        <section className="rounded-xl border border-border bg-card p-5 sm:p-7">
          <span className="font-mono text-xs font-semibold tracking-widest text-primary uppercase">
            05 / Retention & Account Deletion
          </span>
          <h2 className="mt-2 font-heading text-xl font-bold sm:text-2xl">
            Managing and Deleting Your Data
          </h2>
          <p className="mt-3 text-muted-foreground">
            We retain your account information and reviews for as long as your
            account remains active. You have full control over your content and
            personal data:
          </p>
          <ul className="mt-4 flex list-disc flex-col gap-2.5 pl-5 text-foreground/90">
            <li>
              <strong className="font-semibold text-foreground">
                Editing & Removing Content:
              </strong>{" "}
              You can update your username, bio, profile picture, reviews,
              comments, and wishlist items at any time directly from the
              platform.
            </li>
            <li>
              <strong className="font-semibold text-foreground">
                Full Account Deletion:
              </strong>{" "}
              You may delete your account and permanently erase all associated
              personal data, reviews, ratings, comments, likes, and wishlists
              from your account settings (or by contacting us directly at{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-primary underline"
              >
                {CONTACT_EMAIL}
              </a>
              ). Account deletion requests are processed permanently and cannot
              be undone.
            </li>
            <li>
              <strong className="font-semibold text-foreground">
                Revoking Google Access:
              </strong>{" "}
              If you signed in with Google, you can also revoke Pixel
              Reviews&apos; access at any time from your{" "}
              <a
                href="https://myaccount.google.com/permissions"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary underline"
              >
                Google Account Permissions
                <ExternalLink className="size-3" />
              </a>{" "}
              page.
            </li>
          </ul>
        </section>

        <section className="rounded-xl border border-border bg-card p-5 sm:p-7">
          <span className="font-mono text-xs font-semibold tracking-widest text-primary uppercase">
            06 / Contact
          </span>
          <h2 className="mt-2 font-heading text-xl font-bold sm:text-2xl">
            Questions or Data Requests
          </h2>
          <p className="mt-3 text-muted-foreground">
            If you have questions about this Privacy Policy, how your Google
            user data is handled, or if you wish to request account and data
            deletion, reach out directly:
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
