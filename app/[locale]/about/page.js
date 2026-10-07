import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import AboutHero from "@/components/AboutHero";
import { getDictionary } from "@/lib/getDictionary";
import AboutJourney from "@/components/AboutJourney";
import AboutMeaning from "@/components/AboutMeaning";
import AboutMissionVision from "@/components/AboutMissionVision";
import AboutLeadership from "@/components/AboutLeadership";
// keep the getDictionary import exactly as in insights/page.js

export async function generateMetadata({ params }) {
  const { locale } = await params;
  return {
    title: locale === "ar" ? "من نحن | إيه إم إنترناشيونال" : "About Us | AM International",
  };
}

export default async function AboutPage({ params }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return (
    <>
      <Header dict={dict} locale={locale} active="about" />
      <main>
  <AboutHero dict={dict} />
  <AboutJourney dict={dict} />
  <AboutMeaning dict={dict} />
  <AboutMissionVision dict={dict} />
  <AboutLeadership dict={dict} />
</main>
      <Footer dict={dict} locale={locale} />
      <WhatsAppButton dict={dict} />
    </>
  );
}