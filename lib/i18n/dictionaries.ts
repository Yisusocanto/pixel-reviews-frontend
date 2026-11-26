export type AppLocale = "es" | "en"

export const DEFAULT_LOCALE: AppLocale = "en"
export const SUPPORTED_LOCALES: readonly AppLocale[] = ["en", "es"]
export const LOCALE_COOKIE_NAME = "NEXT_LOCALE"
export const LOCALE_HEADER_NAME = "x-pixel-locale"

export interface Dictionary {
  meta: {
    siteTitle: string
    siteDescription: string
    searchTitle: string
    searchDescription: string
    chartsTitle: string
    chartsDescription: string
  }
  nav: {
    signIn: string
    join: string
    createAccount: string
    feed: string
    search: string
    charts: string
    profile: string
    moderation: string
    socialStudio: string
    settings: string
    logOut: string
    explore: string
    library: string
    administration: string
    tagline: string
  }
  game: {
    description: string
    storyline: string
    technicalSpecs: string
    releaseDate: string
    website: string
    officialSite: string
    developers: string
    publishers: string
    perspective: string
    gameModes: string
    themes: string
    platforms: string
    noCommunityRatings: string
    signInToReview: string
    reviewSingular: string
    reviewPlural: string
  }
  catalog: {
    genreEyebrow: string
    platformEyebrow: string
    bestGenreTitle: (name: string) => string
    bestGenreSubtitle: (name: string) => string
    bestPlatformTitle: (name: string) => string
    bestPlatformSubtitle: (name: string) => string
    otherGenres: string
    otherPlatforms: string
    emptyCatalog: string
    previousPage: string
    nextPage: string
    pageOf: (page: number, totalPages: number) => string
  }
}

const en: Dictionary = {
  meta: {
    siteTitle: "Pixel Reviews: Community Video Game Reviews & Ratings",
    siteDescription:
      "Rate the games you finish, read unfiltered player reviews, track your gaming wishlist, and see real community rating distributions on Pixel Reviews.",
    searchTitle: "Explore & Search Video Games by Rating",
    searchDescription:
      "Browse popular, trending, and top-rated video games across PC, PlayStation, Xbox, and Nintendo Switch. Read honest player reviews before you buy.",
    chartsTitle: "Charts & Community Game Rankings",
    chartsDescription:
      "Rankings, trends and numbers from everything the Pixel Reviews community plays, rates and writes about.",
  },
  nav: {
    signIn: "Sign in",
    join: "Join",
    createAccount: "Create account",
    feed: "Feed",
    search: "Search",
    charts: "Charts",
    profile: "Profile",
    moderation: "Moderation",
    socialStudio: "Social Studio",
    settings: "Settings",
    logOut: "Log out",
    explore: "Explore",
    library: "Library",
    administration: "Administration",
    tagline: "For those who play",
  },
  game: {
    description: "Description",
    storyline: "Storyline",
    technicalSpecs: "Technical Specifications",
    releaseDate: "Release Date",
    website: "Website",
    officialSite: "Official site",
    developers: "Developers",
    publishers: "Publishers",
    perspective: "Perspective",
    gameModes: "Game Modes",
    themes: "Themes",
    platforms: "Available Platforms",
    noCommunityRatings: "No community ratings yet",
    signInToReview: "Sign in to write a review",
    reviewSingular: "review",
    reviewPlural: "reviews",
  },
  catalog: {
    genreEyebrow: "Genre Rankings",
    platformEyebrow: "Platform Catalog",
    bestGenreTitle: (name) => `Best ${name} Games`,
    bestGenreSubtitle: (name) =>
      `Discover top-rated ${name} video games ranked by critic score and unfiltered community reviews on Pixel Reviews.`,
    bestPlatformTitle: (name) => `Best ${name} Games`,
    bestPlatformSubtitle: (name) =>
      `Explore essential ${name} titles, player ratings, and honest community reviews.`,
    otherGenres: "Browse Other Genres",
    otherPlatforms: "Browse Other Platforms",
    emptyCatalog: "No games indexed in this collection yet.",
    previousPage: "Previous",
    nextPage: "Next",
    pageOf: (page, totalPages) => `Page ${page} of ${totalPages}`,
  },
}

