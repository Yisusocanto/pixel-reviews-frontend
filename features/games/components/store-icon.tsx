import { ShoppingBag } from "lucide-react"
import {
  SiSteam,
  SiPlaystation,
  SiEpicgames,
  SiGogdotcom,
  SiApple,
  SiGoogleplay,
  SiItchdotio,
  SiUbisoft,
  SiEa,
  SiOculus,
  SiHumblebundle,
} from "react-icons/si"
import { FaXbox, FaBattleNet, FaAmazon } from "react-icons/fa6"
import { BsNintendoSwitch } from "react-icons/bs"

interface StoreIconProps {
  slug?: string
  domain?: string
  name?: string
  className?: string
}

export function StoreIcon({ slug, domain, name, className }: StoreIconProps) {
  const s = (slug || "").toLowerCase()
  const d = (domain || "").toLowerCase()
  const n = (name || "").toLowerCase()

  if (s.includes("steam") || d.includes("steampowered") || n.includes("steam")) {
    return <SiSteam className={className} />
  }
  if (
    s.includes("playstation") ||
    d.includes("playstation") ||
    n.includes("playstation") ||
    s.includes("ps-store") ||
    s.includes("psn")
  ) {
    return <SiPlaystation className={className} />
  }
  if (
    s.includes("xbox") ||
    d.includes("xbox") ||
    d.includes("microsoft") ||
    n.includes("xbox")
  ) {
    return <FaXbox className={className} />
  }
  if (
    s.includes("nintendo") ||
    d.includes("nintendo") ||
    n.includes("nintendo") ||
    s.includes("eshop")
  ) {
    return <BsNintendoSwitch className={className} />
  }
  if (
    s.includes("epic") ||
    d.includes("epicgames") ||
    n.includes("epic")
  ) {
    return <SiEpicgames className={className} />
  }
  if (s.includes("gog") || d.includes("gog.com") || n.includes("gog")) {
    return <SiGogdotcom className={className} />
  }
  if (
    s.includes("apple") ||
    s.includes("appstore") ||
    s.includes("app-store") ||
    d.includes("apple.com") ||
    n.includes("app store")
  ) {
    return <SiApple className={className} />
  }
  if (
    s.includes("google") ||
    s.includes("play") ||
    d.includes("play.google") ||
    n.includes("google play")
  ) {
    return <SiGoogleplay className={className} />
  }
  if (s.includes("itch") || d.includes("itch.io") || n.includes("itch")) {
    return <SiItchdotio className={className} />
  }
  if (s.includes("ubisoft") || d.includes("ubisoft") || n.includes("ubisoft")) {
    return <SiUbisoft className={className} />
  }
  if (
    s.includes("ea") ||
    s.includes("origin") ||
    d.includes("ea.com") ||
    n.includes("electronic arts")
  ) {
    return <SiEa className={className} />
  }
  if (
    s.includes("battle") ||
    s.includes("blizzard") ||
    d.includes("battle.net") ||
    n.includes("battle.net")
  ) {
    return <FaBattleNet className={className} />
  }
  if (s.includes("oculus") || d.includes("oculus") || n.includes("oculus")) {
    return <SiOculus className={className} />
  }
  if (
    s.includes("humble") ||
    d.includes("humblebundle") ||
    n.includes("humble")
  ) {
    return <SiHumblebundle className={className} />
  }
  if (s.includes("amazon") || d.includes("amazon") || n.includes("amazon")) {
    return <FaAmazon className={className} />
  }

  return <ShoppingBag className={className} />
}
