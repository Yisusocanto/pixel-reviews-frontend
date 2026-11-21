import { ImageResponse } from "next/og"
import {
  DARK_PATH,
  ORANGE_PATH,
  WHITE_PATH,
} from "@/components/ui/pixel-gamepad-icon"

export const alt = "Pixel Reviews — Community Video Game Reviews & Ratings"
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = "image/png"

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#111113",
        backgroundImage:
          "radial-gradient(circle at 88% 22%, rgba(255, 77, 0, 0.24) 0%, rgba(17, 17, 19, 0) 52%)",
        padding: "64px 72px",
        color: "#fafafa",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <svg
          width="84"
          height="42"
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
            fontSize: "34px",
            fontWeight: 900,
            letterSpacing: "-0.03em",
          }}
        >
          <span style={{ color: "#FF4D00", marginRight: "8px" }}>Pixel</span>
          <span>Reviews</span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div
          style={{
            fontSize: "20px",
            fontWeight: 700,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "#FF4D00",
          }}
        >
          For those who play
        </div>
        <div
          style={{
            fontSize: "74px",
            fontWeight: 900,
            lineHeight: 1.02,
            letterSpacing: "-0.03em",
            maxWidth: "960px",
          }}
        >
          Your circle. No filters.
        </div>
        <div
          style={{
            fontSize: "28px",
            lineHeight: 1.4,
            color: "#a1a1aa",
            maxWidth: "880px",
          }}
        >
          Rate the games you finish, read unfiltered player reviews, and see
          real community rating distributions.
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: "1px solid #27272a",
          paddingTop: "24px",
          fontSize: "22px",
          color: "#a1a1aa",
        }}
      >
        <span>www.pixelreviews.app</span>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <svg
              key={i}
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="#FF4D00"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          ))}
        </div>
      </div>
    </div>,
    size
  )
}
