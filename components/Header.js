import Image from "next/image";
import MobileMenu from "@/components/MobileMenu";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const navItems = [
  { label: "Home", href: "#", active: true },
  { label: "About Us", href: "#" },
  { label: "Management", href: "#" },
  { label: "Our Process", href: "#" },
  { label: "Downloads", href: "#" },
  { label: "Events", href: "#" },
  { label: "Our Clients", href: "#" },
  { label: "Contact Us", href: "#" },
];

function Icon({ children }) {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
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

export default function Header() {
  return (
    <header className="relative z-50 w-full animate-fade-down motion-reduce:animate-none">      {/* Utility bar */}
      <div className="bg-brand-navy text-white">
        <div className="mx-auto flex h-10 max-w-[1200px] items-center justify-end gap-5 px-4 text-[11px] sm:px-6 xl:px-0">
          <a href="#" className="hidden transition-opacity hover:opacity-80 sm:inline">Request for Sample</a>
          <a href="#" className="hidden transition-opacity hover:opacity-80 sm:inline">Download Catalogue</a>
          <div className="flex items-center gap-3">
                                    <LanguageSwitcher />

            <a href="#" aria-label="Search" className="transition-opacity hover:opacity-80"><SearchIcon /></a>
            <a href="#" aria-label="Facebook" className="transition-opacity hover:opacity-80"><FacebookIcon /></a>
            <a href="#" aria-label="Instagram" className="transition-opacity hover:opacity-80"><InstagramIcon /></a>
            <a href="#" aria-label="LinkedIn" className="transition-opacity hover:opacity-80"><LinkedinIcon /></a>
          </div>
        </div>
      </div>

      {/* Main navigation bar */}
      <div className="relative bg-white">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center px-4 sm:px-6 xl:px-0">
          <a href="#" aria-label="AM International home" className="shrink-0">
            <Image src="/images/logo/am-international-logo.png" alt="AM International" width={240} height={76} priority className="h-auto w-[140px] xl:w-[176px]" />
          </a>

          <nav aria-label="Main navigation" className="ml-3 hidden xl:block">
            <ul className="flex items-center gap-[17px] text-[13px] text-ink">
              {navItems.map((item) => (
                <li key={item.label}>
                  <a href={item.href} className={item.active ? "block whitespace-nowrap border-b-2 border-brand-orange pb-[21px] pt-[23px] text-brand-orange" : "block whitespace-nowrap py-6 transition-colors duration-200 hover:text-brand-orange"}>{item.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="ml-auto hidden shrink-0 items-center gap-2 xl:flex">
            <a href="#" className="flex h-9 items-center whitespace-nowrap rounded-md bg-brand-orange px-4 text-[12px] font-medium text-white transition duration-200 hover:-translate-y-0.5 hover:opacity-90 motion-reduce:transition-none motion-reduce:hover:translate-y-0">Request for Sample</a>
            <a href="#" className="flex h-9 items-center whitespace-nowrap rounded-md border border-brand-navy/20 px-4 text-[12px] font-medium text-brand-navy transition duration-200 hover:-translate-y-0.5 hover:bg-brand-navy/5 motion-reduce:transition-none motion-reduce:hover:translate-y-0">Download Catalogue →</a>
          </div>

          <div className="ml-auto xl:hidden">
            <MobileMenu items={navItems} />
          </div>
        </div>
      </div>
    </header>
  );
}