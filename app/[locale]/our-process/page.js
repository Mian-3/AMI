import Header from "@/components/Header";
import { getLayout, shown } from "@/lib/sectionLayout";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ProcessHero from "@/components/ProcessHero";
import ProcessSteps from "@/components/ProcessSteps";
import { getDictionary } from "@/lib/getDictionary";
import { PROCESS_CSS } from "@/lib/processStyles";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  return {
    title: locale === "ar" ? "عمليتنا | A.M International" : "Our Process | A.M International",
    description:
      locale === "ar"
        ? "من البحث والتطوير إلى مراقبة الجودة، تعرف على كيف تنتقل A.M International من الحاجة إلى الحل."
        : "From research and development to quality control, see how A.M International moves from need to solution.",
  };
}

export default async function OurProcessPage({ params }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const L = await getLayout();

  return (
    <>
      <Header dict={dict} locale={locale} active="process" />
      <main className="pr">
        <style dangerouslySetInnerHTML={{ __html: PROCESS_CSS }} />
        <noscript>
          <style>{`.pr-a,.pr-wipe,.pr-wipe-img,.pr-bar,.pr-digits-in{opacity:1!important;transform:none!important;clip-path:none!important}`}</style>
        </noscript>
        {shown(L, "process.hero") && <ProcessHero dict={dict} />}
        {shown(L, "process.steps") && <ProcessSteps dict={dict} />}
      </main>
      <Footer dict={dict} locale={locale} />
      <WhatsAppButton dict={dict} />
    </>
  );
}
