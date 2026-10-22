import Image from "next/image";
import MobileMenu from "@/components/MobileMenu";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import CatalogueDownloadLink from "@/components/CatalogueDownloadLink";
import EnquiryModal from "@/components/EnquiryModal";
import SiteSearch from "@/components/SiteSearch";
import SocialGlyph from "@/components/SocialIcons";
import { getMedia } from "@/lib/media";
import { SOCIAL_PLATFORMS, resolveHref, isExternal } from "@/lib/mediaShared";

function getNavItems(dict, locale, active) {
  return [
    { label: dict.nav.home, href: `/${locale}`, active: active === "home" },
    { label: dict.nav.about, href: `/${locale}/about`, active: active === "about" },
    { label: dict.nav.flavoursFragrances, href: `/${locale}/flavours-fragrances`, active: active === "flavours" },
    { label: dict.nav.process, href: `/${locale}/our-process`, active: active === "process" },
    { label: dict.nav.downloads, href: `/${locale}/downloads`, active: active === "downloads" },
    { label: dict.nav.events, href: `/${locale}/events`, active: active === "events" },
    { label: dict.nav.insights, href: `/${locale}/insights`, active: active === "insights" },
    { label: dict.nav.contact, href: `/${locale}/contact`, active: active === "contact" },
  ];
}

function Icon({ children }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-[14px] w-[14px] xl:h-[max(14px,calc(18*var(--u)))] xl:w-[max(14px,calc(18*var(--u)))]">
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


const SOCIAL_CSS = `
@keyframes hd-pop{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:none}}
.hd-soc{display:inline-flex;align-items:center;justify-content:center;animation:hd-pop .5s cubic-bezier(.22,1,.36,1) both;animation-delay:calc(var(--i,0)*80ms + 500ms);transition:opacity .2s}
.hd-soc:hover{opacity:.8}
@media (prefers-reduced-motion:reduce){.hd-soc{animation:none}}
`;

const SOC = "hd-soc";

function Social({ label, href, i, children }) {
  const ext = isExternal(href) ? { target: "_blank", rel: "noopener noreferrer" } : {};
  return (
    <a href={href} {...ext} aria-label={label} className={SOC} style={{ "--i": i }}>
      {children}
    </a>
  );
}

export default async function Header({ dict, locale, active = "home" }) {
  const media = await getMedia();
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
            <style>{SOCIAL_CSS}</style>
            <LanguageSwitcher variant="dark" />
            <SiteSearch items={navItems} locale={locale} />
            {(media.socials || []).map((s, i) => (
              <Social key={s.platform + i} label={SOCIAL_PLATFORMS.find((p) => p.id === s.platform)?.label} href={resolveHref(s.url, locale)} i={i}>
                <SocialGlyph platform={s.platform} className="h-[14px] w-[14px] xl:h-[max(14px,calc(18*var(--u)))] xl:w-[max(14px,calc(18*var(--u)))]" strokeWidth={2} />
              </Social>
            ))}
          </div>
        </div>
      </div>

      {/* Main navigation bar */}
      <div className="relative border-b border-black/10 bg-[#fcfcfa]">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center px-4 sm:px-6 xl:h-[calc(85*var(--u))] xl:max-w-[calc(1600*var(--u))] xl:px-0">
          <a href={`/${locale}`} aria-label="AM International home" className="shrink-0">
            <Image
              src="/images/logo/am-international-logo.png"
              alt="AM International"
              width={1600}
              height={429}
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