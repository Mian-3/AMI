import { getDictionary } from "@/lib/getDictionary";
import Header from "@/components/Header";
import { getLayout, shown } from "@/lib/sectionLayout";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ContactHero from "@/components/ContactHero";
import ContactForm from "@/components/ContactForm";
import ContactLocations from "@/components/ContactLocations";
import ContactDirect from "@/components/ContactDirect";
import ContactCta from "@/components/ContactCta";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  return {
    title: locale === "ar" ? "اتصل بنا | A.M International" : "Contact Us | A.M International",
    description:
      locale === "ar"
        ? "تواصل مع فريق A.M International للنكهات والعطور."
        : "Talk to the A.M International team about flavours, fragrances and tailored ingredient solutions.",
  };
}

export default async function ContactPage({ params }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const L = await getLayout();

  return (
    <>
      <Header dict={dict} locale={locale} active="contact" />
      <main>
        {shown(L, "contact.hero") && <ContactHero dict={dict} />}
        {shown(L, "contact.form") && <ContactForm dict={dict} />}
        {shown(L, "contact.locations") && <ContactLocations dict={dict} />}
        {shown(L, "contact.direct") && <ContactDirect dict={dict} />}
        {shown(L, "contact.cta") && <ContactCta dict={dict} />}
      </main>
      <Footer dict={dict} locale={locale} />
<WhatsAppButton dict={dict} />    </>
  );
}
