import Header from "@/components/Header";
import InsightsHero from "@/components/InsightsHero";
import BlogExplorer from "@/components/BlogExplorer";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { getDictionary } from "@/lib/getDictionary";
import { getAllPosts } from "@/lib/insightsDb";

// Safety net: the page refreshes at least once a minute even if a manual refresh is missed.
export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { locale } = await params;
  return {
    title: locale === "ar" ? "الرؤى | AM International" : "Insights | AM International",
  };
}

export default async function InsightsPage({ params }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const posts = await getAllPosts(locale);

  return (
    <>
      <Header dict={dict} locale={locale} active="insights" />
      <main>
        <InsightsHero dict={dict} />
        <BlogExplorer dict={dict} posts={posts} />
      </main>
      <Footer dict={dict} locale={locale} />
      <WhatsAppButton dict={dict} />
    </>
  );
}
