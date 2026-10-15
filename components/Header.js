import Image from "next/image";
import MobileMenu from "@/components/MobileMenu";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import CatalogueDownloadLink from "@/components/CatalogueDownloadLink";
import EnquiryModal from "@/components/EnquiryModal";
import SiteSearch from "@/components/SiteSearch";

function getNavItems(dict, locale, active) {
  return [
    { label: dict.nav.home, href: `/${locale}`, active: active === "home" },
    { label: dict.nav.about, href: `/${locale}/about`, active: active === "about" },
    { label: dict.nav.flavoursFragrances, href: `/${locale}/flavours-fragrances`, active: active === "flavours" },
    { label: dict.nav.process, href: `/${locale}/our-process`, active: active === "process" },
    { label: dict.nav.downloads, href: "#" },
    { label: dict.nav.events, href: `/${locale}/events`, active: active === "events" },
    { label: dict.nav.insights, href: `/${locale}/insights`, active: active === "insights" },
    { label: dict.nav.contact, href: `/${locale}/contact`, active: active === "contact" },
  ];
}

function Icon({ children }) {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}

function PenIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <Icon>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </Icon>
  );
}

function InstagramIcon() {
  return (
    <Icon>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <path d="M17.5 6.5h.01" />
    </Icon>
  );
}

function LinkedinIcon() {
  return (
    <Icon>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </Icon>
  );
}

export default function Header({ dict, locale, active = "home" }) {
  const navItems = getNavItems(dict, locale, active);

  return (
    <>
    <header className="sticky top-0 z-50 w-full bg-[#fcfcfa] animate-fade-down motion-reduce:animate-none xl:[--u:clamp(0.667px,0.0520833vw,1px)]">
      {/* Utility bar */}
      <div className="hidden bg-brand-navy text-white xl:block">
        <div className="mx-auto flex h-10 max-w-[1200px] items-center justify-end gap-5 px-4 text-[11px] sm:px-6 xl:h-[calc(40*var(--u))] xl:max-w-[calc(1600*var(--u))] xl:gap-[calc(28*var(--u))] xl:px-0 xl:text-[max(11px,calc(16*var(--u)))]">
          <a data-enquiry
            href={`/${locale}/contact`}
            className="hidden items-center gap-2 transition-opacity hover:opacity-80 sm:inline-flex"
          >
            <PenIcon />
            <span>{dict.buttons.requestSample}</span>
          </a>
          <CatalogueDownloadLink
            label={dict.buttons.downloadCatalogue}
            icon="doc"
            className="hidden items-center gap-2 transition-opacity hover:opacity-80 sm:inline-flex"
          />
          <div className="flex items-center gap-3">
            <LanguageSwitcher variant="dark" />
            <SiteSearch items={navItems} locale={locale} />
            <a href="#" aria-label="Facebook" className="transition-opacity hover:opacity-80"><FacebookIcon /></a>
            <a href="#" aria-label="Instagram" className="transition-opacity hover:opacity-80"><InstagramIcon /></a>
            <a href="#" aria-label="LinkedIn" className="transition-opacity hover:opacity-80"><LinkedinIcon /></a>
          </div>
        </div>
      </div>

      {/* Main navigation bar */}
      <div className="relative border-b border-black/10 bg-[#fcfcfa]">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center px-4 sm:px-6 xl:h-[calc(85*var(--u))] xl:max-w-[calc(1600*var(--u))] xl:px-0">
          <a href={`/${locale}`} aria-label="AM International home" className="shrink-0">
            <Image
              src="/images/logo/am-international-logo.svg"
              alt="AM International"
              width={1184}
              height={329}
              priority
              className="h-auto w-[170px] xl:w-[calc(233*var(--u))]"
            />
          </a>

          <nav aria-label="Main navigation" className="ms-3 hidden xl:ms-[calc(40*var(--u))] xl:block">
            <ul className="flex items-center gap-[17px] text-[13px] text-ink xl:gap-[calc(11*var(--u))] xl:text-[max(12px,calc(16*var(--u)))]">
              {navItems.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className={
                      item.active
                        ? "block whitespace-nowrap border-b-2 border-brand-orange pb-[21px] pt-[23px] font-medium text-brand-orange xl:border-b-[calc(4*var(--u))] xl:px-[calc(6.5*var(--u))] xl:pb-[calc(26*var(--u))] xl:pt-[calc(28*var(--u))]"
                        : "block whitespace-nowrap py-6 transition-colors duration-200 hover:text-brand-orange xl:px-[calc(6.5*var(--u))] xl:py-[calc(30*var(--u))]"
                    }
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="ms-auto hidden shrink-0 items-center gap-2 xl:flex xl:gap-[calc(14*var(--u))]">
            <a
              data-enquiry
              href={`/${locale}/contact`}
              className="flex h-9 items-center justify-center whitespace-nowrap rounded-md bg-brand-orange px-4 text-[12px] font-medium text-white xl:h-[max(36px,calc(48*var(--u)))] xl:w-[calc(180*var(--u))] xl:min-w-[130px] xl:px-0 xl:text-[max(12px,calc(14*var(--u)))] transition duration-200 hover:-translate-y-0.5 hover:opacity-90 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              {dict.buttons.requestSample}
            </a>
            <CatalogueDownloadLink
              label={dict.buttons.downloadCatalogueArrow}
              icon="none"
              className="flex h-9 items-center justify-center whitespace-nowrap rounded-md border border-brand-navy/20 px-4 text-[12px] font-medium text-brand-navy xl:h-[max(36px,calc(48*var(--u)))] xl:w-[calc(191*var(--u))] xl:min-w-[140px] xl:px-0 xl:text-[max(12px,calc(14*var(--u)))] transition duration-200 hover:-translate-y-0.5 hover:bg-brand-navy/5 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            />
          </div>

          <div className="ms-auto xl:hidden">
            <MobileMenu items={navItems} dict={dict} />
          </div>
        </div>
      </div>
    </header>
    <EnquiryModal dict={dict} locale={locale} />
    </>
  );
}