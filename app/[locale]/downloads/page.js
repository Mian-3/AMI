import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import DownloadsHero from "@/components/DownloadsHero";
import DownloadsLibrary from "@/components/DownloadsLibrary";
import DownloadsCta from "@/components/DownloadsCta";
import { getDictionary } from "@/lib/getDictionary";
import { getLiveDownloads } from "@/lib/downloadsData";

// The list can change from the admin, so always render fresh data.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  return { title: locale === "ar" ? "التحميلات | AM International" : "Downloads | AM International" };
}

export default async function DownloadsPage({ params }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const items = await getLiveDownloads(locale);

  return (
    <>
      <Header dict={dict} locale={locale} active="downloads" />
      <main>
        <DownloadsHero dict={dict} />
        <DownloadsLibrary dict={dict} items={items} />
        <DownloadsCta dict={dict} locale={locale} />
      </main>
      <Footer dict={dict} locale={locale} />
      <WhatsAppButton dict={dict} />
    </>
  );
}
