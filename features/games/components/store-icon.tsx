import { ShoppingBag } from "lucide-react"

function SteamIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.008l2.861-4.142c-.013-.153-.02-.308-.02-.463 0-2.495 2.029-4.524 4.524-4.524 2.494 0 4.524 2.029 4.524 4.524s-2.03 4.524-4.524 4.524h-.105l-4.076 2.911c0 .052.005.105.005.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-2.99-1.15-3.314-2.679L.373 15.064C1.94 20.25 6.729 24 12.4 24c6.627 0 12-5.373 12-12S18.979 0 11.979 0zm-3.606 15.71a1.884 1.884 0 1 1-1.884-1.884c1.04 0 1.884.844 1.884 1.884zm7.55-4.717a2.52 2.52 0 1 1 2.52-2.52 2.52 2.52 0 0 1-2.52 2.52z" />
    </svg>
  )
}

function PlayStationIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M8.905 17.518c.376.195.842.316 1.376.316 1.344 0 2.022-.857 2.022-1.792 0-.756-.476-1.262-1.332-1.688-1.176-.584-2.13-1.196-2.13-2.617 0-1.603 1.36-2.585 3.32-2.585 1.077 0 1.836.275 2.184.475l-.57 1.706c-.347-.225-.875-.386-1.583-.386-.982 0-1.564.598-1.564 1.343 0 .741.581 1.16 1.547 1.634 1.277.621 1.996 1.265 1.996 2.64 0 1.71-1.372 2.709-3.58 2.709-1.258 0-2.152-.345-2.492-.583zm-5.029-2.022C1.517 14.664 0 13.338 0 11.435 0 8.601 3.056 6.55 6.825 6.55c1.928 0 3.619.537 4.708 1.431l-1.2 1.777c-.813-.637-2.048-1.017-3.508-1.017-2.396 0-4.278 1.107-4.278 2.689 0 .993.755 1.693 2.08 2.087zm16.248 0l-1.236-1.864c1.325-.394 2.08-1.094 2.08-2.087 0-1.582-1.882-2.689-4.278-2.689-1.46 0-2.695.38-3.508 1.017l-1.2-1.777C13.556 7.087 15.247 6.55 17.175 6.55c3.769 0 6.825 2.051 6.825 4.885 0 1.903-1.517 3.229-3.876 4.061z" />
    </svg>
  )
}

function XboxIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M4.685 1.838A11.93 11.93 0 0 0 .549 8.293a11.954 11.954 0 0 0 1.879 9.387c.18-.328.384-.668.614-1.018 2.078-3.159 5.34-6.495 7.842-8.318-1.41-1.688-3.92-4.474-6.2-6.506zm14.63 0c-2.28 2.032-4.79 4.818-6.2 6.506 2.502 1.823 5.764 5.159 7.842 8.318.23.35.434.69.614 1.018a11.954 11.954 0 0 0 1.879-9.387 11.93 11.93 0 0 0-4.135-6.455zM12 9.473c-2.43 2.046-5.835 5.564-7.466 8.847A11.95 11.95 0 0 0 12 24a11.95 11.95 0 0 0 7.466-5.68C17.835 15.037 14.43 11.519 12 9.473zM12 0C9.645 0 7.433.682 5.568 1.859 7.82 3.754 10.36 6.37 12 8.385c1.64-2.015 4.18-4.631 6.432-6.526A11.892 11.892 0 0 0 12 0z" />
    </svg>
  )
}

function NintendoIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M0 8.167C0 3.656 3.656 0 8.167 0H10v24H8.167C3.656 24 0 20.344 0 15.833V8.167zm4.333 4.166a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm9.667-12.333H15.833C20.344 0 24 3.656 24 8.167v7.666C24 20.344 20.344 24 15.833 24H14V0zm4.5 14.667a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
    </svg>
  )
}

function EpicGamesIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M3.563 0C1.595 0 0 1.595 0 3.563v14.077c0 1.706 1.206 3.14 2.872 3.479l8.474 2.836a2.03 2.03 0 0 0 1.308 0l8.474-2.836A3.565 3.565 0 0 0 24 17.64V3.563C24 1.595 22.405 0 20.437 0H3.563zm8.437 3.75c3.228 0 5.438 2.072 5.438 5.097 0 2.215-1.22 3.96-3.141 4.673l3.547 5.68H14.89l-2.92-4.954h-1.89v4.954H7.531V3.75h4.469zm-.047 2.45h-1.953v3.743h1.953c1.636 0 2.766-.826 2.766-1.872 0-1.045-1.13-1.871-2.766-1.871z" />
    </svg>
  )
}

function GogIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-3.5 15.5c-1.933 0-3.5-1.567-3.5-3.5s1.567-3.5 3.5-3.5c1.26 0 2.365.667 2.979 1.666l-1.82 1.05A1.4 1.4 0 0 0 8.5 10.5c-.828 0-1.5.672-1.5 1.5s.672 1.5 1.5 1.5c.616 0 1.14-.372 1.365-.9h-1.365v-1.8h3.35v3.08A3.493 3.493 0 0 1 8.5 15.5zm7 0c-1.933 0-3.5-1.567-3.5-3.5s1.567-3.5 3.5-3.5 3.5 1.567 3.5 3.5-1.567 3.5-3.5 3.5zm0-2c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5z" />
    </svg>
  )
}

function AppleIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.4c.66-.8 1.11-1.92.99-3.04-.96.04-2.12.64-2.8 1.44-.6.69-1.12 1.83-.98 2.92 1.07.08 2.16-.55 2.79-1.32z" />
    </svg>
  )
}

function GooglePlayIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M3.609 1.814L13.793 12 3.61 22.186c-.37-.34-.61-.83-.61-1.386V3.2c0-.556.24-1.046.609-1.386zM15.207 13.414l2.428 2.428-11.83 6.745 9.402-9.173zm0-2.828L5.805 1.413 17.635 8.158l-2.428 2.428zm1.414 1.414l3.18-1.812c.983-.56.983-1.468 0-2.028l-3.18-1.812 2.247 2.826-2.247 2.826z" />
    </svg>
  )
}

function ItchIoIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M2.274 3.738a2.537 2.537 0 0 0-.274 1.139v1.944a2.91 2.91 0 0 0 2.914 2.914c1.173 0 2.187-.696 2.646-1.704.459 1.008 1.473 1.704 2.646 1.704 1.173 0 2.187-.696 2.646-1.704.459 1.008 1.473 1.704 2.646 1.704a2.91 2.91 0 0 0 2.914-2.914V4.877c0-.414-.1-.806-.274-1.139L20.89 1.45A1.854 1.854 0 0 0 19.537.94H4.463c-.51 0-.99.19-1.353.51L2.274 3.738zM2 11.23v7.382C2 20.934 3.766 22.7 5.947 22.7h12.106C20.234 22.7 22 20.934 22 18.612V11.23a4.793 4.793 0 0 1-2.194.53c-1.412 0-2.67-.624-3.536-1.614a4.808 4.808 0 0 1-3.535 1.614c-1.413 0-2.671-.624-3.536-1.614a4.808 4.808 0 0 1-3.535 1.614c-1.412 0-2.67-.624-3.536-1.614A4.793 4.793 0 0 1 2 11.23zm6.34 2.973h1.32v1.32H8.34v-1.32zm6 0h1.32v1.32h-1.32v-1.32zm-7 3.32h9.32v1.32H7.34v-1.32z" />
    </svg>
  )
}

export function StoreIcon({
  slug,
  domain,
  name,
  className,
}: {
  slug?: string
  domain?: string
  name?: string
  className?: string
}) {
  const s = (slug || "").toLowerCase()
  const d = (domain || "").toLowerCase()
  const n = (name || "").toLowerCase()

  if (s.includes("steam") || d.includes("steampowered") || n.includes("steam")) {
    return <SteamIcon className={className} />
  }
  if (s.includes("playstation") || d.includes("playstation") || n.includes("playstation")) {
    return <PlayStationIcon className={className} />
  }
  if (s.includes("xbox") || d.includes("xbox") || d.includes("microsoft") || n.includes("xbox")) {
    return <XboxIcon className={className} />
  }
  if (s.includes("nintendo") || d.includes("nintendo") || n.includes("nintendo")) {
    return <NintendoIcon className={className} />
  }
  if (s.includes("epic") || d.includes("epicgames") || n.includes("epic")) {
    return <EpicGamesIcon className={className} />
  }
  if (s.includes("gog") || d.includes("gog.com") || n.includes("gog")) {
    return <GogIcon className={className} />
  }
  if (s.includes("apple") || s.includes("appstore") || s.includes("app-store") || d.includes("apple.com") || n.includes("app store")) {
    return <AppleIcon className={className} />
  }
  if (s.includes("google") || s.includes("play") || d.includes("play.google") || n.includes("google play")) {
    return <GooglePlayIcon className={className} />
  }
  if (s.includes("itch") || d.includes("itch.io") || n.includes("itch")) {
    return <ItchIoIcon className={className} />
  }
  return <ShoppingBag className={className} />
}
