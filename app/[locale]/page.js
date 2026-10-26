import ScrollFx from "@/components/ScrollFx";
import Header from "@/components/Header";
import { getLayout, shown } from "@/lib/sectionLayout";
import { getDictionary } from "@/lib/getDictionary";
import Hero from "@/components/Hero";
import Intro from "@/components/Intro";
import Stats from "@/components/Stats";
import Clients from "@/components/Clients";
import Expertise from "@/components/Expertise";
import Process from "@/components/Process";
import Industries from "@/components/Industries";
import Events from "@/components/Events";
import Insights from "@/components/Insights";
import Certifications from "@/components/Certifications";
import WhatsAppButton from "@/components/WhatsAppButton";
import Footer from "@/components/Footer";
import { getLatestPosts } from "@/lib/insightsDb";
import { getHomeStats } from "@/lib/homeStatsServer";
import { getItemLayout } from "@/lib/itemLayoutServer";
import { arrange } from "@/lib/itemLayout";

// Safety net: home refreshes at least once a minute even if a manual refresh is missed.
export const revalidate = 60;

export default async function Home({ params }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const L = await getLayout();
  const insightPosts = await getLatestPosts(locale, 4);
  const stats = await getHomeStats(locale, dict);
  const IL = await getItemLayout();
  const statCards = arrange(IL, "home.stats", stats).map((x) => x.item);

  return (
    <>
      <Header dict={dict} locale={locale} />

      <main>
        {shown(L, "home.hero") && <Hero dict={dict} locale={locale} />}
        {shown(L, "home.intro") && <Intro dict={dict} />}
        {shown(L, "home.stats") && statCards.length > 0 && <Stats dict={dict} items={statCards} />}
        {shown(L, "home.clients") && <Clients dict={dict} locale={locale} />}
        {shown(L, "home.expertise") && <Expertise dict={dict} />}
        {shown(L, "home.process") && <Process dict={dict} />}
        {shown(L, "home.industries") && <Industries dict={dict} layout={IL} />}
        {shown(L, "home.events") && <Events dict={dict} locale={locale} />}
        {shown(L, "home.insights") && <Insights dict={dict} locale={locale} posts={insightPosts} />}
        {shown(L, "home.certifications") && <Certifications dict={dict} />}
        <WhatsAppButton dict={dict} />
      </main>

      <Footer dict={dict} locale={locale} />
    </>
  );
}