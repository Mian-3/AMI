"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { LAND_RINGS } from "@/lib/landData";
import Reveal from "@/components/Reveal";

const MAP_SRC = "/images/contact/contact-map.webp";

// Pin positions as a percentage of the map image (1920 x 626 design crop)
const PINS = [
  { key: "faisalabad", x: 54.64, y: 31.8 },
  { key: "lahore", x: 57.34, y: 37.4 },
  { key: "karachi", x: 45.26, y: 81.8 },
];

const RAD = Math.PI / 180;

// Graticule every 15 degrees, as lists of [lon, lat, lon, lat, ...] (kept in degrees)
const GRID = [];
for (let lon = -180; lon < 180; lon += 15) {
  const pts = [];
  for (let lat = -90; lat <= 90; lat += 3) pts.push(lon, lat);
  GRID.push([pts, 0]);
}
for (let lat = -75; lat <= 75; lat += 15) {
  const pts = [];
  for (let lon = -180; lon <= 180; lon += 3) pts.push(lon, lat);
  GRID.push([pts, 0]);
}

// Land as a dot matrix: land outlines are rasterised once, then sampled on an even lon/lat grid
const DOT_CACHE = {};
function buildDots(step) {
  if (DOT_CACHE[step]) return DOT_CACHE[step];
  const W = 1440;
  const H = 720;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const x = c.getContext("2d", { willReadFrequently: true });
  x.fillStyle = "#000";
  for (const ring of LAND_RINGS) {
    const pts = [];
    let prev = null;
    let off = 0;
    let minLat = 90;
    for (let i = 0; i < ring.length; i += 2) {
      const lon = ring[i] / 10;
      const lat = ring[i + 1] / 10;
      if (prev !== null) {
        if (lon + off - prev > 180) off -= 360;
        else if (lon + off - prev < -180) off += 360;
      }
      prev = lon + off;
      if (lat < minLat) minLat = lat;
      pts.push([prev, lat]);
    }
    if (minLat < -60) continue; // Antarctica is far outside the visible cap
    for (const sh of [-360, 0, 360]) {
      x.beginPath();
      pts.forEach(([L, lat], k) => {
        const px = ((L + sh + 180) / 360) * W;
        const py = ((90 - lat) / 180) * H;
        if (k) x.lineTo(px, py);
        else x.moveTo(px, py);
      });
      x.closePath();
      x.fill();
    }
  }
  const d = x.getImageData(0, 0, W, H).data;
  const out = [];
  for (let lat = -10; lat <= 82; lat += step) {
    const rowStep = step / Math.max(Math.cos(lat * RAD), 0.25);
    for (let lon = -180; lon < 180; lon += rowStep) {
      const px = Math.min(W - 1, Math.floor(((lon + 180) / 360) * W));
      const py = Math.min(H - 1, Math.floor(((90 - lat) / 180) * H));
      if (d[(py * W + px) * 4 + 3] > 128) out.push(lon * RAD, lat * RAD);
    }
  }
  DOT_CACHE[step] = Float32Array.from(out);
  return DOT_CACHE[step];
}

const CSS = `
@keyframes cl-wipe{from{clip-path:inset(0 100% 0 0);opacity:0;transform:scale(.94) translateY(18px)}60%{opacity:1}to{clip-path:inset(0 0 0 0);opacity:1;transform:none}}
@keyframes cl-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
@keyframes cl-shine{from{background-position:160% 0}to{background-position:-60% 0}}
@keyframes cl-globe-in{from{opacity:0;transform:scale(.96)}to{opacity:1;transform:none}}
@keyframes cl-pin-drop{from{opacity:0;transform:translateY(-14px) scale(.6)}to{opacity:1;transform:none}}
@keyframes cl-line{from{transform:scaleX(0)}to{transform:scaleX(1)}}
.cl-wipe{animation:cl-wipe 1.5s cubic-bezier(.2,.8,.2,1) both}
.cl-float{animation:cl-float 7s ease-in-out 1.8s infinite}
.cl-shine{background-image:linear-gradient(105deg,transparent 42%,rgba(255,255,255,.55) 50%,transparent 58%);background-size:260% 100%;background-repeat:no-repeat;animation:cl-shine 6.5s ease-in-out 2.2s infinite}
.cl-globe-in{animation:cl-globe-in 1.6s ease-out both}
.cl-pin-drop{animation:cl-pin-drop .7s cubic-bezier(.2,.8,.2,1) both}
.cl-line{transform-origin:left;animation:cl-line .9s cubic-bezier(.2,.8,.2,1) both}
[dir=rtl] .cl-line{transform-origin:right}
@media (prefers-reduced-motion:reduce){.cl-wipe,.cl-float,.cl-shine,.cl-globe-in,.cl-pin-drop,.cl-line{animation:none}}
`;

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="rtl:-scale-x-100">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

