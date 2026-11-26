import {
  DARK_PATH,
  ORANGE_PATH,
  WHITE_PATH,
} from "@/components/ui/pixel-gamepad-icon"
import { Game, GameStats } from "@/features/games/types"
import { Review } from "@/features/reviews/types"
import { User, UserStats } from "@/features/users/types"
import {
  getOgSafeImageUrl,
  ShareCardFormat,
  truncateText,
} from "@/lib/og-image-utils"
import dayjs from "dayjs"

const STAR_PATH =
  "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"

function BrandHeader({ scale = 1 }: { scale?: number }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: `${Math.round(16 * scale)}px`,
      }}
    >
      <svg
        width={Math.round(68 * scale)}
        height={Math.round(34 * scale)}
        viewBox="0 0 30 15"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d={ORANGE_PATH} fill="#FF4D00" />
        <path d={WHITE_PATH} fill="#FFFFFF" />
        <path d={DARK_PATH} fill="#18181B" />
      </svg>
      <div
        style={{
          display: "flex",
          fontSize: `${Math.round(30 * scale)}px`,
          fontWeight: 900,
          letterSpacing: "-0.03em",
        }}
      >
        <span style={{ color: "#FF4D00", marginRight: "8px" }}>Pixel</span>
        <span style={{ color: "#FAFAFA" }}>Reviews</span>
      </div>
    </div>
  )
}

function StarRow({ score, size = 32 }: { score: number; size?: number }) {
  const rounded = Math.max(0, Math.min(5, Math.round(score)))
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      {[1, 2, 3, 4, 5].map((index) => (
        <svg
          key={index}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill={index <= rounded ? "#FF4D00" : "#27272A"}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d={STAR_PATH} />
        </svg>
      ))}
    </div>
  )
}

