import Image from "next/image";
import Reveal from "@/components/Reveal";

const clients = [
  { name: "Candyland", src: "/images/clients/client-1.png" },
  { name: "Gourmet Foods", src: "/images/clients/client-2.png" },
  { name: "Nestle", src: "/images/clients/client-3.png" },
  { name: "Fauji", src: "/images/clients/client-4.png" },
  { name: "Menu", src: "/images/clients/client-5.png" },
  { name: "Dawn", src: "/images/clients/client-6.png" },
  { name: "Client 7", src: "/images/clients/client-7.png" },
  { name: "Client 8", src: "/images/clients/client-8.png" },
];

const repeats = [0, 1];

function LogoRow({ hidden = false }) {
  return (
    <ul className="flex shrink-0 items-center gap-4 pr-4" aria-hidden={hidden || undefined}>
      {repeats.map((copy) =>
        clients.map((client) => (
          <li key={copy + client.name} className="marquee-item flex h-[56px] w-[130px] shrink-0 items-center justify-center rounded-lg bg-white px-3 shadow-sm transition-shadow duration-300 hover:shadow-md">
            <Image src={client.src} alt={hidden || copy > 0 ? "" : client.name} width={300} height={120} className="max-h-[40px] w-auto object-contain" />
          </li>
        ))
      )}
    </ul>
  );
}

export default function Clients({ dict, locale }) {
  const isRtl = locale === "ar";

  return (
    <section className="bg-cream pb-14 pt-6">
      <Reveal as="p" className="mb-6 text-center text-[10px] font-medium uppercase tracking-[0.08em] text-brand-navy">{dict.clients.label}</Reveal>
      <div className="marquee-mask overflow-hidden" dir="ltr">
        <div className={"marquee-track flex w-max motion-reduce:animate-none " + (isRtl ? "animate-marquee-reverse" : "animate-marquee")}>
          <LogoRow />
          <LogoRow hidden />
        </div>
      </div>
    </section>
  );
}