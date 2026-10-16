import Reveal from "@/components/Reveal";

/*
  Design artboard 1920. Same text scale as the Home page.
  Every row is one editable block from Admin > Downloads. The whole row is a link that opens the PDF in a new tab.
*/
const EYEBROW = "text-[11px] font-semibold uppercase tracking-[0.13em] text-brand-navy rtl:tracking-normal xl:text-[max(12px,calc(16*var(--u)))] xl:leading-[calc(24*var(--u))]";
const H2 = "text-[26px] font-semibold leading-[1.25] tracking-[-0.015em] text-brand-navy md:text-[32px] md:leading-[40px] xl:text-[max(28px,calc(40*var(--u)))] xl:leading-[calc(48*var(--u))]";
const BODY = "text-[14px] leading-[22px] text-ink/60 xl:text-[max(15px,calc(20*var(--u)))] xl:leading-[calc(30*var(--u))]";

function DocIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0 text-brand-orange transition-colors duration-300 group-hover:text-white">
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5" />
      <path d="M12 12v5m0 0-2-2m2 2 2-2" />
    </svg>
  );
}

function Arrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export default function DownloadsLibrary({ dict, items }) {
  const c = dict.downloadsPage;

  return (
    <section className="bg-[#fcfcfa] px-4 pb-16 pt-14 [--u:1px] sm:px-6 md:pb-24 md:pt-20 xl:px-0 xl:pb-[calc(120*var(--u))] xl:pt-[calc(80*var(--u))] xl:[--u:clamp(0.667px,0.0520833vw,1px)]">
      <div className="mx-auto max-w-[75rem] xl:max-w-[calc(1200*var(--u))]">
        <Reveal as="p" className={`mb-3 xl:mb-[calc(8*var(--u))] ${EYEBROW}`}>{c.libraryEyebrow}</Reveal>
        <Reveal as="h2" delay={100} className={H2}>{c.libraryHeading}</Reveal>
        <Reveal as="p" delay={200} className={`mt-4 max-w-[34rem] xl:mt-[calc(12*var(--u))] xl:max-w-[calc(720*var(--u))] ${BODY}`}>{c.libraryParagraph}</Reveal>

        {items.length === 0 ? (
          <p className={`mt-10 xl:mt-[calc(48*var(--u))] ${BODY}`}>{c.empty}</p>
        ) : (
          <ul className="mt-8 space-y-3 md:space-y-4 xl:mt-[calc(48*var(--u))] xl:space-y-[calc(20*var(--u))]">
            {items.map((item, i) => (
              <li key={item.id}>
                <Reveal delay={i * 90}>
                  <a
                    href={item.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${item.title} (PDF)`}
                    className="group relative flex items-stretch overflow-hidden rounded-xl border border-black/[0.07] bg-white shadow-[0_1px_2px_rgba(10,37,64,0.04)] transition duration-300 ease-out hover:-translate-y-1 hover:border-brand-orange/40 hover:shadow-[0_18px_40px_-18px_rgba(10,37,64,0.25)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 xl:min-h-[calc(120*var(--u))] xl:rounded-[calc(14*var(--u))]"
                  >
                    <span aria-hidden="true" className="flex w-[84px] shrink-0 items-center justify-center bg-[#fffee6] transition-colors duration-300 group-hover:bg-[#fff9c9] sm:w-[104px] xl:w-[calc(150*var(--u))]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.icon} alt="" loading="lazy" className="h-[52px] w-[52px] object-contain transition-transform duration-500 ease-out group-hover:scale-110 sm:h-[64px] sm:w-[64px] xl:h-[calc(96*var(--u))] xl:w-[calc(96*var(--u))]" />
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col justify-center gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-7 xl:px-[calc(40*var(--u))] xl:py-[calc(24*var(--u))]">
                      <span className="min-w-0">
                        <span className="block text-[16px] font-bold leading-[1.3] text-brand-navy md:text-[17px] xl:text-[max(16px,calc(22*var(--u)))] xl:leading-[calc(30*var(--u))]">{item.title}</span>
                        {item.desc ? (
                          <span className="mt-1 block text-[13px] leading-[20px] text-ink/60 xl:mt-[calc(4*var(--u))] xl:text-[max(13px,calc(16*var(--u)))] xl:leading-[calc(24*var(--u))]">{item.desc}</span>
                        ) : null}
                      </span>
                      <span className="inline-flex h-9 shrink-0 items-center justify-center gap-2 self-start whitespace-nowrap rounded-md border border-black/10 bg-white px-4 text-[12px] font-medium text-brand-navy transition-colors duration-300 group-hover:border-brand-orange group-hover:bg-brand-orange group-hover:text-white sm:self-auto xl:h-[max(40px,calc(48*var(--u)))] xl:gap-[calc(10*var(--u))] xl:rounded-[calc(8*var(--u))] xl:px-[calc(28*var(--u))] xl:text-[max(12px,calc(14*var(--u)))]">
                        <DocIcon />
                        {c.button}
                        <Arrow />
                      </span>
                    </span>
                  </a>
                </Reveal>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