const es: Dictionary = {
  meta: {
    siteTitle: "Pixel Reviews: Reseñas, Notas y Rankings de Videojuegos",
    siteDescription:
      "Califica los videojuegos que terminas, lee reseñas de jugadores sin filtro, guarda tu wishlist y descubre las notas reales de la comunidad en Pixel Reviews.",
    searchTitle: "Explorar y Buscar Videojuegos por Calificación",
    searchDescription:
      "Descubre los videojuegos más populares y mejor valorados en PC, PlayStation, Xbox y Nintendo Switch. Lee opiniones reales antes de comprar.",
    chartsTitle: "Rankings y Estadísticas de la Comunidad",
    chartsDescription:
      "Los juegos mejor valorados, más reseñados y más esperados por la comunidad de Pixel Reviews.",
  },
  nav: {
    signIn: "Entrar",
    join: "Unirse",
    createAccount: "Crear cuenta",
    feed: "Comunidad",
    search: "Explorar",
    charts: "Rankings",
    profile: "Perfil",
    moderation: "Moderación",
    socialStudio: "Social Studio",
    settings: "Ajustes",
    logOut: "Cerrar sesión",
    explore: "Explorar",
    library: "Biblioteca",
    administration: "Administración",
    tagline: "Para quienes juegan",
  },
  game: {
    description: "Descripción",
    storyline: "Historia",
    technicalSpecs: "Especificaciones Técnicas",
    releaseDate: "Lanzamiento",
    website: "Sitio Web",
    officialSite: "Sitio oficial",
    developers: "Desarrolladores",
    publishers: "Distribuidores",
    perspective: "Perspectiva",
    gameModes: "Modos de Juego",
    themes: "Temáticas",
    platforms: "Plataformas Disponibles",
    noCommunityRatings: "Sin notas de la comunidad aún",
    signInToReview: "Inicia sesión para reseñar",
    reviewSingular: "reseña",
    reviewPlural: "reseñas",
  },
  catalog: {
    genreEyebrow: "Ranking por Género",
    platformEyebrow: "Catálogo por Plataforma",
    bestGenreTitle: (name) => `Mejores Juegos de ${name}`,
    bestGenreSubtitle: (name) =>
      `Descubre los mejores videojuegos de ${name} valorados por la crítica y reseñas sin filtro de jugadores reales en Pixel Reviews.`,
    bestPlatformTitle: (name) => `Mejores Juegos de ${name}`,
    bestPlatformSubtitle: (name) =>
      `Explora los títulos imprescindibles de ${name}, sus notas y reseñas honestas de la comunidad.`,
    otherGenres: "Explorar Otros Géneros",
    otherPlatforms: "Explorar Otras Plataformas",
    emptyCatalog: "Aún no hay juegos indexados en esta colección.",
    previousPage: "Anterior",
    nextPage: "Siguiente",
    pageOf: (page, totalPages) => `Página ${page} de ${totalPages}`,
  },
}

export const DICTIONARIES: Record<AppLocale, Dictionary> = { en, es }

export function parseLocale(value: string | null | undefined): AppLocale {
  if (!value) return DEFAULT_LOCALE
  return value.toLowerCase().startsWith("es") ? "es" : "en"
}

export function getDictionary(locale: AppLocale): Dictionary {
  return DICTIONARIES[locale] ?? DICTIONARIES.en
}

export function stripLocalePrefix(pathname: string): string {
  if (pathname === "/es" || pathname === "/en") {
    return "/"
  }
  if (pathname.startsWith("/es/")) {
    return pathname.slice(3)
  }
  if (pathname.startsWith("/en/")) {
    return pathname.slice(3)
  }
  return pathname || "/"
}

export function buildLocalizedPath(
  pathname: string,
  locale: AppLocale
): string {
  const clean = stripLocalePrefix(pathname.startsWith("/") ? pathname : `/${pathname}`)
  if (locale === "es") {
    return clean === "/" ? "/es" : `/es${clean}`
  }
  return clean
}

export function buildLanguageAlternates(
  pathname: string,
  activeLocale: AppLocale
) {
  const enPath = buildLocalizedPath(pathname, "en")
  const esPath = buildLocalizedPath(pathname, "es")
  return {
    canonical: activeLocale === "es" ? esPath : enPath,
    languages: {
      en: enPath,
      es: esPath,
      "x-default": enPath,
    },
  }
}
