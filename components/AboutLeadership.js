import Image from "next/image";
import AboutReveal from "@/components/AboutReveal";

const P = "text-[1rem] leading-[1.7] text-ink/60 lg:text-[1.0625rem] 2xl:text-[1.25rem] 2xl:leading-[2.25rem]";

export default function AboutLeadership({ dict }) {
  const t = dict.about;

  return (
    <section className="bg-white pb-16 pt-14 sm:pb-24 sm:pt-20 lg:pb-[12.5rem] lg:pt-[6.9rem]">
      <div className="mx-auto max-w-[75rem] px-4 sm:px-6 xl:px-0">
        <AboutReveal>
          <p className="text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-brand-navy/80 2xl:text-[0.875rem]">{t.leadershipEyebrow}</p>
        </AboutReveal>
        <AboutReveal delay={100}>
          <h2 className="mt-4 text-[1.625rem] font-semibold leading-[1.2] text-brand-navy sm:text-[2rem] 2xl:mt-6 2xl:text-[2.25rem]">{t.leadershipHeading}</h2>
        </AboutReveal>
        <AboutReveal delay={200}>
          <p className={`mt-4 max-w-[63rem] ${P}`}>{t.leadershipP1}</p>
        </AboutReveal>
        <AboutReveal delay={280}>
          <p className={`mt-3 max-w-[63rem] ${P}`}>{t.leadershipP2}</p>
        </AboutReveal>

        <ul className="mt-10 grid grid-cols-2 gap-4 lg:mt-[4.25rem] lg:grid-cols-4">
          {t.team.map((person, i) => (
            <li key={person.name} className="h-full">
              <AboutReveal delay={i * 120} className="h-full">
                <article className="group flex h-full flex-col border border-[#e8e8e8] bg-white transition duration-300 hover:-translate-y-1 hover:border-[#f28b33]/50 hover:shadow-lg">
                  <div className="relative aspect-[287/327] w-full overflow-hidden bg-[#f28b33]">
                    <Image
                      src={person.image}
                      alt={person.name}
                      fill
                      sizes="(min-width: 1024px) 290px, 50vw"
                      className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col items-center justify-start px-3 pb-5 pt-5 text-center 2xl:min-h-[6.8rem] 2xl:pt-6">
                    <h3 className="text-[1rem] font-medium leading-[1.3] text-brand-navy lg:text-[1.0625rem] 2xl:text-[1.375rem]">{person.name}</h3>
                    <p className="mt-1 text-[0.875rem] font-medium text-[#f28b33] 2xl:text-[1.0625rem]">{person.role}</p>
                  </div>
                </article>
              </AboutReveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
