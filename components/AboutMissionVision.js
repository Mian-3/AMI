import AboutReveal from "@/components/AboutReveal";

function MissionIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
    <section className="bg-[#212121] py-14 text-white sm:py-[72px]">
      <div className="mx-auto grid max-w-[900px] gap-12 px-4 sm:px-6 md:grid-cols-2 md:gap-10">
        {items.map((item) => (
          <AboutReveal key={item.label} from={item.from}>
            <div className="group">
              <div className="transition duration-500 group-hover:-translate-y-1 group-hover:text-brand-orange">{item.icon}</div>
              <p className="mt-6 text-[10px] font-medium uppercase tracking-[0.18em] text-white/80">{item.label}</p>
              <h2 className="mt-2 max-w-[320px] text-[22px] font-semibold leading-[1.25] sm:text-[24px]">{item.heading}</h2>
              <p className="mt-3 max-w-[360px] text-[12px] leading-[20px] text-white/85">{item.text}</p>
            </div>
          </AboutReveal>
        ))}
      </div>
    </section>
  );
}