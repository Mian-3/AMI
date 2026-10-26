import Header from "@/components/Header";
import { getLayout, shown } from "@/lib/sectionLayout";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import EventsHero from "@/components/EventsHero";
import EventsGrid from "@/components/EventsGrid";
import { getDictionary } from "@/lib/getDictionary";
import { getLiveEvents } from "@/lib/eventsServer";

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

  return (
    <>
      <Header dict={dict} locale={locale} active="events" />
      <main>
        {events[0] && shown(L, "events.hero") ? <EventsHero event={events[0]} locale={locale} dict={dict} /> : null}
        {shown(L, "events.grid") && <EventsGrid events={events} dict={dict} locale={locale} />}
      </main>
      <Footer dict={dict} locale={locale} />
      <WhatsAppButton dict={dict} />
    </>
  );
}
