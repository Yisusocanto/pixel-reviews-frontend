import { Gamepad2 } from "lucide-react"
import {
  SiPlaystation,
  SiPlaystation2,
  SiPlaystation3,
  SiPlaystation4,
  SiPlaystation5,
  SiPlaystationportable,
  SiPlaystationvita,
  SiLinux,
  SiApple,
  SiAndroid,
  SiSega,
  SiAtari,
  SiCommodore,
} from "react-icons/si"
import { FaXbox, FaWindows } from "react-icons/fa6"
import { BsNintendoSwitch } from "react-icons/bs"

interface PlatformIconProps {
  slug?: string
  name?: string
  className?: string
}

export function PlatformIcon({ slug, name, className }: PlatformIconProps) {
  const s = (slug || "").toLowerCase()
  const n = (name || "").toLowerCase()

  if (
    s.includes("playstation-5") ||
    s.includes("ps5") ||
    n.includes("playstation 5") ||
    n.includes("ps5")
  ) {
    return <SiPlaystation5 className={className} />
  }
  if (
    s.includes("playstation-4") ||
    s.includes("ps4") ||
    n.includes("playstation 4") ||
    n.includes("ps4")
  ) {
    return <SiPlaystation4 className={className} />
  }
  if (
    s.includes("playstation-3") ||
    s.includes("ps3") ||
    n.includes("playstation 3") ||
    n.includes("ps3")
  ) {
    return <SiPlaystation3 className={className} />
  }
  if (
    s.includes("playstation-2") ||
    s.includes("ps2") ||
    n.includes("playstation 2") ||
    n.includes("ps2")
  ) {
    return <SiPlaystation2 className={className} />
  }
  if (s.includes("ps-vita") || s.includes("vita") || n.includes("vita")) {
    return <SiPlaystationvita className={className} />
  }
  if (
    s.includes("psp") ||
    n.includes("psp") ||
    n.includes("playstation portable")
  ) {
    return <SiPlaystationportable className={className} />
  }
  if (
    s.includes("playstation") ||
    s.includes("ps") ||
    n.includes("playstation")
  ) {
    return <SiPlaystation className={className} />
  }

  if (s.includes("xbox") || n.includes("xbox")) {
    return <FaXbox className={className} />
  }

  if (
    s.includes("nintendo") ||
    s.includes("switch") ||
    s.includes("wii") ||
    s.includes("gamecube") ||
    s.includes("game-boy") ||
    s.includes("ds") ||
    s.includes("nes") ||
    s.includes("snes") ||
    n.includes("nintendo") ||
    n.includes("switch") ||
    n.includes("wii") ||
    n.includes("gamecube") ||
    n.includes("game boy") ||
    n.includes("ds")
  ) {
    return <BsNintendoSwitch className={className} />
  }

  if (
    s.includes("pc") ||
    s.includes("windows") ||
    n.includes("pc") ||
    n.includes("windows")
  ) {
    return <FaWindows className={className} />
  }

  if (s.includes("linux") || n.includes("linux")) {
    return <SiLinux className={className} />
  }

  if (
    s.includes("mac") ||
    s.includes("macos") ||
    s.includes("ios") ||
    s.includes("apple") ||
    n.includes("mac") ||
    n.includes("ios")
  ) {
    return <SiApple className={className} />
  }

  if (s.includes("android") || n.includes("android")) {
    return <SiAndroid className={className} />
  }

  if (
    s.includes("sega") ||
    n.includes("sega") ||
    s.includes("dreamcast") ||
    s.includes("genesis")
  ) {
    return <SiSega className={className} />
  }

  if (s.includes("atari") || n.includes("atari")) {
    return <SiAtari className={className} />
  }

  if (
    s.includes("commodore") ||
    s.includes("amiga") ||
    n.includes("commodore") ||
    n.includes("amiga")
  ) {
    return <SiCommodore className={className} />
  }

  return <Gamepad2 className={className} />
}
