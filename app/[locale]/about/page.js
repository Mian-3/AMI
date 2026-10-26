import Header from "@/components/Header";
import { getLayout, shown } from "@/lib/sectionLayout";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import AboutHero from "@/components/AboutHero";
import AboutJourney from "@/components/AboutJourney";
import AboutMeaning from "@/components/AboutMeaning";
import AboutMissionVision from "@/components/AboutMissionVision";
import AboutLeadership from "@/components/AboutLeadership";
import { getDictionary } from "@/lib/getDictionary";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  return {
    title: locale === "ar" ? "من نحن | A.M International" : "About Us | A.M International",
  };
}

export default async function AboutPage({ params }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const L = await getLayout();

  return (
    <>
      <Header dict={dict} locale={locale} active="about" />
      <main>
        {shown(L, "about.hero") && <AboutHero dict={dict} />}
        {shown(L, "about.journey") && <AboutJourney dict={dict} />}
        {shown(L, "about.meaning") && <AboutMeaning dict={dict} />}
        {shown(L, "about.missionVision") && <AboutMissionVision dict={dict} />}
        {shown(L, "about.leadership") && <AboutLeadership dict={dict} />}
      </main>
      <Footer dict={dict} locale={locale} />
      <WhatsAppButton dict={dict} />
    </>
  );
}