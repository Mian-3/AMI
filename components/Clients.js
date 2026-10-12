import Image from "next/image";
import Reveal from "@/components/Reveal";
import { getMedia } from "@/lib/media";

const repeats = [0, 1];

function LogoRow({ clients, hidden = false }) {
  return (
    <ul className="flex shrink-0 items-center gap-4 pr-4" aria-hidden={hidden || undefined}>
      {repeats.map((copy) =>
        clients.map((client, index) => (
          <li key={copy + "-" + index + client.src} className="marquee-item flex h-[56px] w-[130px] shrink-0 items-center justify-center rounded-lg bg-white px-3 shadow-sm transition-shadow duration-300 hover:shadow-md">
            <Image src={client.src} alt={hidden || copy > 0 ? "" : client.name} width={340} height={160} className="max-h-[80px] w-auto object-contain" />
          </li>
        ))
      )}
    </ul>
  );
}

export default async function Clients({ dict, locale }) {
  const isRtl = locale === "ar";
  // The logos are managed in the admin under Media and links.
  const { clients } = await getMedia();

  return (
    <section className="bg-cream pb-14 pt-6">
      <Reveal as="p" className="mb-6 text-center text-[10px] font-medium uppercase tracking-[0.08em] text-brand-navy">{dict.clients.label}</Reveal>
      <div className="marquee-mask overflow-hidden" dir="ltr">
        <div className={"marquee-track flex w-max motion-reduce:animate-none " + (isRtl ? "animate-marquee-reverse" : "animate-marquee")}>
          <LogoRow clients={clients} />
          <LogoRow clients={clients} hidden />
        </div>
      </div>
    </section>
  );
}