/* ---------- Pakistan layer: lifts the orange map out of the flat design image ---------- */
function morph(src, w, h, r, grow) {
  const tmp = new Uint8ClampedArray(src.length);
  const out = new Uint8ClampedArray(src.length);
  for (let y = 0; y < h; y++) {
    const row = y * w;
    for (let x = 0; x < w; x++) {
      let v = grow ? 0 : 255;
      const a = Math.max(0, x - r);
      const b = Math.min(w - 1, x + r);
      for (let i = a; i <= b; i++) {
        const p = src[row + i];
        if (grow ? p > v : p < v) v = p;
      }
      tmp[row + x] = v;
    }
  }
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) {
      let v = grow ? 0 : 255;
      const a = Math.max(0, y - r);
      const b = Math.min(h - 1, y + r);
      for (let i = a; i <= b; i++) {
        const p = tmp[i * w + x];
        if (grow ? p > v : p < v) v = p;
      }
      out[y * w + x] = v;
    }
  }
  return out;
}

async function buildPakistanLayer(src) {
  const img = new window.Image();
  img.src = src;
  await img.decode();
  const w = Math.min(img.naturalWidth, 1920);
  const h = Math.round((img.naturalHeight * w) / img.naturalWidth);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(img, 0, 0, w, h);
  const data = ctx.getImageData(0, 0, w, h);
  const px = data.data;
  const n = w * h;
  const alpha = new Uint8ClampedArray(n);
  for (let i = 0; i < n; i++) {
    const v = px[i * 4] - px[i * 4 + 2]; // orange has a big red-minus-blue gap, the pale background and white borders do not
    alpha[i] = Math.max(0, Math.min(255, ((v - 70) * 255) / 70));
  }
  // closing: bridges the thin white province borders so the shape stays solid
  const closed = morph(morph(alpha, w, h, 3, true), w, h, 3, false);
  let solid = 0;
  for (let i = 0; i < n; i++) {
    const a = closed[i];
    if (a > 128) solid++;
    if (a < 250) {
      px[i * 4] = 242;
      px[i * 4 + 1] = 138;
      px[i * 4 + 2] = 53;
    }
    px[i * 4 + 3] = a;
  }
  const cover = solid / n;
  if (cover < 0.02 || cover > 0.5) throw new Error("unexpected map coverage");
  ctx.putImageData(data, 0, 0);
  return { canvas, url: canvas.toDataURL("image/png") };
}

