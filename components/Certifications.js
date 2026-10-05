import Image from "next/image";
import Reveal from "@/components/Reveal";
import CertificateLink from "@/components/CertificateLink";

const badges = [
  { img: "/images/certifications/Mask group.png", pdf: "/documents/certificates/FSSC Intertek AMI.pdf", alt: "Certification FSSC Intertek AMI" },
  { img: "/images/certifications/Mask group (1).png", pdf: "/documents/certificates/isoqar14001.pdf", alt: "Certification 2" },
  { img: "/images/certifications/Mask group (2).png", pdf: "/documents/certificates/isoqar9001.pdf", alt: "Certification 3" },
  { img: "/images/certifications/Mask group (3).png", pdf: "/documents/certificates/IHC Halal Certificate-AM INTERNATIONAL-2026-2027.pdf", alt: "Certification 4" },
  { img: "/images/certifications/Mask group (4).png", pdf: "/documents/certificates/punjabfoodauth.pdf", alt: "Certification 5" },
];

export default function Certifications({ dict }) {
  return (
    <section className="bg-offwhite px-4 py-16 sm:px-6 md:py-20 xl:px-0">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex flex-col items-center text-center">
          <Reveal as="p" className="mb-3 text-[11px] font-medium uppercase tracking-[0.08em] text-brand-navy">{dict.certifications.eyebrow}</Reveal>
          <Reveal as="h2" delay={100} className="max-w-[560px] text-[26px] font-semibold leading-[1.25] text-brand-navy md:text-[32px] md:leading-[40px]">{dict.certifications.heading}</Reveal>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 sm:gap-8">
          {badges.map((badge, index) => (
            <Reveal key={badge.img} delay={250 + index * 90}>
              <CertificateLink
                pdfSrc={badge.pdf}
                downloadName={`AMI-${badge.alt.replace(/\s+/g, "-")}.pdf`}
                className="group block"
              >
                <div
                  className="relative h-[90px] w-[90px] overflow-hidden rounded-full outline-none transition-transform duration-300 ease-out group-focus-visible:ring-2 group-focus-visible:ring-brand-orange motion-safe:animate-cert-float motion-reduce:animate-none sm:h-[110px] sm:w-[110px]"
                  style={{ animationDelay: `${index * 0.35}s` }}
                >
                  <Image src={badge.img} alt={badge.alt} fill sizes="110px" className="object-contain" />
                </div>
              </CertificateLink>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}