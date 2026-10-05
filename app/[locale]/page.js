import ScrollFx from "@/components/ScrollFx";
import Header from "@/components/Header";
import { getDictionary } from "@/lib/getDictionary";import Hero from "@/components/Hero";
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

export default async function Home({ params }) {
  const { locale } = await params;
  const dict = getDictionary(locale);

  return (
    <>
        <Header dict={dict} locale={locale} />  
                      
            <main>
               <Hero dict={dict} locale={locale} />
               <Intro dict={dict} />
        <Stats dict={dict} />
        <Clients dict={dict} locale={locale} />       
        <Expertise dict={dict} />   
        <Process dict={dict} />    
        <Industries dict={dict} />       
                <Events dict={dict} />
        <Insights dict={dict} />
        <Certifications dict={dict} />
        <WhatsAppButton dict={dict} />
      </main>
      <Footer dict={dict} locale={locale} />    </>
  );
}