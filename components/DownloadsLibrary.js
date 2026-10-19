import Reveal from "@/components/Reveal";
import DownloadsRow from "@/components/DownloadsRow";

/*
  Design artboard 1920. Same text scale as the Home page.
  Every row is one editable block from Admin > Downloads. The whole row is a link that opens the PDF in a new tab.
*/
const EYEBROW = "text-[11px] font-semibold uppercase tracking-[0.13em] text-brand-navy rtl:tracking-normal xl:text-[max(12px,calc(16*var(--u)))] xl:leading-[calc(24*var(--u))]";
const H2 = "text-[26px] font-semibold leading-[1.25] tracking-[-0.015em] text-brand-navy md:text-[32px] md:leading-[40px] xl:text-[max(28px,calc(40*var(--u)))] xl:leading-[calc(48*var(--u))]";
const BODY = "text-[14px] leading-[22px] text-ink/60 xl:text-[max(15px,calc(20*var(--u)))] xl:leading-[calc(30*var(--u))]";


const DL_CSS = `
.dl-row{--ease:cubic-bezier(.77,0,.18,1);clip-path:inset(-30px 100% -30px -30px);opacity:0;transition:clip-path .95s var(--ease) var(--d,0ms),opacity .35s ease var(--d,0ms)}
[dir=rtl] .dl-row{clip-path:inset(-30px -30px -30px 100%)}
[dir=rtl] [data-in=true]>.dl-row{clip-path:inset(-30px -30px -30px -30px)}
[data-in=true]>.dl-row{clip-path:inset(-30px -30px -30px -30px);opacity:1}
.dl-pop{transform:scale(.4) rotate(-14deg);opacity:0;transition:transform .9s cubic-bezier(.34,1.56,.64,1) calc(var(--d,0ms) + 380ms),opacity .4s ease calc(var(--d,0ms) + 380ms)}
[data-in=true] .dl-pop{transform:none;opacity:1}
.dl-up{transform:translateY(12px);opacity:0;transition:transform .7s cubic-bezier(.22,1,.36,1) calc(var(--d,0ms) + var(--k,0ms) + 420ms),opacity .6s ease calc(var(--d,0ms) + var(--k,0ms) + 420ms)}
[data-in=true] .dl-up{transform:none;opacity:1}
@keyframes dl-float{0%,100%{transform:translateY(0) rotate(0)}50%{transform:translateY(-4px) rotate(1.2deg)}}
@keyframes dl-wiggle{0%{transform:rotate(0) scale(1)}30%{transform:rotate(-7deg) scale(1.1)}60%{transform:rotate(5deg) scale(1.1)}100%{transform:rotate(0) scale(1.08)}}
@keyframes dl-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(2.4px)}}
[data-in=true] .dl-float{animation:dl-float 5.5s ease-in-out calc(var(--d,0ms) + 1400ms) infinite}
.group:hover .dl-float{animation:dl-wiggle .8s ease-out both}
.group:hover .dl-bob{animation:dl-bob .9s ease-in-out infinite}
.dl-line{transform:scaleX(0);transform-origin:left;transition:transform .55s cubic-bezier(.22,1,.36,1)}
[dir=rtl] .dl-line{transform-origin:right}
.group:hover .dl-line,.group:focus-visible .dl-line{transform:scaleX(1)}
.dl-fill{transform:scaleX(0);transform-origin:left;transition:transform .5s cubic-bezier(.22,1,.36,1)}
[dir=rtl] .dl-fill{transform-origin:right}
.group:hover .dl-fill,.group:focus-visible .dl-fill{transform:scaleX(1)}
@media (prefers-reduced-motion:reduce){
  .dl-row,.dl-pop,.dl-up{opacity:1!important;transform:none!important;clip-path:none!important;transition:none!important}
  .dl-float,.dl-bob{animation:none!important}
}
`;

function DocIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-[21px] w-[21px] shrink-0 text-brand-orange transition-colors duration-300 group-hover:text-white xl:h-[max(22px,calc(28*var(--u)))] xl:w-[max(22px,calc(28*var(--u)))]">
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5" />
      <g className="dl-bob">
        <path d="M12 11.5v5.5m0 0-2.2-2.2m2.2 2.2 2.2-2.2" />
      </g>
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
      <style>{DL_CSS}</style>
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
                <DownloadsRow delay={i * 120}>
                  <a
                    href={item.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${item.title} (PDF)`}
                    className="group relative flex items-stretch overflow-hidden rounded-xl border border-black/[0.07] bg-white transition duration-300 ease-out hover:-translate-y-0.5 hover:border-brand-orange/35 hover:shadow-[0_6px_16px_-12px_rgba(10,37,64,0.16)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 xl:min-h-[calc(120*var(--u))] xl:rounded-[calc(14*var(--u))]"
                  >
                    <span aria-hidden="true" className="flex w-[84px] shrink-0 items-center justify-center bg-[#fffee6] transition-colors duration-300 group-hover:bg-[#fff9c9] sm:w-[104px] xl:w-[calc(150*var(--u))]">
                      <span className="dl-pop block">
                        <span className="dl-float block">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={item.icon} alt="" loading="lazy" className="block h-[52px] w-[52px] object-contain sm:h-[64px] sm:w-[64px] xl:h-[calc(96*var(--u))] xl:w-[calc(96*var(--u))]" />
                        </span>
                      </span>
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col justify-center gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-7 xl:px-[calc(40*var(--u))] xl:py-[calc(24*var(--u))]">
                      <span className="dl-up min-w-0" style={{ "--k": "0ms" }}>
                        <span className="block text-[16px] font-bold leading-[1.3] text-brand-navy md:text-[17px] xl:text-[max(16px,calc(22*var(--u)))] xl:leading-[calc(30*var(--u))]">{item.title}</span>
                        {item.desc ? (
                          <span className="mt-1 block text-[13px] leading-[20px] text-ink/60 xl:mt-[calc(4*var(--u))] xl:text-[max(13px,calc(16*var(--u)))] xl:leading-[calc(24*var(--u))]">{item.desc}</span>
                        ) : null}
                      </span>
                      <span className="dl-up self-start sm:self-auto" style={{ "--k": "140ms" }}>
                        <span className="relative inline-flex h-9 shrink-0 items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-md border border-black/10 bg-white px-4 text-[12px] font-medium text-brand-navy transition-colors duration-300 group-hover:border-brand-orange group-hover:text-white xl:h-[max(40px,calc(48*var(--u)))] xl:gap-[calc(10*var(--u))] xl:rounded-[calc(8*var(--u))] xl:px-[calc(28*var(--u))] xl:text-[max(12px,calc(14*var(--u)))]">
                          <span aria-hidden="true" className="dl-fill absolute inset-0 bg-brand-orange" />
                          <span className="relative z-10 inline-flex items-center gap-2 xl:gap-[calc(10*var(--u))]">
                            <DocIcon />
                            {c.button}
                            <Arrow />
                          </span>
                        </span>
                      </span>
                    </span>
                    <span aria-hidden="true" className="dl-line pointer-events-none absolute bottom-0 start-0 h-[2px] w-full bg-brand-orange" />
                  </a>
                </DownloadsRow>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