/* ---------- Slowly turning earth behind the map ---------- */
function Globe({ run }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext("2d");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let visible = true;
    let w = 0;
    let h = 0;
    let dpr = 1;
    const start = performance.now();

    function size() {
      const r = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    }

    // Orthographic globe: view centre at (lon0, lat0), points on the far side are skipped.
    const lat0 = -40 * RAD;
    const sin0 = Math.sin(lat0);
    const cos0 = Math.cos(lat0);

    function drawLine(points, R, cx, cy, lon0) {
      let pen = false;
      for (let i = 0; i < points.length; i += 2) {
        const lam = points[i] * RAD - lon0;
        const phi = points[i + 1] * RAD;
        const cosc = sin0 * Math.sin(phi) + cos0 * Math.cos(phi) * Math.cos(lam);
        if (cosc < 0) {
          pen = false;
          continue;
        }
        const X = cx + R * Math.cos(phi) * Math.sin(lam);
        const Y = cy - R * (cos0 * Math.sin(phi) - sin0 * Math.cos(phi) * Math.cos(lam));
        if (pen) ctx.lineTo(X, Y);
        else ctx.moveTo(X, Y);
        pen = true;
      }
    }

    function draw(now) {
      const R = w * 0.88; // sphere radius: only its top cap shows, like the design
      const cx = w / 2;
      const cy = w * 0.131 + R;
      const lon0 = (60 - ((now - start) / 1000) * 3) * RAD; // 360 degrees in 2 minutes
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.clip();

      // sphere body: lit from the top, deeper toward the limb
      const body = ctx.createRadialGradient(cx, cy - R * 0.92, R * 0.05, cx, cy, R);
      body.addColorStop(0, "#fffaf1");
      body.addColorStop(0.55, "#fff1de");
      body.addColorStop(0.9, "#fde4c6");
      body.addColorStop(1, "#f9d4aa");
      ctx.fillStyle = body;
      ctx.fillRect(0, 0, w, h);

      // graticule
      ctx.lineJoin = "round";
      ctx.lineWidth = 0.8;
      ctx.strokeStyle = "rgba(226,150,88,0.3)";
      ctx.beginPath();
      for (const [a] of GRID) drawLine(a, R, cx, cy, lon0);
      ctx.stroke();

      // continents as a dot matrix, foreshortened toward the limb
      const dots = buildDots(w < 800 ? 1.1 : 0.55);
      const sp = R * (w < 800 ? 1.1 : 0.55) * RAD;
      const rad = Math.max(0.55, sp * 0.2);
      ctx.fillStyle = "rgba(236,128,44,0.55)";
      ctx.beginPath();
      for (let i = 0; i < dots.length; i += 2) {
        let lam = dots[i] - lon0;
        if (lam > Math.PI) lam -= 2 * Math.PI;
        else if (lam < -Math.PI) lam += 2 * Math.PI;
        if (lam > 1.7 || lam < -1.7) continue;
        const phi = dots[i + 1];
        const cosc = sin0 * Math.sin(phi) + cos0 * Math.cos(phi) * Math.cos(lam);
        if (cosc < 0.04) continue;
        const X = cx + R * Math.cos(phi) * Math.sin(lam);
        const Y = cy - R * (cos0 * Math.sin(phi) - sin0 * Math.cos(phi) * Math.cos(lam));
        if (Y < -4 || Y > h + 4) continue;
        const r = rad * (0.45 + 0.55 * cosc);
        ctx.moveTo(X + r, Y);
        ctx.arc(X, Y, r, 0, Math.PI * 2);
      }
      ctx.fill();

      // coastlines, faint, to keep the shapes readable
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(226,140,70,0.34)";
      ctx.beginPath();
      for (const ring of LAND_RINGS) {
        drawLine(ring.map((v) => v / 10), R, cx, cy, lon0);
      }
      ctx.stroke();

      // soft shade near the limb so it reads as a sphere
      const shade = ctx.createRadialGradient(cx, cy, R * 0.86, cx, cy, R);
      shade.addColorStop(0, "rgba(224,140,70,0)");
      shade.addColorStop(1, "rgba(224,140,70,0.22)");
      ctx.fillStyle = shade;
      ctx.fillRect(0, 0, w, h);
      ctx.restore();

      // atmosphere glow and rim light on the arc
      const glow = ctx.createRadialGradient(cx, cy, R, cx, cy, R + w * 0.03);
      glow.addColorStop(0, "rgba(242,138,53,0.22)");
      glow.addColorStop(1, "rgba(242,138,53,0)");
      ctx.beginPath();
      ctx.arc(cx, cy, R + w * 0.03, Math.PI * 1.15, Math.PI * 1.85);
      ctx.strokeStyle = glow;
      ctx.lineWidth = w * 0.03;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, cy, R - 0.5, Math.PI * 1.15, Math.PI * 1.85);
      ctx.strokeStyle = "rgba(242,138,53,0.38)";
      ctx.lineWidth = 1.2;
      ctx.stroke();
    }

    function loop(now) {
      if (visible) draw(now);
      raf = requestAnimationFrame(loop);
    }

    size();
    draw(performance.now());
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
    });
    io.observe(canvas);
    const ro = new ResizeObserver(() => {
      size();
      draw(performance.now());
    });
    ro.observe(canvas);
    if (run && !reduce) raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
    };
  }, [run]);

  return <canvas ref={ref} aria-hidden="true" className="absolute inset-0 h-full w-full" />;
}

