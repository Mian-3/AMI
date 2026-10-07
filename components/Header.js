import Image from "next/image";
import MobileMenu from "@/components/MobileMenu";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import CatalogueDownloadLink from "@/components/CatalogueDownloadLink";

function getNavItems(dict, locale, active) {
  return [
    { label: dict.nav.home, href: `/${locale}`, active: active === "home" },
    { label: dict.nav.about, href: `/${locale}/about`, active: active === "about" },
    { label: dict.nav.flavoursFragrances, href: "#" },
    { label: dict.nav.process, href: "#" },
    { label: dict.nav.downloads, href: "#" },
    { label: dict.nav.events, href: `/${locale}/events`, active: active === "events" },
    { label: dict.nav.insights, href: `/${locale}/insights`, active: active === "insights" },
    { label: dict.nav.contact, href: "#" },
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
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <Icon>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </Icon>
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

const UTILITY_LINK =
  "group relative hidden items-center gap-2 py-1 transition-colors duration-300 hover:text-brand-orange sm:inline-flex " +
  "after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:bg-brand-orange after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100 rtl:after:origin-right";

const SOCIAL_LINK =
  "inline-flex h-6 w-6 items-center justify-center rounded-full transition duration-300 hover:-translate-y-0.5 hover:bg-white/10 hover:text-brand-orange motion-reduce:transition-none motion-reduce:hover:translate-y-0";

const NAV_LINK_BASE =
  "relative block whitespace-nowrap py-6 transition-colors duration-300 ease-out " +
  "after:absolute after:inset-x-0 after:bottom-0 after:h-[2px] after:origin-left after:bg-brand-orange rtl:after:origin-right " +
  "focus-visible:outline-none focus-visible:text-brand-orange focus-visible:after:scale-x-100";

const NAV_LINK_ACTIVE = `${NAV_LINK_BASE} text-brand-orange after:scale-x-100 after:animate-nav-line motion-reduce:after:animate-none`;

const NAV_LINK_IDLE = `${NAV_LINK_BASE} hover:text-brand-orange after:scale-x-0 after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100`;

export default function Header({ dict, locale, active = "home" }) {
  const navItems = getNavItems(dict, locale, active);

  return (
    <header className="sticky top-0 z-50 w-full bg-white animate-fade-down motion-reduce:animate-none">
      {/* Utility bar */}
      <div className="hidden bg-brand-navy text-white xl:block">
        <div className="mx-auto flex h-10 max-w-[1200px] items-center justify-end gap-5 px-4 text-[11px] sm:px-6 xl:px-0">
          <a href="#" className={UTILITY_LINK}>
            <PenIcon />
            <span>{dict.buttons.requestSample}</span>
          </a>
          <CatalogueDownloadLink
            label={dict.buttons.downloadCatalogue}
            icon="doc"
            className={UTILITY_LINK}
          />
          <div className="flex items-center gap-1">
            <LanguageSwitcher variant="dark" />
            <a href="#" aria-label="Search" className={SOCIAL_LINK}><SearchIcon /></a>
            <a href="#" aria-label="Facebook" className={SOCIAL_LINK}><FacebookIcon /></a>
            <a href="#" aria-label="Instagram" className={SOCIAL_LINK}><InstagramIcon /></a>
            <a href="#" aria-label="LinkedIn" className={SOCIAL_LINK}><LinkedinIcon /></a>
          </div>
        </div>
      </div>

      {/* Main navigation bar */}
      <div className="relative bg-white">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center px-4 sm:px-6 xl:px-0">
          <a href={`/${locale}`} aria-label="AM International home" className="shrink-0 transition-opacity duration-300 hover:opacity-85">
            <Image
              src="/images/logo/am-international-logo.svg"
              alt="AM International"
              width={1184}
              height={329}
              priority
              className="h-auto w-[170px] xl:w-[190px]"
            />
          </a>

          <nav aria-label="Main navigation" className="ms-3 hidden xl:block">
            <ul className="flex items-center gap-[17px] text-[13px] text-ink">
              {navItems.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    aria-current={item.active ? "page" : undefined}
                    className={item.active ? NAV_LINK_ACTIVE : NAV_LINK_IDLE}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="ms-auto hidden shrink-0 items-center gap-2 xl:flex">
            <a
              href="#"
              className="flex h-9 items-center whitespace-nowrap rounded-md bg-brand-orange px-4 text-[12px] font-medium text-white transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_18px_-6px_rgba(242,139,51,0.7)] active:translate-y-0 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              {dict.buttons.requestSample}
            </a>
            <CatalogueDownloadLink
              label={dict.buttons.downloadCatalogueArrow}
              icon="none"
              className="flex h-9 items-center whitespace-nowrap rounded-md border border-brand-navy/20 px-4 text-[12px] font-medium text-brand-navy transition duration-300 hover:-translate-y-0.5 hover:border-brand-orange/50 hover:bg-brand-navy/5 hover:shadow-md active:translate-y-0 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            />
          </div>

          <div className="ms-auto xl:hidden">
            <MobileMenu items={navItems} dict={dict} />
          </div>
        </div>
      </div>
    </header>
  );
}
