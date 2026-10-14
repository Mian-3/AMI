import Image from "next/image";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { getMedia } from "@/lib/media";
import { resolveHref, isExternal } from "@/lib/mediaShared";
import { inter, dmSans } from "@/lib/fonts";

/*
  Fixed pixel sizes taken from the 1920 design (no scaling), so text is always the design size.
*/
const ICON = "h-5 w-5 xl:h-[21px] xl:w-[21px]";

function Icon({ children }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={ICON}>
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
      <path d="M14.5 21v-8h2.7l.5-3.3h-3.2V7.6c0-1 .5-1.6 1.7-1.6h1.7V3.2C17.6 3.1 16.7 3 15.7 3 13.2 3 11.5 4.5 11.5 7.1v2.6H8.8V13h2.7v8z" />
    </Icon>
  );
}

function InstagramIcon() {
  return (
    <Icon>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" />
    </Icon>
  );
}

function LinkedinIcon() {
  return (
    <Icon>
      <path d="M4.5 9.5v10" />
      <circle cx="4.5" cy="5" r="1" fill="currentColor" />
      <path d="M9.5 19.5v-10" />
      <path d="M9.5 13.5a4 4 0 0 1 4-4h.5a4 4 0 0 1 4 4v6" />
    </Icon>
  );
}

const HEAD = dmSans.className + " text-[12px] font-semibold uppercase text-brand-navy xl:text-[14px] xl:leading-[20px]";
const LIST = "mt-4 space-y-2.5 text-[13px] text-[#5f6663] xl:mt-[11px] xl:space-y-[10px] xl:text-[14px] xl:leading-[20px]";
const LINK = "transition-colors hover:text-brand-orange";

export default async function Footer({ dict, locale }) {
  const media = await getMedia();
  const { links, footerLinks } = media;
  const href = (v) => resolveHref(v, locale);
  const extra = (v) => (isExternal(v) ? { target: "_blank", rel: "noopener noreferrer" } : {});

  const columns = [
    { heading: dict.footer.fragrancesHeading, labels: dict.footer.fragrancesLinks, hrefs: footerLinks.fragrances },
    { heading: dict.footer.foodFlavoursHeading, labels: dict.footer.foodFlavoursLinks, hrefs: footerLinks.foodFlavours },
    { heading: dict.footer.quickLinksHeading, labels: dict.footer.quickLinks, hrefs: footerLinks.quick },
  ];

  return (
    <footer className={inter.className + " bg-cream"}>
      <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 md:py-20 xl:max-w-[1680px] xl:px-[40px] xl:pb-[41px] xl:pt-[54px]">
        <div className="grid grid-cols-1 gap-10 xl:grid-cols-[1fr_637px] xl:gap-0">
          <div>
            <Image
              src="/images/logo/am-international-logo.svg"
              alt="AM International"
              width={1184}
              height={329}
              className="h-10 w-auto xl:h-[54px]"
            />
            <p className={HEAD + " mt-5 xl:mt-[28px]"}>{dict.footer.contactLabel}</p>
            <ul className="mt-3 space-y-3 text-[13px] text-[#5f6663] xl:mt-[11px] xl:space-y-[10px] xl:text-[14px] xl:leading-[20px]">
              <li className="xl:max-w-[300px]">{dict.footer.address}</li>
              <li>
                <a href={"mailto:" + dict.footer.email} dir="ltr" className={LINK}>{dict.footer.email}</a>
              </li>
              <li>
                <a href={"tel:" + dict.footer.phone.replace(/\s/g, "")} dir="ltr" className={LINK}>{dict.footer.phone}</a>
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 xl:grid-cols-[252px_277px_1fr] xl:gap-0 xl:pt-[1px]">
            {columns.map((col) => (
              <div key={col.heading}>
                <p className={HEAD}>{col.heading}</p>
                <ul className={LIST}>
                  {col.labels.map((label, i) => (
                    <li key={label + i}>
                      <a href={href(col.hrefs[i] || "#")} {...extra(col.hrefs[i])} className={LINK}>{label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1200px] xl:max-w-[1680px] xl:px-[40px]">
        <div className="border-t border-brand-navy/10 px-4 sm:px-6 xl:border-brand-navy/15 xl:px-0" />
      </div>
      <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-4 px-4 py-5 text-[12px] text-[#2b2f2e] sm:flex-row sm:px-6 xl:max-w-[1680px] xl:px-[40px] xl:pb-[51px] xl:pt-[26px] xl:text-[16px]">
        <div className="flex flex-col items-center gap-3 sm:flex-row xl:gap-[19px]">
          <LanguageSwitcher openUpward />
          <p>{dict.footer.copyright}</p>
        </div>
        <div className="flex items-center gap-5 text-brand-navy xl:gap-[22px]">
          <a href="#" aria-label="Search" className="transition-colors hover:text-brand-orange"><SearchIcon /></a>
          <a href={href(links.facebook)} {...extra(links.facebook)} aria-label="Facebook" className="transition-colors hover:text-brand-orange"><FacebookIcon /></a>
          <a href={href(links.instagram)} {...extra(links.instagram)} aria-label="Instagram" className="transition-colors hover:text-brand-orange"><InstagramIcon /></a>
          <a href={href(links.linkedin)} {...extra(links.linkedin)} aria-label="LinkedIn" className="transition-colors hover:text-brand-orange"><LinkedinIcon /></a>
        </div>
      </div>
    </footer>
  );
}
