// Event card pictures. One admin setting (Photos and links > Event card pictures) picks the look:
//  "fill"    every card has the same 2:1 picture box and the picture fills it (no gap, edges may be trimmed)
//  "whole"   same 3:2 box, whole picture, spare space filled with a soft blur
//  "natural" whole picture in its own proportions, no gap, picture heights may differ between cards
export const CARD_FITS = ["fill", "whole", "natural"];

export function fitBox(fit) {
  if (fit === "whole") return "aspect-[3/2]";
  if (fit === "natural") return "";
  return "aspect-[2/1]";
}

export default function FitImage({ src, alt = "", fit = "fill", tone = "bg-black/5" }) {
  if (fit === "natural") {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} loading="lazy" className="block h-auto w-full" />;
  }
  if (fit === "whole") {
    return (
      <div className={"absolute inset-0 overflow-hidden " + tone}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="" aria-hidden="true" loading="lazy" className="absolute inset-0 h-full w-full scale-125 object-cover opacity-60 blur-xl" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} loading="lazy" className="absolute inset-0 h-full w-full object-contain" />
      </div>
    );
  }
  return (
    <div className={"absolute inset-0 overflow-hidden " + tone}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
    </div>
  );
}
