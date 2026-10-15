import AboutReveal from "@/components/AboutReveal";

/*
  Design artboard 1920. At xl+ every size is calc(N * var(--u)) with a floor,
  so this section scales exactly like the Figma frame. Below xl the compact layout is kept.
*/
const ICON = "h-12 w-12 xl:h-[max(40px,calc(56*var(--u)))] xl:w-[max(40px,calc(56*var(--u)))]";

function MissionIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={ICON}>
      <path d="M9 4H7a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h4" />
      <path d="M15 4h2a2 2 0 0 1 2 2v3" />
      <rect x="9" y="2.5" width="6" height="3.5" rx="1" />
      <circle cx="16.5" cy="17" r="4" />
      <circle cx="16.5" cy="17" r="1.2" />
    </svg>
  );
}

function VisionIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={ICON}>
      <path d="M3 8V6a3 3 0 0 1 3-3h2" />
      <path d="M16 3h2a3 3 0 0 1 3 3v2" />
      <path d="M21 16v2a3 3 0 0 1-3 3h-2" />
      <path d="M8 21H6a3 3 0 0 1-3-3v-2" />
      <path d="M2.5 12s3.5-5 9.5-5 9.5 5 9.5 5-3.5 5-9.5 5-9.5-5-9.5-5z" />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  );
}

export default function AboutMissionVision({ dict }) {
  const t = dict.about;
  const items = [
    { icon: <MissionIcon />, label: t.missionLabel, heading: t.missionHeading, text: t.missionText, from: "start" },
    { icon: <VisionIcon />, label: t.visionLabel, heading: t.visionHeading, text: t.visionText, from: "end" },
  ];

  return (
    <section className="bg-[#212121] pb-16 pt-14 text-white [--u:1px] sm:pb-20 sm:pt-16 lg:pb-24 lg:pt-[4.5rem] xl:pb-[calc(96*var(--u))] xl:pt-[calc(72*var(--u))] xl:[--u:clamp(0.667px,0.0520833vw,1px)]">
      <div className="mx-auto grid max-w-[75rem] gap-12 px-4 sm:px-6 md:grid-cols-2 md:gap-x-6 xl:max-w-[calc(1200*var(--u))] xl:gap-x-[calc(26*var(--u))] xl:px-0">
        {items.map((item) => (
          <AboutReveal key={item.label} from={item.from}>
            <div className="group">
              <div className="inline-block transition duration-500 group-hover:-translate-y-1 group-hover:text-[#f28b33]">{item.icon}</div>
              <p className="mt-8 text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-white xl:mt-[calc(50*var(--u))] xl:text-[max(12px,calc(16*var(--u)))] xl:leading-[calc(24*var(--u))]">{item.label}</p>
              <h2 className="mt-2 max-w-[29rem] text-[1.625rem] font-semibold leading-[1.4] sm:text-[1.875rem] xl:mt-0 xl:max-w-[calc(500*var(--u))] xl:text-[max(28px,calc(40*var(--u)))] xl:leading-[calc(48*var(--u))] xl:tracking-[-0.015em]">{item.heading}</h2>
              <p className="mt-2 max-w-[34rem] text-[0.9375rem] leading-[1.8] text-white xl:mt-[calc(8*var(--u))] xl:max-w-[calc(560*var(--u))] xl:text-[max(15px,calc(20*var(--u)))] xl:leading-[calc(30*var(--u))]">{item.text}</p>
            </div>
          </AboutReveal>
        ))}
      </div>
    </section>
  );
}
