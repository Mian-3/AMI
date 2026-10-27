import Image from "next/image";
import { getItemLayout } from "@/lib/itemLayoutServer";
import { arrange, partShown } from "@/lib/itemLayout";
import AboutReveal from "@/components/AboutReveal";

/*
  Design artboard 1920. At xl+ every size is calc(N * var(--u)) with a floor,
  so this section scales exactly like the Figma frame. Below xl the compact layout is kept.
  All copy comes from dict.about, so it is editable in the admin (Site content > About page).
*/
const P = "text-[14px] leading-[22px] text-ink/60 xl:max-w-[calc(1170*var(--u))] xl:text-[max(15px,calc(20*var(--u)))] xl:leading-[calc(30*var(--u))]";

export default async function AboutLeadership({ dict }) {
  const IL = await getItemLayout();
  const on = (i) => partShown(IL, "about.leadership", i);
  const t = dict.about;
  const paragraphs = [t.leadershipP1, t.leadershipP2, t.leadershipP3, t.leadershipP4].filter((p) => p && String(p).trim());

  return (
    <section id="leadership" className="scroll-mt-24 bg-white pb-16 pt-14 [--u:1px] sm:pb-24 sm:pt-20 lg:pb-[12.5rem] lg:pt-[6.9rem] xl:pb-[calc(250*var(--u))] xl:pt-[calc(97*var(--u))] xl:[--u:clamp(0.667px,0.0520833vw,1px)]">
      <div className="mx-auto max-w-[75rem] px-4 sm:px-6 xl:max-w-[calc(1200*var(--u))] xl:px-0">
      {on(0) && (
<>
        <AboutReveal>
          <p className="text-[11px] font-semibold uppercase tracking-[0.13em] text-brand-navy/80 xl:text-[max(12px,calc(16*var(--u)))] xl:leading-[calc(24*var(--u))] xl:tracking-[0.14em]">{t.leadershipEyebrow}</p>
        </AboutReveal>
        <AboutReveal delay={100}>
          <h2 className="mt-4 text-[26px] font-semibold leading-[1.25] text-brand-navy sm:text-[32px] sm:leading-[40px] xl:mt-[calc(17*var(--u))] xl:text-[max(28px,calc(40*var(--u)))] xl:leading-[calc(48*var(--u))] xl:tracking-[-0.015em]">{t.leadershipHeading}</h2>
        </AboutReveal>
        {paragraphs.map((text, i) => (
          <AboutReveal key={i} delay={200 + i * 80}>
            <p className={`${i === 0 ? "mt-4 xl:mt-[calc(14*var(--u))]" : "mt-5 xl:mt-[calc(20*var(--u))]"} max-w-[63rem] ${P}`}>{text}</p>
          </AboutReveal>
        ))}
</>
      )}

      {on(1) && (
<>
        <ul className="mt-10 grid grid-cols-2 gap-4 lg:mt-[4.25rem] lg:grid-cols-4 xl:mt-[calc(68*var(--u))] xl:gap-[calc(17*var(--u))]">
          {arrange(IL, "about.team", t.team).map(({ item: person }, i) => (
            <li key={person.name + i} className="h-full">
              <AboutReveal delay={i * 120} className="h-full">
                <article className="group flex h-full flex-col overflow-hidden border border-[#e8e8e8] bg-white transition duration-300 hover:-translate-y-1 hover:border-[#f28b33]/50 hover:shadow-lg xl:rounded-[calc(14*var(--u))]">
                  <div className="relative aspect-[287/327] w-full overflow-hidden bg-[#f28b33]">
                    <Image
                      src={person.image}
                      alt={person.name}
                      fill
                      sizes="(min-width: 1024px) 290px, 50vw"
                      className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col items-center justify-start px-3 pb-5 pt-5 text-center xl:min-h-[calc(109*var(--u))] xl:px-[calc(12*var(--u))] xl:pb-[calc(12*var(--u))] xl:pt-[calc(17*var(--u))]">
                    <h3 className="text-[1rem] font-semibold leading-[1.3] text-brand-navy lg:text-[1.0625rem] xl:text-[max(15px,calc(20*var(--u)))] xl:leading-[calc(26*var(--u))]">{person.name}</h3>
                    <p className="mt-1 text-[0.875rem] font-semibold text-[#f28b33] xl:mt-[calc(4*var(--u))] xl:text-[max(13px,calc(16*var(--u)))] xl:leading-[calc(22*var(--u))]">{person.role}</p>
                  </div>
                </article>
              </AboutReveal>
            </li>
          ))}
        </ul>
</>
      )}
      </div>
    </section>
  );
}
