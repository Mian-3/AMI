import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Intro from "@/components/Intro";
import Stats from "@/components/Stats";
import Clients from "@/components/Clients";
import Expertise from "@/components/Expertise";
import Process from "@/components/Process";
import Industries from "@/components/Industries";
import Events from "@/components/Events";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Intro />
        <Stats />
        <Clients />
        <Expertise />
        <Process />
        <Industries />
        <Events />
      </main>
      <Footer />
    </>
  );
}