import { searchGamesAction } from "@/features/games/actions"
import SearchSection from "@/features/games/components/search-section"
import { GameSearchPagination } from "@/features/games/types"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Explore & Search Video Games by Rating",
  description:
    "Browse popular, trending, and top-rated video games across PC, PlayStation, Xbox, and Nintendo Switch. Read honest player reviews before you buy.",
  alternates: {
    canonical: "/search",
  },
  openGraph: {
    title: "Explore & Search Video Games by Rating | Pixel Reviews",
    description:
      "Browse popular, trending, and top-rated video games across PC, PlayStation, Xbox, and Nintendo Switch. Read honest player reviews before you buy.",
    url: "/search",
  },
}

export default async function SearchPage() {
  let initialPopularGames: GameSearchPagination | undefined = undefined

  try {
    initialPopularGames = await searchGamesAction("", 1, 20)
  } catch {
    initialPopularGames = undefined
  }

  return <SearchSection initialPopularGames={initialPopularGames} />
}
