import Image from "next/image";
import LanguageSwitcher from "@/components/LanguageSwitcher";


function PinIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 21s-7-7.2-7-12a7 7 0 0 1 14 0c0 4.8-7 12-7 12Z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L14 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 2 6a2 2 0 0 1 2-2Z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <path d="M17.5 6.5h.01" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

export default function Footer({ dict, locale }) {
  return (
    <footer className="bg-cream">
      <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 md:py-20 xl:px-0">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[300px_1fr]">
          <div>
           <Image
  src="/images/logo/am-international-logo.svg"
  alt="AM International"
  width={1184}
  height={329}
  className="h-10 w-auto"
/>
            <p className="mt-5 text-[12px] font-medium uppercase tracking-[0.06em] text-brand-navy/70">{dict.footer.contactLabel}</p>
            <ul className="mt-3 space-y-3 text-[13px] text-ink/70">
              <li className="flex items-start gap-2">
                <PinIcon />
                <span>{dict.footer.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <MailIcon />
                <a href={"mailto:" + dict.footer.email} dir="ltr" className="transition-colors hover:text-brand-orange">{dict.footer.email}</a>
              </li>
              <li className="flex items-center gap-2">
                <PhoneIcon />
                <a href={"tel:" + dict.footer.phone.replace(/\s/g, "")} dir="ltr" className="transition-colors hover:text-brand-orange">{dict.footer.phone}</a>
              </li>
            </ul>
            <div className="mt-5 flex items-center gap-3 text-brand-navy">
              <a href="#" aria-label="Facebook" className="transition-colors hover:text-brand-orange"><FacebookIcon /></a>
              <a href="#" aria-label="Instagram" className="transition-colors hover:text-brand-orange"><InstagramIcon /></a>
              <a href="#" aria-label="LinkedIn" className="transition-colors hover:text-brand-orange"><LinkedinIcon /></a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.04em] text-brand-navy">{dict.footer.fragrancesHeading}</p>
              <ul className="mt-4 space-y-2.5 text-[13px] text-ink/70">
                {dict.footer.fragrancesLinks.map((label) => (
                  <li key={label}><a href="#" className="transition-colors hover:text-brand-orange">{label}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.04em] text-brand-navy">{dict.footer.foodFlavoursHeading}</p>
              <ul className="mt-4 space-y-2.5 text-[13px] text-ink/70">
                {dict.footer.foodFlavoursLinks.map((label) => (
                  <li key={label}><a href="#" className="transition-colors hover:text-brand-orange">{label}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.04em] text-brand-navy">{dict.footer.quickLinksHeading}</p>
              <ul className="mt-4 space-y-2.5 text-[13px] text-ink/70">
                {dict.footer.quickLinks.map((label) => (
                  <li key={label}><a href="#" className="transition-colors hover:text-brand-orange">{label}</a></li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-brand-navy/10">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-3 px-4 py-5 text-[12px] text-ink/60 sm:flex-row sm:px-6 xl:px-0">
          <p>{dict.footer.copyright}</p>
          <LanguageSwitcher openUpward />        </div>
      </div>
    </footer>
  );
}