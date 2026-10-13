import { getDictionary } from "@/lib/getDictionary";
import { getFlavoursMeta } from "@/lib/flavoursMeta";
import { toCardMeta } from "@/lib/flavoursData";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import FlavoursHero from "@/components/FlavoursHero";
import FlavoursSection from "@/components/FlavoursSection";

// Safety net: the page refreshes at least once a minute even if a manual refresh is missed.
export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { locale } = await params;
  return {
    title: locale === "ar" ? "النكهات والعطور | AM International" : "Flavours & Fragrances | AM International",
    description:
      locale === "ar"
        ? "استكشف حلول النكهات والعطور من AM International والقطاعات التي نخدمها."
        : "Explore AM International flavour and fragrance solutions and the industries we serve.",
  };
}

export default async function FlavoursFragrancesPage({ params }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const meta = await getFlavoursMeta();
  const t = dict.flavoursPage;

  return (
    <>
      <Header dict={dict} locale={locale} active="flavours" />
      <main className="bg-[#fcfcfa]">
        <FlavoursHero dict={dict} />
        <FlavoursSection section={t.food} meta={toCardMeta(meta.food, locale)} />
        <FlavoursSection section={t.fragrance} meta={toCardMeta(meta.fragrance, locale)} last />
      </main>
      <Footer dict={dict} locale={locale} />
      <WhatsAppButton dict={dict} />
    </>
  );
}
