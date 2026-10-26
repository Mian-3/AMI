import Header from "@/components/Header";
import { getLayout, shown } from "@/lib/sectionLayout";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import EventsHero from "@/components/EventsHero";
import EventsGrid from "@/components/EventsGrid";
import EventsPrevious from "@/components/EventsPrevious";
import { getDictionary } from "@/lib/getDictionary";
import { getLiveEvents } from "@/lib/eventsServer";
import { splitEvents } from "@/lib/eventsData";

// Events can change from the admin, so always render fresh data.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  return {
    title: locale === "ar" ? "الفعاليات | A.M International" : "Events | A.M International",
  };
}

export default async function EventsPage({ params }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const L = await getLayout();
  const events = await getLiveEvents(locale);
  // Next event to happen = banner, then the other upcoming ones by date, and finished events at the bottom.
  const { hero, upcoming, past, showHero } = splitEvents(events, undefined, shown(L, "events.hero"));

  return (
    <>
      <Header dict={dict} locale={locale} active="events" />
      <main>
        {hero && showHero ? <EventsHero event={hero} locale={locale} dict={dict} /> : null}
        {shown(L, "events.grid") && <EventsGrid events={upcoming} dict={dict} locale={locale} />}
        {shown(L, "events.previous") && <EventsPrevious events={past} dict={dict} locale={locale} />}
      </main>
      <Footer dict={dict} locale={locale} />
      <WhatsAppButton dict={dict} />
    </>
  );
}