export function GameOgTemplate({
  game,
  gameStats,
}: {
  game: Game
  gameStats: GameStats
}) {
  const coverUrl = getOgSafeImageUrl(game.imageUrl, "t_cover_big_2x")
  const backdropUrl = getOgSafeImageUrl(
    game.backgroundImage || game.screenshots?.[0] || game.imageUrl,
    "t_720p"
  )
  const releaseYear =
    game.releaseDate && dayjs(game.releaseDate).isValid()
      ? dayjs(game.releaseDate).format("YYYY")
      : null

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        backgroundColor: "#0E0E11",
        color: "#FAFAFA",
        fontFamily: "sans-serif",
        overflow: "hidden",
      }}
    >
      {backdropUrl && (
        <img
          src={backdropUrl}
          alt=""
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "1200px",
            height: "630px",
            objectFit: "cover",
            opacity: 0.28,
          }}
        />
      )}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "1200px",
          height: "630px",
          backgroundImage:
            "linear-gradient(90deg, rgba(14,14,17,0.97) 0%, rgba(14,14,17,0.86) 58%, rgba(14,14,17,0.55) 100%)",
        }}
      />
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "48px 60px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <BrandHeader scale={0.95} />
          <div
            style={{
              display: "flex",
              padding: "8px 18px",
              borderRadius: "999px",
              backgroundColor: "rgba(255, 77, 0, 0.14)",
              border: "1px solid rgba(255, 77, 0, 0.45)",
              color: "#FF4D00",
              fontSize: "16px",
              fontWeight: 800,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            Unfiltered Player Verdict
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "44px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "18px",
              maxWidth: "740px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: "16px",
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  fontSize: "54px",
                  fontWeight: 900,
                  lineHeight: 1.04,
                  letterSpacing: "-0.03em",
                  textTransform: "uppercase",
                }}
              >
                {truncateText(game.title, 44)}
              </span>
              {releaseYear && (
                <span
                  style={{
                    fontSize: "26px",
                    fontWeight: 700,
                    color: "#A1A1AA",
                  }}
                >
                  {releaseYear}
                </span>
              )}
            </div>

            {game.genres.length > 0 && (
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {game.genres.slice(0, 3).map((genre) => (
                  <span
                    key={genre.id}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "8px",
                      backgroundColor: "#18181B",
                      border: "1px solid #27272A",
                      color: "#D4D4D8",
                      fontSize: "17px",
                      fontWeight: 600,
                    }}
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "20px",
                marginTop: "8px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                  padding: "16px 24px",
                  borderRadius: "16px",
                  backgroundColor: "#18181B",
                  border: "1px solid rgba(255, 77, 0, 0.45)",
                }}
              >
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: 800,
                    letterSpacing: "0.16em",
                    color: "#FF4D00",
                    textTransform: "uppercase",
                  }}
                >
                  Community Score
                </span>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "12px" }}
                >
                  <span
                    style={{
                      fontSize: "38px",
                      fontWeight: 900,
                      color: "#FAFAFA",
                    }}
                  >
                    {gameStats.totalReviews > 0
                      ? gameStats.avgRatings.toFixed(1)
                      : "NEW"}
                  </span>
                  {gameStats.totalReviews > 0 && (
                    <StarRow score={gameStats.avgRatings} size={24} />
                  )}
                </div>
              </div>

              {typeof game.criticScore === "number" && game.criticScore > 0 && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                    padding: "16px 24px",
                    borderRadius: "16px",
                    backgroundColor: "#18181B",
                    border: "1px solid #27272A",
                  }}
                >
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: 800,
                      letterSpacing: "0.16em",
                      color: "#A1A1AA",
                      textTransform: "uppercase",
                    }}
                  >
                    Critic Press
                  </span>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: "6px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "38px",
                        fontWeight: 900,
                        color: "#FAFAFA",
                      }}
                    >
                      {game.criticScore}
                    </span>
                    <span style={{ fontSize: "18px", color: "#71717A" }}>
                      / 100
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {coverUrl && (
            <div
              style={{
                display: "flex",
                width: "252px",
                height: "378px",
                borderRadius: "18px",
                overflow: "hidden",
                border: "2px solid rgba(255, 255, 255, 0.16)",
                boxShadow: "0 24px 60px rgba(0,0,0,0.7)",
                flexShrink: 0,
              }}
            >
              <img
                src={coverUrl}
                alt=""
                style={{
                  width: "252px",
                  height: "378px",
                  objectFit: "cover",
                }}
              />
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid #27272A",
            paddingTop: "18px",
            fontSize: "19px",
            color: "#A1A1AA",
          }}
        >
          <span>www.pixelreviews.app/games/{game.slug}</span>
          <span style={{ color: "#FAFAFA", fontWeight: 700 }}>
            {gameStats.totalReviews > 0
              ? `${gameStats.totalReviews} player ${gameStats.totalReviews === 1 ? "rating" : "ratings"}`
              : "Be the first to rate it"}
          </span>
        </div>
      </div>
    </div>
  )
}

