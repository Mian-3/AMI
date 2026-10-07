import Image from "next/image";
import AboutReveal from "@/components/AboutReveal";

function ClockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 10h18" />
    </svg>
  );
}

export default function ArticleHero({ post, label, image, locale, backLabel }) {
  return (
    <section className="bg-[#f1ece3]">
      <div className="mx-auto max-w-[1100px] px-4 pb-10 pt-8 sm:px-6 sm:pb-14 sm:pt-12">
        <AboutReveal>
          <a
            href={`/${locale}/insights`}
            className="group inline-flex items-center gap-2 text-[12px] font-medium text-brand-navy/70 transition-colors hover:text-brand-orange"
          >
            <span className="inline-block transition-transform duration-300 group-hover:-translate-x-1 rtl:-scale-x-100 rtl:group-hover:translate-x-1">←</span>
            {backLabel}
          </a>
        </AboutReveal>

        <AboutReveal delay={80}>
          <p className="mt-8 flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.18em] text-brand-navy/70">
            <span aria-hidden="true" className="h-[2px] w-8 bg-brand-orange" />
            {label}
          </p>
        </AboutReveal>

        <AboutReveal delay={160}>
          <h1 className="mt-4 max-w-[860px] text-[30px] font-semibold leading-[1.1] text-brand-navy sm:text-[46px]">{post.title}</h1>
        </AboutReveal>

        <AboutReveal delay={240}>
          <p className="mt-5 max-w-[720px] text-[16px] leading-[26px] text-ink/70">{post.excerpt}</p>
        </AboutReveal>

        <AboutReveal delay={320}>
          <div className="mt-6 flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5 text-[12px] text-ink/70">
              <ClockIcon />
              {post.readTime}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5 text-[12px] text-ink/70">
              <CalendarIcon />
              {post.date}
            </span>
          </div>
        </AboutReveal>
      </div>

      <div className="relative h-[260px] w-full overflow-hidden sm:h-[360px] lg:h-[460px]">
        <Image
          src={image}
          alt={post.title}
          fill
          priority
          sizes="100vw"
          className="animate-about-zoom object-cover motion-reduce:animate-none"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
      </div>
    </section>
  );
}