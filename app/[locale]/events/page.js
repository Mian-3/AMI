import Header from "@/components/Header";
import { getLayout, shown } from "@/lib/sectionLayout";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import EventsBanner from "@/components/EventsBanner";
import { getMedia } from "@/lib/media";
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
  const media = await getMedia();
  // The banner is its own picture from the admin. Every event stays in the cards below.
  const { upcoming, past } = splitEvents(events, undefined, false);

  return (
    <>
      <Header dict={dict} locale={locale} active="events" />
      <main>
        {shown(L, "events.banner") && <EventsBanner banner={media.eventsBanner} locale={locale} dict={dict} />}
        {shown(L, "events.grid") && <EventsGrid events={upcoming} dict={dict} locale={locale} fit={media.eventsCards.fit} />}
        {shown(L, "events.previous") && <EventsPrevious events={past} dict={dict} locale={locale} fit={media.eventsCards.fit} />}
      </main>
      <Footer dict={dict} locale={locale} />
      <WhatsAppButton dict={dict} />
    </>
  );
}
