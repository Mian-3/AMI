import Header from "@/components/Header";
import InsightsHero from "@/components/InsightsHero";
import BlogExplorer from "@/components/BlogExplorer";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { getDictionary } from "@/lib/getDictionary";
import { getPosts } from "@/lib/insightsData";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  return {
    title: locale === "ar" ? "الرؤى | AM International" : "Insights | AM International",
  };
}

export default async function InsightsPage({ params }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const posts = getPosts(locale);

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