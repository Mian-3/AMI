import Image from "next/image";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { getMedia } from "@/lib/media";
import { resolveHref, isExternal } from "@/lib/mediaShared";
import { inter, dmSans } from "@/lib/fonts";
import { getFooterContact } from "@/lib/footerContactServer";
import { telHref } from "@/lib/footerContact";
import SocialGlyph from "@/components/SocialIcons";
import { SOCIAL_PLATFORMS } from "@/lib/mediaShared";

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

const HEAD = dmSans.className + " text-[11px] font-semibold uppercase text-brand-navy xl:text-[max(11px,calc(12.5*var(--u)))] xl:leading-[calc(18*var(--u))]";
const LIST = "mt-4 space-y-2.5 text-[12px] text-[#5f6663] xl:mt-[10px] xl:space-y-[calc(9*var(--u))] xl:text-[max(11.5px,calc(13*var(--u)))] xl:leading-[calc(19*var(--u))]";
const LINK = "ft-link";

// Motion only: hover underline + lift, and a soft rise as the footer scrolls into view (CSS only, no JS,
// and content is always visible in browsers that do not support scroll-driven animation).
const CSS = `
.ft-link{background:linear-gradient(currentColor,currentColor) 0 100%/0 1px no-repeat;padding-bottom:2px;transition:background-size .35s cubic-bezier(.2,.8,.2,1),color .2s ease}
[dir=rtl] .ft-link{background-position:100% 100%}
.ft-link:hover{color:#f28b33;background-size:100% 1px}
.ft-soc{transition:transform .25s cubic-bezier(.2,.8,.2,1),color .2s ease}
.ft-soc:hover{transform:translateY(-2px);color:#f28b33}
.ft-logo{transition:opacity .25s ease,transform .35s cubic-bezier(.2,.8,.2,1)}
.ft-logo:hover{opacity:.85;transform:translateY(-1px)}
@keyframes ft-rise{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
@supports (animation-timeline: view()){
.ft-rise{animation:ft-rise linear both;animation-timeline:view();animation-range:entry 0% entry 70%}
.ft-d1{animation-range:entry 5% entry 75%}
.ft-d2{animation-range:entry 10% entry 80%}
.ft-d3{animation-range:entry 15% entry 85%}
}
@media (prefers-reduced-motion:reduce){.ft-rise{animation:none!important}.ft-link,.ft-soc,.ft-logo{transition:none}}
`;

export default async function Footer({ dict, locale }) {
  const media = await getMedia();
  const contact = await getFooterContact(dict);
  const { socials, footerLinks } = media;
  const href = (v) => resolveHref(v, locale);
  const extra = (v) => (isExternal(v) ? { target: "_blank", rel: "noopener noreferrer" } : {});

  const columns = [
    { heading: dict.footer.fragrancesHeading, labels: dict.footer.fragrancesLinks, hrefs: footerLinks.fragrances },
    { heading: dict.footer.foodFlavoursHeading, labels: dict.footer.foodFlavoursLinks, hrefs: footerLinks.foodFlavours },
    { heading: dict.footer.quickLinksHeading, labels: dict.footer.quickLinks, hrefs: footerLinks.quick },
  ];

  return (
    <footer className={inter.className + " bg-cream [--u:1px] xl:[--u:clamp(0.667px,0.0520833vw,1px)]"}>
      <style>{CSS}</style>
      <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 md:py-20 xl:max-w-[1680px] xl:px-[40px] xl:pb-[41px] xl:pt-[54px]">
        <div className="grid grid-cols-1 gap-10 xl:grid-cols-[1fr_637px] xl:gap-0">
          <div className="ft-rise">
            <Image
              src="/images/logo/am-international-logo.svg"
              alt="A.M International"
              width={1184}
              height={329}
              className="ft-logo h-10 w-auto xl:h-[54px]"
            />
            <p className={HEAD + " mt-5 xl:mt-[28px]"}>{dict.footer.contactLabel}</p>
            <ul className="mt-3 space-y-3 text-[12px] text-[#5f6663] xl:mt-[10px] xl:space-y-[calc(9*var(--u))] xl:text-[max(11.5px,calc(13*var(--u)))] xl:leading-[calc(19*var(--u))]">
              <li className="xl:max-w-[300px]">{dict.footer.address}</li>
              {contact.emails.map((email) => (
                <li key={email}>
                  <a href={"mailto:" + email} dir="ltr" className={LINK}>{email}</a>
                </li>
              ))}
              {contact.phones.map((phone) => (
                <li key={phone}>
                  <a href={telHref(phone)} dir="ltr" className={LINK}>{phone}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 xl:grid-cols-[252px_277px_1fr] xl:gap-0 xl:pt-[71px]">
            {columns.map((col, ci) => (
              <div key={col.heading} className={"ft-rise " + ["ft-d1", "ft-d2", "ft-d3"][ci]}>
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
      <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-4 px-4 py-5 text-[12px] text-[#2b2f2e] sm:flex-row sm:px-6 xl:max-w-[1680px] xl:px-[40px] xl:pb-[51px] xl:pt-[26px] xl:text-[14px]">
        <div className="flex flex-col items-center gap-3 sm:flex-row xl:gap-[19px]">
          <LanguageSwitcher openUpward />
          <p>{dict.footer.copyright}</p>
        </div>
        <div className="flex items-center gap-5 text-brand-navy xl:gap-[22px]">
          <a href="#" aria-label="Search" className="ft-soc"><SearchIcon /></a>
          {(socials || []).map((s, i) => (
            <a key={s.platform + i} href={href(s.url)} {...extra(s.url)} aria-label={SOCIAL_PLATFORMS.find((p) => p.id === s.platform)?.label} className="ft-soc"><SocialGlyph platform={s.platform} className={ICON} /></a>
          ))}
        </div>
      </div>
    </footer>
  );
}
