import Reveal from "@/components/Reveal";

export default function Intro() {
  return (
    <section className="bg-offwhite px-4 pb-14 pt-16 sm:px-6 md:pt-[72px] xl:px-0">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center text-center">
        <Reveal as="p" className="mb-3 text-[11px] font-medium uppercase tracking-[0.08em] text-brand-navy">More Than Ingredients.</Reveal>
        <Reveal as="h2" delay={100} className="max-w-[660px] text-[26px] font-semibold leading-[1.25] text-brand-navy md:text-[32px] md:leading-[40px]">Creating Flavours, Fragrances &amp; Ingredient Solutions That Bring Brands to Life</Reveal>
        {/* <Reveal as="p" delay={200} className="mt-5 max-w-[640px] text-[14px] leading-[22px] text-ink/60">We help businesses create products people can taste, smell, experience and remember.</Reveal> */}
        <Reveal as="p" delay={300} className="mt-4 max-w-[640px] text-[14px] leading-[22px] text-ink/60">We help businesses create products people can taste, smell, experience and remember. From flavour and fragrance to functional ingredients, AM International brings together quality, expertise and innovation to help products stand out.</Reveal>
        <Reveal delay={400} className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <a href="#" className="flex h-9 items-center whitespace-nowrap rounded-md bg-brand-orange px-4 text-[12px] font-medium text-white transition duration-200 hover:-translate-y-0.5 hover:opacity-90 motion-reduce:transition-none motion-reduce:hover:translate-y-0">Discover AM International</a>
          <a href="#" className="flex h-9 items-center whitespace-nowrap rounded-md border border-brand-navy/20 px-4 text-[12px] font-medium text-brand-navy transition duration-200 hover:-translate-y-0.5 hover:bg-brand-navy/5 motion-reduce:transition-none motion-reduce:hover:translate-y-0">Download Catalogue →</a>
        </Reveal>
      </div>
    </section>
  );
}