import FramerThumbnailCarousel, {
  CarouselItem,
} from "@/components/ui/framer-thumbnail-carousel"

interface Props {
  screenshots: CarouselItem[]
}

function GameScreenshotsSection({ screenshots }: Props) {
  return (
    <section>
      <h2 className="mb-4 font-heading text-sm font-bold tracking-widest text-primary uppercase">
        Screenshots & Artwork
      </h2>
      <FramerThumbnailCarousel
        className="mt-2"
        items={screenshots}
        initialIndex={0}
      />
    </section>
  )
}

export default GameScreenshotsSection
