import { searchGamesAction } from "@/features/games/actions"
import SearchSection from "@/features/games/components/search-section"
import { GameSearchPagination } from "@/features/games/types"
import {
  buildLanguageAlternates,
  getDictionary,
} from "@/lib/i18n/dictionaries"
import { getServerLocale } from "@/lib/i18n/server"
import type { Metadata } from "next"

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; title?: string }>
}): Promise<Metadata> {
  const { q, title } = await searchParams
  const query = (q ?? title ?? "").trim()
  const locale = await getServerLocale()
  const dict = getDictionary(locale)
  const alternates = buildLanguageAlternates("/search", locale)

  const pageTitle = query
    ? locale === "es"
      ? `Resultados para "${query}" — Videojuegos y Jugadores`
      : `Results for "${query}" — Games & Players`
    : dict.meta.searchTitle

  return {
    title: pageTitle,
    description: dict.meta.searchDescription,
    alternates,
    openGraph: {
      type: "website",
      siteName: "Pixel Reviews",
      locale: locale === "es" ? "es_ES" : "en_US",
      title: `${pageTitle} | Pixel Reviews`,
      description: dict.meta.searchDescription,
      url: alternates.canonical,
    },
    twitter: {
      card: "summary_large_image",
      title: `${pageTitle} | Pixel Reviews`,
      description: dict.meta.searchDescription,
    },
  }
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; title?: string }>
}) {
  const { q, title } = await searchParams
  const initialQuery = (q ?? title ?? "").trim()
  let initialPopularGames: GameSearchPagination | undefined = undefined

  try {
    initialPopularGames = await searchGamesAction(initialQuery, 1, 20)
  } catch {
    initialPopularGames = undefined
  }

  return <SearchSection initialPopularGames={initialPopularGames} />
}
