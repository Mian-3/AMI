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
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="9" r="5.5" />
      <path d="m8.8 13.6-1.6 7.4 4.8-2.6 4.8 2.6-1.6-7.4" />
      <path d="M10 9l1.5 1.5L14.5 7.5" />
    </svg>
  );
}

const STRIPE = "absolute -inset-y-32 -skew-x-[30deg] animate-about-drift motion-reduce:animate-none";

export default function AboutJourney({ dict }) {
  const t = dict.about;

  return (
    <section className="relative overflow-hidden bg-[#f28b33] py-14 text-white sm:py-20 lg:py-[6.5rem]">
      {/* Diagonal streaks (mirrored in Arabic) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 rtl:-scale-x-100">
        <div className={`${STRIPE} start-[17%] w-[15%] bg-gradient-to-r from-[#7d6d22]/40 via-[#b98a2c]/10 to-transparent`} />
        <div className={`${STRIPE} start-[46%] w-[15%] bg-gradient-to-r from-[#7d6d22]/40 via-[#b98a2c]/10 to-transparent [animation-delay:-3s]`} />
        <div className={`${STRIPE} start-[76%] w-[15%] bg-gradient-to-r from-[#7d6d22]/40 via-[#b98a2c]/10 to-transparent [animation-delay:-6s]`} />
      </div>

      <div className="relative mx-auto max-w-[75rem] px-4 sm:px-6 xl:px-0">
        <div className="mx-auto max-w-[61rem] text-center">
          <AboutReveal>
            <p className="text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-white 2xl:text-[0.875rem]">{t.journeyEyebrow}</p>
          </AboutReveal>
          <AboutReveal delay={100}>
            <h2 className="mt-2 text-[1.75rem] font-semibold leading-[1.2] sm:text-[2rem] 2xl:text-[2.5rem]">{t.journeyHeading}</h2>
          </AboutReveal>
          <AboutReveal delay={200}>
            <p className="mt-5 text-[0.9375rem] leading-[1.7] text-white lg:text-[1rem] 2xl:text-[1.125rem] 2xl:leading-[1.875rem]">{t.journeyP1}</p>
          </AboutReveal>
          <AboutReveal delay={300}>
            <p className="mt-6 text-[0.9375rem] leading-[1.7] text-white lg:text-[1rem] 2xl:mt-8 2xl:text-[1.125rem] 2xl:leading-[1.875rem]">{t.journeyP2}</p>
          </AboutReveal>
        </div>

        <ul className="mt-12 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:mt-[4.25rem] lg:grid-cols-5">
          {CERTS.map((c, i) => (
            <li key={c.n} className="h-full">
              <AboutReveal delay={i * 90} className="h-full">
                <CertificateLink
                  pdfSrc={`/documents/certificates/cert-${c.n}.pdf`}
                  downloadName={`${c.label}.pdf`}
                  className="flex h-[7.5rem] flex-col justify-between rounded-3xl border border-white/30 bg-white/20 p-4 text-white transition duration-300 hover:-translate-y-1 hover:bg-white/30 lg:p-5 2xl:h-[8.9rem]"
                >
                  <MedalIcon />
                  <span className="text-[0.8125rem] font-medium uppercase 2xl:text-[0.875rem]">{c.label}</span>
                </CertificateLink>
              </AboutReveal>
            </li>
          ))}
        </ul>

        <AboutReveal delay={200}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 lg:mt-[4.2rem]">
            <a
              href="#meaning"
              className="inline-flex h-12 items-center rounded-lg bg-white px-8 text-[0.875rem] font-medium text-[#f28b33] transition duration-200 hover:-translate-y-0.5 hover:shadow-lg 2xl:px-10"
            >
              {t.discover}
            </a>
            <CatalogueDownloadLink
              label={dict.buttons.downloadCatalogueArrow}
              icon="none"
              className="inline-flex items-center text-[0.875rem] font-medium text-white transition-opacity hover:opacity-80"
            />
          </div>
        </AboutReveal>
      </div>
    </section>
  );
}
