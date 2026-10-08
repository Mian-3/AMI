import Image from "next/image";
import Reveal from "@/components/Reveal";

const clients = [
  { name: "Client1", src: "/images/clients/1.png" },
  { name: "Client2", src: "/images/clients/2.png" },
  { name: "Client3", src: "/images/clients/3.png" },
  { name: "Client4", src: "/images/clients/4.png" },
  { name: "Client5", src: "/images/clients/5.png" },
  { name: "Client6", src: "/images/clients/6.png" },
  { name: "Client7", src: "/images/clients/7.png" },
  { name: "Client8", src: "/images/clients/8.png" },
  { name: "Client9", src: "/images/clients/9.png" },
   { name: "Client10", src: "/images/clients/10.png" },
  { name: "Client11", src: "/images/clients/11.png" },
  { name: "Client12", src: "/images/clients/12.png" },
  { name: "Client13", src: "/images/clients/13.png" },
    { name: "Client14", src: "/images/clients/14.png" },
  { name: "Client15", src: "/images/clients/15.png" },
  { name: "Client16", src: "/images/clients/16.png" },
  { name: "Client17", src: "/images/clients/17.png" },
  { name: "Client18", src: "/images/clients/18.png" },
     { name: "Client19", src: "/images/clients/19.png" },
   { name: "Client20", src: "/images/clients/20.png" },

];

const repeats = [0, 1];

function LogoRow({ hidden = false }) {
  return (
    <ul className="flex shrink-0 items-center gap-4 pr-4" aria-hidden={hidden || undefined}>
      {repeats.map((copy) =>
        clients.map((client) => (
          <li key={copy + client.name} className="marquee-item flex h-[56px] w-[130px] shrink-0 items-center justify-center rounded-lg bg-white px-3 shadow-sm transition-shadow duration-300 hover:shadow-md">
            <Image src={client.src} alt={hidden || copy > 0 ? "" : client.name} width={340} height={160} className="max-h-[80px] w-auto object-contain" />
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