export function ReviewOgTemplate({ review }: { review: Review }) {
  const coverUrl = getOgSafeImageUrl(review.game?.imageUrl, "t_cover_big_2x")
  const backdropUrl = getOgSafeImageUrl(
    review.game?.backgroundImage || review.game?.imageUrl,
    "t_720p"
  )
  const username = review.user?.username || "player"
  const headline = review.title?.trim()
    ? truncateText(review.title, 68)
    : `Rated ${review.score}/5 stars`
  const excerpt = review.content?.trim()
    ? `“${truncateText(review.content, 175)}”`
    : `Check out @${username}'s rating for ${review.game?.title || "this game"} on Pixel Reviews.`

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        backgroundColor: "#0E0E11",
        color: "#FAFAFA",
        fontFamily: "sans-serif",
        overflow: "hidden",
      }}
    >
      {backdropUrl && (
        <img
          src={backdropUrl}
          alt=""
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "1200px",
            height: "630px",
            objectFit: "cover",
            opacity: 0.22,
          }}
        />
      )}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "1200px",
          height: "630px",
          backgroundImage:
            "linear-gradient(115deg, rgba(14,14,17,0.98) 0%, rgba(14,14,17,0.9) 62%, rgba(255,77,0,0.16) 100%)",
        }}
      />

      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "46px 60px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <BrandHeader scale={0.9} />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "8px 18px",
              borderRadius: "999px",
              backgroundColor: "#18181B",
              border: "1px solid #27272A",
              fontSize: "20px",
              fontWeight: 700,
              color: "#FAFAFA",
            }}
          >
            <span style={{ color: "#FF4D00" }}>@{username}</span>
            <span style={{ color: "#71717A" }}>reviewed</span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "42px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              maxWidth: "760px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <span
                style={{
                  fontSize: "22px",
                  fontWeight: 800,
                  letterSpacing: "0.12em",
                  color: "#FF4D00",
                  textTransform: "uppercase",
                }}
              >
                {truncateText(review.game?.title || "Video Game", 42)}
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <StarRow score={review.score} size={30} />
              <span
                style={{
                  fontSize: "28px",
                  fontWeight: 900,
                  color: "#FAFAFA",
                }}
              >
                {review.score}.0 / 5
              </span>
            </div>

            <div
              style={{
                fontSize: "40px",
                fontWeight: 900,
                lineHeight: 1.12,
                letterSpacing: "-0.02em",
                color: "#FAFAFA",
              }}
            >
              {headline}
            </div>

            <div
              style={{
                fontSize: "24px",
                lineHeight: 1.42,
                color: "#D4D4D8",
              }}
            >
              {excerpt}
            </div>
          </div>

          {coverUrl && (
            <div
              style={{
                display: "flex",
                width: "240px",
                height: "360px",
                borderRadius: "18px",
                overflow: "hidden",
                border: "2px solid rgba(255, 77, 0, 0.5)",
                boxShadow: "0 24px 60px rgba(0,0,0,0.75)",
                flexShrink: 0,
              }}
            >
              <img
                src={coverUrl}
                alt=""
                style={{
                  width: "240px",
                  height: "360px",
                  objectFit: "cover",
                }}
              />
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid #27272A",
            paddingTop: "18px",
            fontSize: "19px",
            color: "#A1A1AA",
          }}
        >
          <span>www.pixelreviews.app</span>
          <span style={{ color: "#FF4D00", fontWeight: 800 }}>
            Agree or disagree? Drop your rating →
          </span>
        </div>
      </div>
    </div>
  )
}

