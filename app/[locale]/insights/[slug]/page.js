import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ArticleHero from "@/components/ArticleHero";
import ArticleBody from "@/components/ArticleBody";
import RelatedInsights from "@/components/RelatedInsights";
import InsightsCta from "@/components/InsightsCta";
import ReadingProgress from "@/components/ReadingProgress";
import { getDictionary } from "@/lib/getDictionary";
import { getAllPosts, getPostBySlug } from "@/lib/insightsDb";

// Safety net: the article refreshes at least once a minute even if a manual refresh is missed.
export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { locale, slug } = await params;
  const post = await getPostBySlug(slug, locale);
  return {
    title: post ? `${post.title} | AM International` : "Insights | AM International",
    description: post?.excerpt || undefined,
  };
}

export default async function InsightDetailPage({ params }) {
  const { locale, slug } = await params;
  const dict = await getDictionary(locale);

  const post = await getPostBySlug(slug, locale);
  if (!post) notFound();

  const label = dict.insightsPage.filters[post.category] ?? post.category;

  const posts = await getAllPosts(locale);
  const others = posts.filter((p) => p.slug !== slug);
  const related = [
    ...others.filter((p) => p.category === post.category),
    ...others.filter((p) => p.category !== post.category),
  ].slice(0, 4);

  return (
    <>
      <Header dict={dict} locale={locale} active="insights" />
      <main>
        <ReadingProgress />
        <ArticleHero post={post} label={label} image={post.image} locale={locale} backLabel={dict.nav.insights} />
        <ArticleBody blocks={post.body} tags={post.tags} dict={dict} title={post.title} />
        <RelatedInsights posts={related} dict={dict} locale={locale} />
        <InsightsCta dict={dict} />
      </main>
      <Footer dict={dict} locale={locale} />
      <WhatsAppButton dict={dict} />
    </>
  );
}