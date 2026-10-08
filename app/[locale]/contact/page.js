import { getDictionary } from "@/lib/getDictionary";
import Header from "@/components/Header";
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
    title: locale === "ar" ? "اتصل بنا | AM International" : "Contact Us | AM International",
    description:
      locale === "ar"
        ? "تواصل مع فريق AM International للنكهات والعطور."
        : "Talk to the AM International team about flavours, fragrances and tailored ingredient solutions.",
  };
}

export default async function ContactPage({ params }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return (
    <>
      <Header dict={dict} locale={locale} active="contact" />
      <main>
        <ContactHero dict={dict} />
        <ContactForm dict={dict} />
        <ContactLocations dict={dict} />
        <ContactDirect dict={dict} />
        <ContactCta dict={dict} />
      </main>
      <Footer dict={dict} locale={locale} />
<WhatsAppButton dict={dict} />    </>
  );
}
