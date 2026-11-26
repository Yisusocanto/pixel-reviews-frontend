import OpenGraphImage from "@/app/opengraph-image"
import { GameOgTemplate } from "@/components/share/og-card-primitives"
import { getGameAction, getGameStatsAction } from "@/features/games/actions"
import { Game, GameStats } from "@/features/games/types"
import { ImageResponse } from "next/og"

export const alt = "Game Reviews & Community Ratings on Pixel Reviews"
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = "image/png"

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  let game: Game | null = null
  let gameStats: GameStats | null = null

  try {
    ;[game, gameStats] = await Promise.all([
      getGameAction(slug),
      getGameStatsAction(slug),
    ])
  } catch {
    return OpenGraphImage()
  }

  if (!game || !gameStats) {
    return OpenGraphImage()
  }

  return new ImageResponse(
    <GameOgTemplate game={game} gameStats={gameStats} />,
    size
  )
}
