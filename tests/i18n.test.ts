import {
  buildLanguageAlternates,
  buildLocalizedPath,
  parseLocale,
  stripLocalePrefix,
} from "@/lib/i18n/dictionaries"
import { describe, expect, it } from "vitest"

describe("i18n routing and SEO alternates", () => {
  it("parses Spanish and English locale codes cleanly", () => {
    expect(parseLocale("es-MX")).toBe("es")
    expect(parseLocale("es")).toBe("es")
    expect(parseLocale("en-US")).toBe("en")
    expect(parseLocale(undefined)).toBe("en")
  })

  it("strips and builds localized paths with as-needed prefixing", () => {
    expect(stripLocalePrefix("/es/games/elden-ring")).toBe("/games/elden-ring")
    expect(stripLocalePrefix("/es")).toBe("/")
    expect(buildLocalizedPath("/games/elden-ring", "es")).toBe(
      "/es/games/elden-ring"
    )
    expect(buildLocalizedPath("/es/games/elden-ring", "en")).toBe(
      "/games/elden-ring"
    )
    expect(buildLocalizedPath("/", "es")).toBe("/es")
  })

  it("builds hreflang alternates with canonical matching active locale", () => {
    const esAlt = buildLanguageAlternates("/games/hollow-knight", "es")
    expect(esAlt).toEqual({
      canonical: "/es/games/hollow-knight",
      languages: {
        en: "/games/hollow-knight",
        es: "/es/games/hollow-knight",
        "x-default": "/games/hollow-knight",
      },
    })
  })
})
