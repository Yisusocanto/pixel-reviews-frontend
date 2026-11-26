import { auth } from "@/auth"
import { NextRequest, NextResponse } from "next/server"

const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://www.pixelreviews.app"

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ detail: "Forbidden" }, { status: 403 })
  }

  const indexNowKey = process.env.INDEXNOW_KEY
  if (!indexNowKey) {
    return NextResponse.json(
      { detail: "INDEXNOW_KEY is not configured" },
      { status: 503 }
    )
  }

  let body: { urls?: string[] } | null = null
  try {
    body = (await request.json()) as { urls?: string[] }
  } catch {
    return NextResponse.json({ detail: "Invalid JSON" }, { status: 400 })
  }

  const urls = (body?.urls ?? []).filter((u) => u.startsWith(SITE_URL))
  if (urls.length === 0) {
    return NextResponse.json(
      { detail: "Provide at least one canonical site URL" },
      { status: 400 }
    )
  }

  const host = new URL(SITE_URL).host
  const upstream = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host,
      key: indexNowKey,
      keyLocation: `${SITE_URL}/${indexNowKey}.txt`,
      urlList: urls,
    }),
  })

  return NextResponse.json({
    submitted: urls.length,
    indexNowStatus: upstream.status,
  })
}
