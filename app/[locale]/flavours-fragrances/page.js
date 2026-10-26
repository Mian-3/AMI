import { getDictionary } from "@/lib/getDictionary";
import { getFlavoursMeta } from "@/lib/flavoursMeta";
import { toCardMeta } from "@/lib/flavoursData";
import Header from "@/components/Header";
import { getLayout, shown } from "@/lib/sectionLayout";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import FlavoursHero from "@/components/FlavoursHero";
import FlavoursSection from "@/components/FlavoursSection";

// Safety net: the page refreshes at least once a minute even if a manual refresh is missed.
export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { locale } = await params;
  return {
    title: locale === "ar" ? "النكهات والعطور | A.M International" : "Flavours & Fragrances | A.M International",
    description:
      locale === "ar"
        ? "استكشف حلول النكهات والعطور من A.M International والقطاعات التي نخدمها."
        : "Explore A.M International flavour and fragrance solutions and the industries we serve.",
  };
}

export default async function FlavoursFragrancesPage({ params }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const L = await getLayout();
  const meta = await getFlavoursMeta();
  const t = dict.flavoursPage;
  const cta = dict.buttons?.requestSample || "Request for Sample";

  return (
    <>
      <Header dict={dict} locale={locale} active="flavours" />
      <main className="bg-white [--u:1px] xl:[--u:clamp(0.667px,0.0520833vw,1px)]">
        {shown(L, "flavours.hero") && <FlavoursHero dict={dict} />}
        {shown(L, "flavours.food") && <FlavoursSection kind="food" section={t.food} heading={t.heroHeading} meta={toCardMeta(meta.food, locale)} locale={locale} cta={cta} />}
        {shown(L, "flavours.fragrance") && <FlavoursSection kind="fragrance" section={t.fragrance} heading={t.heroHeading} meta={toCardMeta(meta.fragrance, locale)} locale={locale} cta={cta} tint flip />}
      </main>
      <Footer dict={dict} locale={locale} />
      <WhatsAppButton dict={dict} />
    </>
  );
}