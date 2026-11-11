const VERDICTS = [
  "Finished it in one sitting",
  "Dropped at hour six",
  "The ending is a crime",
  "Better than the trailer",
  "Played it twice",
  "Mid, and proud of it",
  "Worth the wishlist",
  "Carried by the soundtrack",
  "Ruined my sleep schedule",
  "Skip the sequel",
]

function Row() {
  return (
    <ul className="flex shrink-0 items-center" aria-hidden>
      {VERDICTS.map((verdict) => (
        <li key={verdict} className="flex items-center">
          <span className="px-6 font-mono text-sm font-bold tracking-widest whitespace-nowrap uppercase sm:text-base">
            {verdict}
          </span>
          <span className="size-2.5 bg-[#111]" />
        </li>
      ))}
    </ul>
  )
}

export default function VerdictTape() {
  return (
    <div className="relative z-10 -my-4 rotate-[-1.4deg] overflow-hidden bg-primary py-4 text-[#111]">
      <p className="sr-only">
        Real verdicts sound like: {VERDICTS.join(", ")}.
      </p>
      <div className="landing-marquee flex w-max">
        <Row />
        <Row />
      </div>
    </div>
  )
}
