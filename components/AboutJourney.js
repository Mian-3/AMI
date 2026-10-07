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
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="9" r="5.5" />
      <path d="m8.8 13.6-1.6 7.4 4.8-2.6 4.8 2.6-1.6-7.4" />
      <path d="M10 9l1.5 1.5L14.5 7.5" />
    </svg>
  );
}

export default function AboutJourney({ dict }) {
  const t = dict.about;

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#f58f35] to-[#f28a2e] py-14 text-white sm:py-20">
      {/* Diagonal streaks */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-10 bottom-0 start-[8%] w-[16%] -skew-x-[22deg] animate-about-drift bg-gradient-to-b from-black/15 to-transparent motion-reduce:animate-none" />
        <div className="absolute -top-10 bottom-0 start-[42%] w-[12%] -skew-x-[22deg] animate-about-drift bg-gradient-to-b from-black/10 to-transparent [animation-delay:-3s] motion-reduce:animate-none" />
        <div className="absolute -top-10 bottom-0 start-[74%] w-[18%] -skew-x-[22deg] animate-about-drift bg-gradient-to-b from-black/15 to-transparent [animation-delay:-6s] motion-reduce:animate-none" />
      </div>

      <div className="relative mx-auto max-w-[900px] px-4 sm:px-6">
        <div className="mx-auto max-w-[580px] text-center">
          <AboutReveal>
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/90">{t.journeyEyebrow}</p>
          </AboutReveal>
          <AboutReveal delay={100}>
            <h2 className="mt-2 text-[26px] font-semibold leading-[1.2] sm:text-[32px]">{t.journeyHeading}</h2>
          </AboutReveal>
          <AboutReveal delay={200}>
            <p className="mt-4 text-[13px] leading-[21px] text-white/90">{t.journeyP1}</p>
          </AboutReveal>
          <AboutReveal delay={300}>
            <p className="mt-5 text-[13px] leading-[21px] text-white/90">{t.journeyP2}</p>
          </AboutReveal>
        </div>

        <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {CERTS.map((c, i) => (
            <li key={c.n} className="h-full">
              <AboutReveal delay={i * 90} className="h-full">
                <CertificateLink
                  pdfSrc={`/documents/certificates/cert-${c.n}.pdf`}
                  downloadName={`${c.label}.pdf`}
                  className="flex h-[88px] flex-col justify-between rounded-2xl border border-white/30 bg-white/20 p-3.5 text-white backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:bg-white/30"
                >
                  <MedalIcon />
                  <span className="text-[11px] font-medium uppercase tracking-wide">{c.label}</span>
                </CertificateLink>
              </AboutReveal>
            </li>
          ))}
        </ul>

        <AboutReveal delay={200}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-5">
            <a
              href="#meaning"
              className="inline-flex h-9 items-center rounded-md bg-white px-5 text-[12px] font-medium text-brand-orange transition duration-200 hover:-translate-y-0.5 hover:opacity-90"
            >
              {t.discover}
            </a>
            <CatalogueDownloadLink
              label={dict.buttons.downloadCatalogueArrow}
              icon="none"
              className="inline-flex items-center text-[12px] font-medium text-white transition-opacity hover:opacity-80"
            />
          </div>
        </AboutReveal>
      </div>
    </section>
  );
}