export function ReviewShareCardTemplate({
  review,
  format,
}: {
  review: Review
  format: ShareCardFormat
}) {
  const isStory = format === "story"
  const height = isStory ? 1920 : 1350
  const coverUrl = getOgSafeImageUrl(review.game?.imageUrl, "t_cover_big_2x")
  const backdropUrl = getOgSafeImageUrl(
    review.game?.backgroundImage ||
      review.game?.screenshots?.[0] ||
      review.game?.imageUrl,
    "t_1080p"
  )
  const username = review.user?.username || "player"
  const releaseYear =
    review.game?.releaseDate && dayjs(review.game.releaseDate).isValid()
      ? dayjs(review.game.releaseDate).format("YYYY")
      : null
  const reviewHeadline = review.title?.trim()
    ? truncateText(review.title, isStory ? 80 : 64)
    : `${review.game?.title || "Game"} Verdict`
  const reviewBody = review.content?.trim()
    ? `“${truncateText(review.content, isStory ? 340 : 210)}”`
    : `Rated ${review.score} out of 5 stars on Pixel Reviews.`

  return (
    <div
      style={{
        width: "1080px",
        height: `${height}px`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "relative",
        backgroundColor: "#0B0C0F",
        color: "#FAFAFA",
        fontFamily: "sans-serif",
        padding: isStory ? "96px 76px" : "64px 72px",
        overflow: "hidden",
      }}
    >
      {backdropUrl && (
        <img
          src={backdropUrl}
          alt=""
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "1080px",
            height: `${height}px`,
            objectFit: "cover",
            opacity: 0.24,
          }}
        />
      )}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "1080px",
          height: `${height}px`,
          backgroundImage:
            "radial-gradient(circle at 85% 14%, rgba(255, 77, 0, 0.28) 0%, rgba(11, 12, 15, 0) 48%), linear-gradient(180deg, rgba(11,12,15,0.82) 0%, rgba(11,12,15,0.96) 52%, rgba(11,12,15,0.99) 100%)",
        }}
      />

      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <BrandHeader scale={isStory ? 1.25 : 1.1} />
        <div
          style={{
            display: "flex",
            padding: "12px 24px",
            borderRadius: "999px",
            backgroundColor: "rgba(255, 77, 0, 0.16)",
            border: "2px solid rgba(255, 77, 0, 0.55)",
            color: "#FF4D00",
            fontSize: "22px",
            fontWeight: 800,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
          }}
        >
          Player Review
        </div>
      </div>

      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          gap: isStory ? "48px" : "34px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: "40px",
          }}
        >
          {coverUrl && (
            <div
              style={{
                display: "flex",
                width: isStory ? "300px" : "240px",
                height: isStory ? "450px" : "360px",
                borderRadius: "24px",
                overflow: "hidden",
                border: "3px solid rgba(255,255,255,0.18)",
                boxShadow: "0 28px 70px rgba(0,0,0,0.8)",
                flexShrink: 0,
              }}
            >
              <img
                src={coverUrl}
                alt=""
                style={{
                  width: isStory ? "300px" : "240px",
                  height: isStory ? "450px" : "360px",
                  objectFit: "cover",
                }}
              />
            </div>
          )}

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "18px",
              flex: 1,
            }}
          >
            {releaseYear && (
              <span
                style={{
                  fontSize: "26px",
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  color: "#A1A1AA",
                }}
              >
                {releaseYear}
              </span>
            )}
            <div
              style={{
                fontSize: isStory ? "58px" : "50px",
                fontWeight: 900,
                lineHeight: 1.04,
                letterSpacing: "-0.03em",
                textTransform: "uppercase",
              }}
            >
              {truncateText(review.game?.title || "Video Game", 42)}
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                padding: "22px 28px",
                borderRadius: "20px",
                backgroundColor: "rgba(24, 24, 27, 0.92)",
                border: "2px solid rgba(255, 77, 0, 0.5)",
                alignSelf: "flex-start",
              }}
            >
              <StarRow score={review.score} size={isStory ? 42 : 36} />
              <span
                style={{
                  fontSize: isStory ? "38px" : "32px",
                  fontWeight: 900,
                  color: "#FAFAFA",
                }}
              >
                {review.score}.0 / 5.0
              </span>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            padding: isStory ? "48px" : "38px",
            borderRadius: "28px",
            backgroundColor: "rgba(24, 24, 27, 0.88)",
            border: "1px solid #27272A",
          }}
        >
          <div
            style={{
              fontSize: isStory ? "44px" : "36px",
              fontWeight: 900,
              lineHeight: 1.15,
              color: "#FAFAFA",
            }}
          >
            {reviewHeadline}
          </div>
          <div
            style={{
              fontSize: isStory ? "32px" : "27px",
              lineHeight: 1.48,
              color: "#D4D4D8",
            }}
          >
            {reviewBody}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingTop: "18px",
              borderTop: "1px solid #27272A",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "999px",
                  backgroundColor: "#FF4D00",
                  color: "#0B0C0F",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "24px",
                  fontWeight: 900,
                  textTransform: "uppercase",
                }}
              >
                {username.slice(0, 2)}
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span
                  style={{
                    fontSize: "28px",
                    fontWeight: 800,
                    color: "#FAFAFA",
                  }}
                >
                  @{username}
                </span>
                <span style={{ fontSize: "20px", color: "#A1A1AA" }}>
                  Verified Player Log
                </span>
              </div>
            </div>
            {dayjs(review.createdAt).isValid() && (
              <span
                style={{
                  fontSize: "22px",
                  fontWeight: 600,
                  color: "#71717A",
                }}
              >
                {dayjs(review.createdAt).format("DD/MM/YYYY")}
              </span>
            )}
          </div>
        </div>
      </div>

      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: "2px solid #27272A",
          paddingTop: "28px",
          fontSize: "26px",
        }}
      >
        <span style={{ color: "#A1A1AA", fontWeight: 600 }}>
          pixelreviews.app
        </span>
        <span style={{ color: "#FF4D00", fontWeight: 800 }}>
          Your circle. No filters.
        </span>
      </div>
    </div>
  )
}

