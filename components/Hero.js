// import Image from "next/image";
// import VideoButton from "@/components/VideoButton";

export default function Hero() {
  return (
    <section className="relative flex min-h-[480px] items-end overflow-hidden bg-brand-navy text-white md:h-[625px]">
      <video src="/videos/hero-video.mp4" poster="/images/hero/hero-bg.jpg" autoPlay muted loop playsInline preload="metadata" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-black/30" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/25 to-transparent" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" aria-hidden="true" />
      <div className="relative mx-auto flex w-full max-w-[1200px] items-end justify-between gap-6 px-4 pb-16 sm:px-6 md:pb-[96px] xl:px-0">
        <div className="max-w-[640px] animate-fade-down motion-reduce:animate-none">
          <p className="mb-3 text-[12px] font-medium uppercase tracking-[0.06em]">AM International</p>
          <h1 className="text-[40px] font-medium leading-[1.1] md:text-[56px] md:leading-[60px]">Home of Flavours &amp; Fragrances</h1>
          <p className="mt-4 text-[15px] md:text-[16px]">Creating Flavours &amp; Fragrances, Enriching Your Brand, since 2004</p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a href="#" className="flex h-9 items-center whitespace-nowrap rounded-md bg-brand-orange px-4 text-[12px] font-medium text-white transition duration-200 hover:-translate-y-0.5 hover:opacity-90 motion-reduce:transition-none motion-reduce:hover:translate-y-0">Request for Sample</a>
            <a href="#" className="flex h-9 items-center whitespace-nowrap rounded-md border border-white/30 bg-white/15 px-4 text-[12px] font-medium text-white backdrop-blur-sm transition duration-200 hover:-translate-y-0.5 hover:bg-white/25 motion-reduce:transition-none motion-reduce:hover:translate-y-0">Download Catalogue →</a>
          </div>
        </div>
      </div>
    </section>
  );
}