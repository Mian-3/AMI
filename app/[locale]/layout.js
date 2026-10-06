import { DM_Sans, IBM_Plex_Sans_Arabic } from "next/font/google";
import "../globals.css";
import NavigationLoader from "@/components/NavigationLoader";

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-en",
});

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
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
  <NavigationLoader>{children}</NavigationLoader>
    </div>
  );
}