export function ProfileShareCardTemplate({
  user,
  userStats,
  favGames,
  format,
}: {
  user: User
  userStats?: UserStats
  favGames: Game[]
  format: ShareCardFormat
}) {
  const isStory = format === "story"
  const height = isStory ? 1920 : 1350
  const topFour = favGames.slice(0, 4)
  const backdropUrl = getOgSafeImageUrl(
    topFour[0]?.backgroundImage || topFour[0]?.imageUrl,
    "t_1080p"
  )
  const distribution = userStats?.ratingDistribution ?? []

  return (
    <div
      style={{
        width: "1080px",
        height: `${height}px`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "relative",
        backgroundColor: "#0B0C0F",
        color: "#FAFAFA",
        fontFamily: "sans-serif",
        padding: isStory ? "92px 72px" : "58px 68px",
        overflow: "hidden",
      }}
    >
      {backdropUrl && (
        <img
          src={backdropUrl}
          alt=""
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "1080px",
            height: `${height}px`,
            objectFit: "cover",
            opacity: 0.2,
          }}
        />
      )}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "1080px",
          height: `${height}px`,
          backgroundImage:
            "radial-gradient(circle at 82% 12%, rgba(255, 77, 0, 0.3) 0%, rgba(11, 12, 15, 0) 46%), linear-gradient(180deg, rgba(11,12,15,0.85) 0%, rgba(11,12,15,0.97) 55%, rgba(11,12,15,1) 100%)",
        }}
      />

      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <BrandHeader scale={isStory ? 1.2 : 1.05} />
        <div
          style={{
            display: "flex",
            padding: "12px 24px",
            borderRadius: "999px",
            backgroundColor: "rgba(255, 77, 0, 0.16)",
            border: "2px solid rgba(255, 77, 0, 0.55)",
            color: "#FF4D00",
            fontSize: "21px",
            fontWeight: 800,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          Gamer DNA
        </div>
      </div>

      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          gap: isStory ? "42px" : "28px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "28px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            <div
              style={{
                width: isStory ? "104px" : "88px",
                height: isStory ? "104px" : "88px",
                borderRadius: "999px",
                backgroundColor: "#FF4D00",
                color: "#0B0C0F",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: isStory ? "42px" : "36px",
                fontWeight: 900,
                textTransform: "uppercase",
              }}
            >
              {user.username.slice(0, 2)}
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <span
                style={{
                  fontSize: isStory ? "54px" : "46px",
                  fontWeight: 900,
                  letterSpacing: "-0.03em",
                }}
              >
                @{user.username}
              </span>
              {user.bio && (
                <span
                  style={{
                    fontSize: "24px",
                    color: "#A1A1AA",
                    maxWidth: "620px",
                  }}
                >
                  {truncateText(user.bio, 72)}
                </span>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "20px" }}>
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              padding: isStory ? "28px" : "22px",
              borderRadius: "22px",
              backgroundColor: "rgba(24,24,27,0.9)",
              border: "1px solid #27272A",
            }}
          >
            <span
              style={{
                fontSize: "18px",
                fontWeight: 800,
                letterSpacing: "0.18em",
                color: "#A1A1AA",
                textTransform: "uppercase",
              }}
            >
              Reviews
            </span>
            <span
              style={{
                fontSize: isStory ? "52px" : "42px",
                fontWeight: 900,
                color: "#FF4D00",
                marginTop: "6px",
              }}
            >
              {userStats?.totalReviews ?? 0}
            </span>
          </div>

          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              padding: isStory ? "28px" : "22px",
              borderRadius: "22px",
              backgroundColor: "rgba(24,24,27,0.9)",
              border: "1px solid #27272A",
            }}
          >
            <span
              style={{
                fontSize: "18px",
                fontWeight: 800,
                letterSpacing: "0.18em",
                color: "#A1A1AA",
                textTransform: "uppercase",
              }}
            >
              Logged Games
            </span>
            <span
              style={{
                fontSize: isStory ? "52px" : "42px",
                fontWeight: 900,
                color: "#FAFAFA",
                marginTop: "6px",
              }}
            >
              {userStats?.totalRatings ?? 0}
            </span>
          </div>

          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              padding: isStory ? "28px" : "22px",
              borderRadius: "22px",
              backgroundColor: "rgba(24,24,27,0.9)",
              border: "1px solid #27272A",
            }}
          >
            <span
              style={{
                fontSize: "18px",
                fontWeight: 800,
                letterSpacing: "0.18em",
                color: "#A1A1AA",
                textTransform: "uppercase",
              }}
            >
              Avg Score
            </span>
            <span
              style={{
                fontSize: isStory ? "52px" : "42px",
                fontWeight: 900,
                color: "#FAFAFA",
                marginTop: "6px",
              }}
            >
              {userStats?.avgRating ? `${userStats.avgRating.toFixed(1)}★` : "—"}
            </span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <span
            style={{
              fontSize: "22px",
              fontWeight: 800,
              letterSpacing: "0.22em",
              color: "#FF4D00",
              textTransform: "uppercase",
            }}
          >
            All-Time Top 4 Favorites
          </span>

          <div style={{ display: "flex", gap: "20px" }}>
            {[0, 1, 2, 3].map((slot) => {
              const game = topFour[slot]
              const cover = getOgSafeImageUrl(game?.imageUrl, "t_cover_big_2x")
              const cardWidth = 219
              const cardHeight = isStory ? 328 : 280
              return (
                <div
                  key={slot}
                  style={{
                    width: `${cardWidth}px`,
                    height: `${cardHeight}px`,
                    borderRadius: "20px",
                    overflow: "hidden",
                    backgroundColor: "#18181B",
                    border: cover
                      ? "2px solid rgba(255,255,255,0.18)"
                      : "2px dashed #27272A",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                  }}
                >
                  {cover ? (
                    <img
                      src={cover}
                      alt=""
                      style={{
                        width: `${cardWidth}px`,
                        height: `${cardHeight}px`,
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <span
                      style={{
                        fontSize: "20px",
                        fontWeight: 700,
                        color: "#52525B",
                        textAlign: "center",
                        padding: "16px",
                      }}
                    >
                      {game?.title || `#${slot + 1}`}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {isStory && distribution.length > 0 && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              padding: "32px 36px",
              borderRadius: "24px",
              backgroundColor: "rgba(24,24,27,0.88)",
              border: "1px solid #27272A",
            }}
          >
            <span
              style={{
                fontSize: "19px",
                fontWeight: 800,
                letterSpacing: "0.2em",
                color: "#A1A1AA",
                textTransform: "uppercase",
              }}
            >
              Rating Distribution
            </span>
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                gap: "18px",
                height: "120px",
              }}
            >
              {[1, 2, 3, 4, 5].map((star) => {
                const entry = distribution.find((d) => d.stars === star)
                const pct = Math.max(8, Math.round(entry?.percentage ?? 0))
                return (
                  <div
                    key={star}
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      height: "120px",
                      gap: "10px",
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        height: `${Math.round((pct / 100) * 84)}px`,
                        borderRadius: "10px",
                        backgroundColor:
                          (entry?.count ?? 0) > 0 ? "#FF4D00" : "#27272A",
                      }}
                    />
                    <span
                      style={{
                        fontSize: "20px",
                        fontWeight: 800,
                        color: "#D4D4D8",
                      }}
                    >
                      {star}★
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: "2px solid #27272A",
          paddingTop: "26px",
          fontSize: "25px",
        }}
      >
        <span style={{ color: "#A1A1AA", fontWeight: 600 }}>
          pixelreviews.app/users/{user.username}
        </span>
        <span style={{ color: "#FF4D00", fontWeight: 800 }}>
          Build your Top 4 →
        </span>
      </div>
    </div>
  )
}
