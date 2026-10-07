import Image from "next/image";
import AboutReveal from "@/components/AboutReveal";

export default function AboutLeadership({ dict }) {
  const t = dict.about;

  return (
    <section className="bg-white py-14 sm:py-20">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 xl:px-0">
        <div className="mx-auto max-w-[900px] xl:mx-0 xl:ms-[56px]">
          <AboutReveal>
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-brand-navy/70">{t.leadershipEyebrow}</p>
          </AboutReveal>
          <AboutReveal delay={100}>
            <h2 className="mt-2 text-[26px] font-semibold leading-[1.2] text-brand-navy sm:text-[32px]">{t.leadershipHeading}</h2>
          </AboutReveal>
          <AboutReveal delay={200}>
            <p className="mt-4 max-w-[600px] text-[15px] leading-[24px] text-ink/70">{t.leadershipP1}</p>
          </AboutReveal>
          <AboutReveal delay={280}>
            <p className="mt-4 max-w-[600px] text-[15px] leading-[24px] text-ink/70">{t.leadershipP2}</p>
          </AboutReveal>
        </div>

        <ul className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {t.team.map((person, i) => (
            <li key={person.name}>
              <AboutReveal delay={i * 120}>
                <article className="group overflow-hidden">
                  <div className="relative aspect-[213/241] overflow-hidden bg-brand-orange">
                    <Image
                      src={person.image}
                      alt={person.name}
                      fill
                      sizes="(min-width: 1024px) 25vw, 50vw"
                      className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </div>
                  <div className="bg-[#f1ece3] p-3.5">
                    <h3 className="text-[13px] font-semibold leading-[18px] text-brand-navy">{person.name}</h3>
                    <p className="mt-0.5 text-[12px] font-medium text-brand-orange">{person.role}</p>
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