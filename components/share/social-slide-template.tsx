import {
  DARK_PATH,
  ORANGE_PATH,
  WHITE_PATH,
} from "@/components/ui/pixel-gamepad-icon"
import { SocialLanguage, SocialSlide } from "@/features/social-studio/types"
import { getOgSafeImageUrl, truncateText } from "@/lib/og-image-utils"

export function SocialSlideTemplate({
  slide,
  slideIndex,
  totalSlides,
  language,
}: {
  slide: SocialSlide
  slideIndex: number
  totalSlides: number
  language: SocialLanguage
}) {
  const backdropUrl = getOgSafeImageUrl(
    slide.imageUrl || slide.coverUrl,
    "t_1080p"
  )
  const coverUrl = getOgSafeImageUrl(slide.coverUrl, "t_cover_big_2x")
  const isHook = slide.kind === "hook"
  const isCta = slide.kind === "cta"
  const hasComparison =
    typeof slide.criticScore === "number" &&
    typeof slide.communityScore === "number"

  const criticNormalized =
    typeof slide.criticScore === "number"
      ? Math.max(8, Math.min(100, slide.criticScore))
      : 0
  const communityNormalized =
    typeof slide.communityScore === "number"
      ? Math.max(8, Math.min(100, Math.round((slide.communityScore / 5) * 100)))
      : 0

  const swipeLabel = language === "es" ? "DESLIZA →" : "SWIPE →"
  const criticLabel =
    language === "es" ? "PRENSA OFICIAL" : "CRITIC PRESS"
  const communityLabel =
    language === "es" ? "JUGADORES REALES" : "REAL PLAYERS"

  return (
    <div
      style={{
        width: "1080px",
        height: "1350px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "relative",
        backgroundColor: "#0B0C0F",
        color: "#FAFAFA",
        fontFamily: "sans-serif",
        padding: "68px 72px",
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
            height: "1350px",
            objectFit: "cover",
            opacity: isHook ? 0.36 : 0.24,
          }}
        />
      )}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "1080px",
          height: "1350px",
          backgroundImage: isHook
            ? "radial-gradient(circle at 80% 15%, rgba(255,77,0,0.34) 0%, rgba(11,12,15,0) 48%), linear-gradient(180deg, rgba(11,12,15,0.55) 0%, rgba(11,12,15,0.92) 55%, rgba(11,12,15,0.99) 100%)"
            : "radial-gradient(circle at 86% 12%, rgba(255,77,0,0.24) 0%, rgba(11,12,15,0) 44%), linear-gradient(180deg, rgba(11,12,15,0.82) 0%, rgba(11,12,15,0.96) 58%, rgba(11,12,15,1) 100%)",
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
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <svg
            width="68"
            height="34"
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
              fontSize: "30px",
              fontWeight: 900,
              letterSpacing: "-0.03em",
            }}
          >
            <span style={{ color: "#FF4D00", marginRight: "8px" }}>Pixel</span>
            <span>Reviews</span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
          }}
        >
          {slide.badge && (
            <div
              style={{
                display: "flex",
                padding: "10px 22px",
                borderRadius: "999px",
                backgroundColor: "rgba(255,77,0,0.16)",
                border: "2px solid rgba(255,77,0,0.55)",
                color: "#FF4D00",
                fontSize: "20px",
                fontWeight: 800,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
              }}
            >
              {truncateText(slide.badge, 24)}
            </div>
          )}
          <div
            style={{
              display: "flex",
              padding: "10px 18px",
              borderRadius: "999px",
              backgroundColor: "#18181B",
              border: "1px solid #27272A",
              color: "#A1A1AA",
              fontSize: "20px",
              fontWeight: 800,
            }}
          >
            {`${String(slideIndex + 1).padStart(2, "0")} / ${String(totalSlides).padStart(2, "0")}`}
          </div>
        </div>
      </div>

      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          gap: "32px",
        }}
      >
        {!isHook && !isCta && coverUrl && (
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: "34px",
            }}
          >
            <div
              style={{
                width: "220px",
                height: "330px",
                borderRadius: "22px",
                overflow: "hidden",
                border: "3px solid rgba(255,255,255,0.18)",
                boxShadow: "0 24px 60px rgba(0,0,0,0.75)",
                display: "flex",
                flexShrink: 0,
              }}
            >
              <img
                src={coverUrl}
                alt=""
                style={{
                  width: "220px",
                  height: "330px",
                  objectFit: "cover",
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "14px",
                flex: 1,
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
                {truncateText(slide.eyebrow, 42)}
              </span>
              <div
                style={{
                  fontSize: "52px",
                  fontWeight: 900,
                  lineHeight: 1.05,
                  letterSpacing: "-0.03em",
                }}
              >
                {truncateText(slide.headline, 72)}
              </div>
            </div>
          </div>
        )}

        {(isHook || isCta || !coverUrl) && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            <span
              style={{
                fontSize: "24px",
                fontWeight: 800,
                letterSpacing: "0.24em",
                color: "#FF4D00",
                textTransform: "uppercase",
              }}
            >
              {truncateText(slide.eyebrow, 44)}
            </span>
            <div
              style={{
                fontSize: isHook ? "74px" : "62px",
                fontWeight: 900,
                lineHeight: 1.04,
                letterSpacing: "-0.03em",
              }}
            >
              {truncateText(slide.headline, 95)}
            </div>
          </div>
        )}

        {hasComparison && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "22px",
              padding: "34px 38px",
              borderRadius: "26px",
              backgroundColor: "rgba(24,24,27,0.92)",
              border: "1px solid #27272A",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "22px",
                  fontWeight: 800,
                }}
              >
                <span style={{ color: "#A1A1AA", letterSpacing: "0.14em" }}>
                  {criticLabel}
                </span>
                <span style={{ color: "#FAFAFA", fontSize: "28px" }}>
                  {`${slide.criticScore} / 100`}
                </span>
              </div>
              <div
                style={{
                  width: "100%",
                  height: "22px",
                  borderRadius: "999px",
                  backgroundColor: "#27272A",
                  display: "flex",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${criticNormalized}%`,
                    height: "22px",
                    borderRadius: "999px",
                    backgroundColor: "#71717A",
                  }}
                />
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "22px",
                  fontWeight: 800,
                }}
              >
                <span style={{ color: "#FF4D00", letterSpacing: "0.14em" }}>
                  {communityLabel}
                </span>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    color: "#FF4D00",
                    fontSize: "28px",
                  }}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="#FF4D00"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <span>{`${slide.communityScore?.toFixed(1)} / 5.0`}</span>
                </div>
              </div>
              <div
                style={{
                  width: "100%",
                  height: "22px",
                  borderRadius: "999px",
                  backgroundColor: "#27272A",
                  display: "flex",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${communityNormalized}%`,
                    height: "22px",
                    borderRadius: "999px",
                    backgroundColor: "#FF4D00",
                  }}
                />
              </div>
            </div>
          </div>
        )}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "18px",
            padding: "36px 40px",
            borderRadius: "26px",
            backgroundColor: isCta
              ? "rgba(255,77,0,0.14)"
              : "rgba(24,24,27,0.88)",
            border: isCta
              ? "2px solid rgba(255,77,0,0.55)"
              : "1px solid #27272A",
          }}
        >
          <div
            style={{
              fontSize: isHook ? "34px" : "30px",
              lineHeight: 1.44,
              color: "#E4E4E7",
              fontWeight: 500,
            }}
          >
            {truncateText(slide.body, 260)}
          </div>
          {slide.quoteAuthor && (
            <span
              style={{
                fontSize: "24px",
                fontWeight: 800,
                color: "#FF4D00",
              }}
            >
              {`— ${slide.quoteAuthor}`}
            </span>
          )}
        </div>
      </div>

      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: "2px solid #27272A",
          paddingTop: "26px",
          fontSize: "24px",
        }}
      >
        <span style={{ color: "#A1A1AA", fontWeight: 600 }}>
          www.pixelreviews.app
        </span>
        <span style={{ color: "#FF4D00", fontWeight: 900 }}>
          {slideIndex < totalSlides - 1
            ? swipeLabel
            : language === "es"
              ? "CALIFICA SIN FILTRO →"
              : "RATE UNFILTERED →"}
        </span>
      </div>
    </div>
  )
}
