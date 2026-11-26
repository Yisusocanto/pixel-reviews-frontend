import { ProfileShareCardTemplate } from "@/components/share/og-card-primitives"
import { Game } from "@/features/games/types"
import {
  getUserAction,
  getUserFavGamesAction,
  getUserStatsAction,
} from "@/features/users/actions"
import { User, UserStats } from "@/features/users/types"
import {
  getShareCardDimensions,
  ShareCardFormat,
} from "@/lib/og-image-utils"
import { ImageResponse } from "next/og"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params
  const rawFormat = request.nextUrl.searchParams.get("format")
  const format: ShareCardFormat = rawFormat === "post" ? "post" : "story"
  const dimensions = getShareCardDimensions(format)

  let user: User | null = null
  let userStats: UserStats | undefined = undefined
  let favGames: Game[] = []

  try {
    const [fetchedUser, fetchedStats, fetchedFavs] = await Promise.all([
      getUserAction(username),
      getUserStatsAction(username).catch(() => undefined),
      getUserFavGamesAction(username).catch(() => []),
    ])
    user = fetchedUser ?? null
    userStats = fetchedStats
    favGames = fetchedFavs ?? []
  } catch {
    return NextResponse.json({ detail: "Player not found" }, { status: 404 })
  }

  if (!user) {
    return NextResponse.json({ detail: "Player not found" }, { status: 404 })
  }

  return new ImageResponse(
    <ProfileShareCardTemplate
      user={user}
      userStats={userStats}
      favGames={favGames}
      format={format}
    />,
    {
      ...dimensions,
      headers: {
        "Cache-Control": "public, max-age=300, s-maxage=1800",
      },
    }
  )
}
