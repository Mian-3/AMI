import Roll from "@/components/Roll";
import { getItemLayout } from "@/lib/itemLayoutServer";
import { arrange, partShown } from "@/lib/itemLayout";
import AboutReveal from "@/components/AboutReveal";
import CertificateLink from "@/components/CertificateLink";
import CatalogueDownloadLink from "@/components/CatalogueDownloadLink";

const CERTS = [
  { label: "ISO 9001 : 2015", n: 1 },
  { label: "FSSC 22000", n: 2 },
  { label: "ISO 14001:2015", n: 3 },
  { label: "HALAL CERTIFIED", n: 4 },
  { label: "PFA LICENSED", n: 5 },
];

function MedalIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-8 w-8 xl:h-[max(32px,calc(46*var(--u)))] xl:w-[max(32px,calc(46*var(--u)))]">
      <circle cx="12" cy="9" r="5.5" />
      <path d="m8.8 13.6-1.6 7.4 4.8-2.6 4.8 2.6-1.6-7.4" />
      <path d="M10 9l1.5 1.5L14.5 7.5" />
    </svg>
  );
}

const STRIPE = "absolute -inset-y-32 -skew-x-[30deg] animate-about-drift motion-reduce:animate-none";

export default async function AboutJourney({ dict }) {
  const IL = await getItemLayout();
  const on = (i) => partShown(IL, "about.journey", i);
  const t = dict.about;

  return (
    <section className="relative overflow-hidden bg-[#f28b33] py-14 text-white [--u:1px] sm:py-20 lg:py-[6.5rem] xl:pb-[calc(103*var(--u))] xl:pt-[calc(95*var(--u))] xl:[--u:clamp(0.667px,0.0520833vw,1px)]">
      {/* Diagonal streaks (mirrored in Arabic) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 rtl:-scale-x-100">
        <div className={`${STRIPE} start-[17%] w-[15%] bg-gradient-to-r from-[#7d6d22]/40 via-[#b98a2c]/10 to-transparent`} />
        <div className={`${STRIPE} start-[46%] w-[15%] bg-gradient-to-r from-[#7d6d22]/40 via-[#b98a2c]/10 to-transparent [animation-delay:-3s]`} />
        <div className={`${STRIPE} start-[76%] w-[15%] bg-gradient-to-r from-[#7d6d22]/40 via-[#b98a2c]/10 to-transparent [animation-delay:-6s]`} />
      </div>

      <div className="relative mx-auto max-w-[75rem] px-4 sm:px-6 xl:max-w-[calc(1200*var(--u))] xl:px-0">
      {on(0) && (
<>
        <div className="mx-auto max-w-[61rem] text-center xl:max-w-[calc(980*var(--u))]">
          <AboutReveal>
            <p className="text-[11px] font-semibold uppercase tracking-[0.13em] text-white xl:text-[max(12px,calc(16*var(--u)))] xl:leading-[calc(24*var(--u))] xl:tracking-[0.13em]">{t.journeyEyebrow}</p>
          </AboutReveal>
          <AboutReveal delay={100}>
            <h2 className="mt-2 text-[26px] font-semibold leading-[1.25] sm:text-[32px] sm:leading-[40px] xl:mt-0 xl:text-[max(30px,calc(40*var(--u)))] xl:leading-[calc(48*var(--u))] xl:tracking-[-0.015em]">{t.journeyHeading}</h2>
          </AboutReveal>
          <AboutReveal delay={200}>
            <p className="mt-5 text-[14px] leading-[22px] text-white xl:mt-[calc(17*var(--u))] xl:text-[max(16px,calc(20*var(--u)))] xl:leading-[calc(30*var(--u))]">{t.journeyP1}</p>
          </AboutReveal>
          <AboutReveal delay={300}>
            <p className="mt-6 text-[14px] leading-[22px] text-white xl:mt-[calc(30*var(--u))] xl:text-[max(16px,calc(20*var(--u)))] xl:leading-[calc(30*var(--u))]">{t.journeyP2}</p>
          </AboutReveal>
          {t.journeyP3 ? (
            <AboutReveal delay={400}>
              <p className="mt-6 text-[14px] leading-[22px] text-white xl:mt-[calc(30*var(--u))] xl:text-[max(16px,calc(20*var(--u)))] xl:leading-[calc(30*var(--u))]">{t.journeyP3}</p>
            </AboutReveal>
          ) : null}
        </div>
</>
      )}

      {on(1) && (
<>
        <ul className="mt-12 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:mt-[4.25rem] lg:grid-cols-5 xl:mt-[calc(53*var(--u))] xl:gap-[calc(8*var(--u))]">
          {CERTS.map((c, i) => (
            <li key={c.n} className="h-full">
              <AboutReveal delay={i * 90} className="h-full">
                <CertificateLink
                  pdfSrc={`/documents/certificates/cert-${c.n}.pdf`}
                  downloadName={`${c.label}.pdf`}
                  className="flex h-[7.5rem] flex-col justify-between rounded-3xl border border-white/30 bg-white/20 p-4 text-white transition duration-300 hover:-translate-y-1 hover:bg-white/30 lg:p-5 xl:h-[max(110px,calc(143*var(--u)))] xl:rounded-[calc(32*var(--u))] xl:p-[calc(22*var(--u))] xl:pb-[calc(22*var(--u))]"
                >
                  <MedalIcon />
                  <span className="text-[0.8125rem] font-semibold uppercase xl:text-[max(12px,calc(16*var(--u)))] xl:leading-[calc(20*var(--u))]">{c.label}</span>
                </CertificateLink>
              </AboutReveal>
            </li>
          ))}
        </ul>
</>
      )}

      {on(2) && (
<>
        <AboutReveal delay={200}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 lg:mt-[4.2rem] xl:mt-[calc(66*var(--u))] xl:gap-x-[calc(30*var(--u))]">
            <a
              href="#meaning"
              className="inline-flex h-9 items-center justify-center rounded-md bg-white px-4 text-[12px] font-medium text-[#f28b33] transition duration-200 hover:-translate-y-0.5 hover:shadow-lg xl:h-[max(40px,calc(48*var(--u)))] xl:w-[calc(229*var(--u))] xl:min-w-[160px] xl:rounded-[calc(8*var(--u))] xl:px-0 xl:text-[max(12px,calc(14*var(--u)))]"
            >
              <Roll>{t.discover}</Roll>
            </a>
            <CatalogueDownloadLink
              label={dict.buttons.downloadCatalogueArrow}
              icon="none"
              className="inline-flex items-center text-[12px] font-medium text-white transition-opacity hover:opacity-80 xl:text-[max(12px,calc(14*var(--u)))]"
            />
          </div>
        </AboutReveal>
</>
      )}
      </div>
    </section>
  );
}
