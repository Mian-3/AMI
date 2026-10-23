import Image from "next/image";
import Mx from "@/components/Mx";
import { getMedia } from "@/lib/media";

const repeats = [0, 1];

function LogoRow({ clients, hidden = false }) {
  return (
    <ul className="flex shrink-0 items-center gap-4 pr-4" aria-hidden={hidden || undefined}>
      {repeats.map((copy) =>
        clients.map((client, index) => (
         <li
  key={copy + "-" + index + client.src}
className="marquee-item flex h-[52px] shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white p-0 shadow-sm transition-shadow duration-300 hover:shadow-md md:h-[62px] xl:h-[calc((100vw-96px)/6/3.1)]"
>
  <Image
    src={client.src}
    alt={hidden || copy > 0 ? "" : client.name}
    width={960}
    height={400}
    className="h-full w-auto max-w-none object-contain"
  />
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
    <Mx as="section" className="bg-cream pb-14 pt-6">
     <p className="mx-eyebrow mb-6 text-center text-[13px] font-semibold uppercase tracking-[0.08em] text-brand-navy md:text-[12px] xl:text-[14px]">{dict.clients.label}</p>
      <div className="mx-fade marquee-mask overflow-hidden" style={{ "--d": "250ms" }} dir="ltr">
        <div className={"marquee-track flex w-max motion-reduce:animate-none " + (isRtl ? "animate-marquee-reverse" : "animate-marquee")}>
          <LogoRow clients={clients} />
          <LogoRow clients={clients} hidden />
        </div>
      </div>
    </Mx>
  );
}