"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const FRAME = 7 / 5; // every card uses the same frame so all cards line up
const SLACK = 0.15; // pictures this close to the frame shape fill it edge to edge

// Pictures close to the frame shape fill it completely (no gaps). Pictures with a very different
// shape are shown whole on a soft blur of themselves, so nothing important is cut off.
export default function InsightImage({ src, alt, sizes, children }) {
  const box = useRef(null);
  const [fit, setFit] = useState("cover");

  const judge = (img) => {
    if (!img?.naturalWidth || !img?.naturalHeight) return;
    const ratio = img.naturalWidth / img.naturalHeight;
    setFit(Math.abs(ratio - FRAME) / FRAME <= SLACK ? "cover" : "contain");
  };

  useEffect(() => {
    const img = box.current?.querySelector("img[data-main]");
    if (img?.complete) judge(img);
  }, [src]);

  return (
    <div ref={box} className="relative aspect-[7/5] w-full shrink-0 overflow-hidden bg-[#f1ece3]">
      {fit === "contain" ? <Image src={src} alt="" aria-hidden="true" fill sizes={sizes} className="scale-110 object-cover opacity-60 blur-xl" /> : null}
      <Image
        data-main
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        onLoad={(e) => judge(e.currentTarget)}
        className={`${fit === "contain" ? "object-contain" : "object-cover"} transition duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transition-none`}
      />
      {children}
    </div>
  );
}
