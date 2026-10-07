import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ArticleHero from "@/components/ArticleHero";
import ArticleBody from "@/components/ArticleBody";
import RelatedInsights from "@/components/RelatedInsights";
import InsightsCta from "@/components/InsightsCta";
import { getPosts } from "@/lib/insightsData";
import { getArticle } from "@/lib/insightsArticles";
import { getDictionary } from "@/lib/getDictionary";import Hero from "@/components/Hero";
   import ReadingProgress from "@/components/ReadingProgress";

// paste the getDictionary import line from about/page.js here

export async function generateMetadata({ params }) {
  const { locale, slug } = await params;
  const post = getPosts(locale).find((p) => p.slug === slug);
  return { title: post ? `${post.title} | AM International` : "Insights | AM International" };
}

export default async function InsightDetailPage({ params }) {
  const { locale, slug } = await params;
  const dict = await getDictionary(locale);
  const posts = getPosts(locale);
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();

  const article = getArticle(slug, locale);
  const label = dict.insightsPage.filters[post.category] ?? post.category;

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

   <ArticleHero post={post} label={label} image={article.heroImage ?? post.image} locale={locale} backLabel={dict.nav.insights} />  
         <ArticleBody blocks={article.body} tags={article.tags} dict={dict} title={post.title} />
        <RelatedInsights posts={related} dict={dict} locale={locale} />
        <InsightsCta dict={dict} />
      </main>
      <Footer dict={dict} locale={locale} />
      <WhatsAppButton dict={dict} />
    </>
  );
}