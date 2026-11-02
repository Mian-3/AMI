import localFont from "next/font/local";
import "../globals.css";
import NavigationLoader from "@/components/NavigationLoader";
import ScrollToTop from "@/components/ScrollToTop";

// Self-hosted fonts (lib/fontfiles), so the build never needs Google Fonts.
const dmSans = localFont({
  src: "../../lib/fontfiles/dm-sans-latin-wght-normal.woff2",
  weight: "100 1000",
  display: "swap",
  variable: "--font-en",
});

const ibmPlexArabic = localFont({
  src: [
    { path: "../../lib/fontfiles/ibm-plex-sans-arabic-arabic-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../../lib/fontfiles/ibm-plex-sans-arabic-arabic-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../../lib/fontfiles/ibm-plex-sans-arabic-arabic-600-normal.woff2", weight: "600", style: "normal" },
    { path: "../../lib/fontfiles/ibm-plex-sans-arabic-arabic-700-normal.woff2", weight: "700", style: "normal" },
  ],
  display: "swap",
  variable: "--font-ar",
});

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "ar" }];
}

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;
  const dir = locale === "ar" ? "rtl" : "ltr";
  const fontClass = locale === "ar" ? ibmPlexArabic.className : dmSans.className;

  return (
    <div lang={locale} dir={dir} className={fontClass}>
      <ScrollToTop />
      <NavigationLoader>{children}</NavigationLoader>
    </div>
  );
}