function Pin({ pin, label, index, ready, active, onActive }) {
  return (
    <div className="absolute z-20" style={{ left: `${pin.x}%`, top: `${pin.y}%` }}>
      <div className={ready ? "cl-pin-drop" : "opacity-0"} style={{ animationDelay: `${1100 + index * 220}ms` }}>
        <div className="group relative" onMouseEnter={() => onActive(pin.key)} onMouseLeave={() => onActive(null)}>
          <span
            className={`absolute -left-[0.3125rem] -top-[0.3125rem] block h-[0.625rem] w-[0.625rem] rounded-full shadow-[0_0_0_2px_rgba(0,0,0,0.12)] transition duration-300 max-md:h-[0.4rem] max-md:w-[0.4rem] ${active ? "scale-[1.6] bg-white" : "bg-white"}`}
          />
          <span className="absolute -left-[0.3125rem] -top-[0.3125rem] block h-[0.625rem] w-[0.625rem] animate-ping rounded-full bg-white/80 motion-reduce:animate-none max-md:h-[0.4rem] max-md:w-[0.4rem]" aria-hidden="true" />
          <span
            className={`absolute left-[0.9em] top-0 -translate-y-1/2 whitespace-nowrap rounded-[0.2rem] px-[0.7em] py-[0.35em] text-[clamp(0.4375rem,0.78vw,0.9375rem)] font-semibold uppercase tracking-[0.14em] text-white transition-all duration-300 before:absolute before:-left-[0.5em] before:top-1/2 before:-translate-y-1/2 before:border-y-[0.5em] before:border-e-[0.55em] before:border-y-transparent before:transition-colors before:duration-300 before:content-[''] ${
              active ? "translate-x-1 bg-brand-navy before:border-e-brand-navy" : "bg-[#201e1e] before:border-e-[#201e1e]"
            }`}
          >
            {label}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function ContactLocations({ dict }) {
  const c = dict.contactPage.locations;
  const [active, setActive] = useState(null);
  const [inView, setInView] = useState(false);
  const [layer, setLayer] = useState(null); // { url } once the Pakistan layer is ready
  const band = useRef(null);
  const holder = useRef(null);

  useEffect(() => {
    const el = band.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    let dead = false;
    buildPakistanLayer(MAP_SRC)
      .then(({ canvas, url }) => {
        if (dead) return;
        canvas.className = "absolute inset-0 h-full w-full";
        setLayer({ url, canvas });
      })
      .catch(() => {
        // Keep the original flat image if the map cannot be split (the design still shows exactly as supplied).
      });
    return () => {
      dead = true;
    };
  }, []);

  useEffect(() => {
    if (layer && holder.current && !holder.current.contains(layer.canvas)) {
      holder.current.innerHTML = "";
      holder.current.appendChild(layer.canvas);
    }
  }, [layer]);

  const ready = !!layer && inView;

  return (
    <section className="bg-[#fcfcfa]">
      <style>{CSS}</style>
      <div className="px-4 pb-8 pt-16 text-center sm:px-6 md:pt-[6.9rem]">
        <Reveal as="p" className="mb-3 text-[12px] font-semibold uppercase tracking-[0.2em] text-[#4b5563] rtl:tracking-normal md:text-[13px]">
          {c.eyebrow}
        </Reveal>
        <Reveal as="h2" delay={100} className="text-[28px] font-bold leading-[1.2] text-brand-navy sm:text-[34px] md:text-[38px] xl:text-[40px] xl:leading-[48px]">
          {c.heading}
        </Reveal>
        <Reveal as="p" delay={200} className="mt-4 text-[16px] font-semibold leading-[1.4] text-brand-orange md:text-[17px] xl:text-[19px] xl:leading-[28px]">
          {c.sub}
        </Reveal>
        <Reveal as="p" delay={300} className="mx-auto mt-3 max-w-[38rem] text-[14px] leading-[1.7] text-[#737878] xl:text-[16px] xl:leading-[26px]">
          {c.paragraph}
        </Reveal>
      </div>

      {/* Map band */}
      <div ref={band} className="relative w-full overflow-hidden" dir="ltr">
        <div className="relative aspect-[1920/626] w-full">
          {/* Original design image: shown as supplied until the animated layers are ready (and kept if they cannot be built) */}
          <Image
            src={MAP_SRC}
            alt="Map of Pakistan with AM International office locations"
            fill
            sizes="100vw"
            className={`object-cover transition-opacity duration-700 ${layer ? "opacity-0" : "opacity-100"}`}
          />

          {layer ? (
            <>
              <div className={`absolute inset-0 ${ready ? "cl-globe-in" : "opacity-0"}`}>
                <Globe run={ready} />
              </div>
              <div className={`absolute inset-0 z-10 ${ready ? "cl-wipe" : "opacity-0"}`}>
                <div className={ready ? "cl-float absolute inset-0" : "absolute inset-0"}>
                  <div ref={holder} className="absolute inset-0" />
                  <div
                    aria-hidden="true"
                    className="cl-shine pointer-events-none absolute inset-0"
                    style={{ WebkitMaskImage: `url(${layer.url})`, maskImage: `url(${layer.url})`, WebkitMaskSize: "100% 100%", maskSize: "100% 100%" }}
                  />
                  {PINS.map((pin, index) => (
                    <Pin key={pin.key} pin={pin} label={c.items.find((item) => item.key === pin.key).city} index={index} ready={ready} active={active === pin.key} onActive={setActive} />
                  ))}
                </div>
              </div>
            </>
          ) : (
            PINS.map((pin, index) => (
              <Pin key={pin.key} pin={pin} label={c.items.find((item) => item.key === pin.key).city} index={index} ready={inView} active={active === pin.key} onActive={setActive} />
            ))
          )}
        </div>
      </div>

      {/* Offices card, overlapping into the orange band below */}
      <div className="bg-[linear-gradient(to_bottom,#fef4e5_0,#fef4e5_8rem,#f28a35_8rem)] px-4 sm:px-6 md:bg-[linear-gradient(to_bottom,#fef4e5_0,#fef4e5_13.25rem,#f28a35_13.25rem)] xl:px-0">
        <Reveal className="mx-auto max-w-[75rem]">
          <div className="rounded-b-[2.5rem] rounded-t-[1.5rem] bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.06)] md:rounded-t-[2.5rem] md:p-[3.125rem] md:pt-[3.5rem]">
            <h3 className="relative inline-block pb-3 text-[20px] font-semibold leading-[1.3] text-brand-orange xl:text-[22px] xl:leading-[30px]">
              {c.cardHeading}
              <span aria-hidden="true" className="cl-line absolute bottom-0 start-0 h-[2px] w-full bg-brand-orange/30" style={{ animationDelay: "500ms" }} />
            </h3>
            <div className="mt-6 grid gap-10 md:mt-8 md:grid-cols-[342fr_392fr_366fr] md:gap-8">
              {c.items.map((office, index) => {
                const on = active === office.key;
                return (
                  <Reveal key={office.key} delay={150 + index * 130}>
                    <div onMouseEnter={() => setActive(office.key)} onMouseLeave={() => setActive(null)} className="group relative">
                      <span aria-hidden="true" className={`absolute -top-4 start-0 h-[2px] bg-brand-orange transition-all duration-500 ease-out ${on ? "w-full" : "w-8 group-hover:w-full"}`} />
                      <p className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.04em] text-[#4b5563] rtl:tracking-normal">
                        <span className={`h-1.5 w-1.5 rounded-full bg-brand-orange transition-transform duration-300 ${on ? "scale-150" : ""}`} />
                        {office.label}
                      </p>
                      <p className={`mt-2 text-[22px] font-bold leading-[1.2] transition-colors duration-300 xl:text-[24px] xl:leading-[30px] ${on ? "text-brand-orange" : "text-brand-navy group-hover:text-brand-orange"}`}>{office.city}</p>
                      <p className="mt-3 max-w-[22rem] text-[14px] leading-[1.6] text-[#737878] xl:text-[15px] xl:leading-[24px]">{office.address}</p>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(office.mapsQuery)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/link mt-5 inline-flex items-center gap-1.5 text-[14px] font-medium text-brand-orange transition-colors hover:text-brand-orange/80"
                      >
                        {c.directions}
                        <span className="transition-transform duration-300 group-hover/link:translate-x-1 rtl:group-hover/link:-translate-x-1"><ArrowIcon /></span>
                      </a>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}