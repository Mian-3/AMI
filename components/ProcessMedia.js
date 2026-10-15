"use client";

import { useEffect, useRef, useState } from "react";
import { parseVideo } from "@/lib/videoUrl";

function SoundIcon({ on }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M11 5 6 9H2v6h4l5 4V5Z" />
      {on ? (
        <>
          <path d="M15.5 8.5a5 5 0 0 1 0 7" />
          <path d="M18.5 5.5a9 9 0 0 1 0 13" />
        </>
      ) : (
        <>
          <path d="m22 9-6 6" />
          <path d="m16 9 6 6" />
        </>
      )}
    </svg>
  );
}

// The box next to each step. A video fills the whole box (no bars, no padding), starts by itself, muted,
// loops, and only plays while it is on screen. The sound button turns the sound on if the visitor wants it.
// With only an image it shows the image, and with neither it shows the plain grey box from the design.
export default function ProcessMedia({ image, video, playLabel, title }) {
  const parsed = parseVideo(video);
  const boxRef = useRef(null);
  const videoRef = useRef(null);
  const frameRef = useRef(null);
  const [muted, setMuted] = useState(true);
  const [inView, setInView] = useState(false);

  // play only while visible
  useEffect(() => {
    const el = boxRef.current;
    if (!el || !parsed || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, [parsed?.src]);

  useEffect(() => {
    if (!parsed) return;
    if (parsed.kind === "file") {
      const v = videoRef.current;
      if (!v) return;
      if (inView) {
        const p = v.play();
        if (p && p.catch) p.catch(() => {});
      } else {
        v.pause();
      }
    } else {
      const f = frameRef.current;
      if (f && f.contentWindow) {
        f.contentWindow.postMessage(JSON.stringify({ event: "command", func: inView ? "playVideo" : "pauseVideo", args: [] }), "*");
      }
    }
  }, [inView, parsed?.src, parsed?.kind]);

  function toggleSound() {
    const next = !muted;
    setMuted(next);
    if (parsed?.kind === "file") {
      const v = videoRef.current;
      if (v) {
        v.muted = next;
        if (!next) v.volume = 1;
        const p = v.play();
        if (p && p.catch) p.catch(() => {});
      }
    } else if (parsed?.kind === "youtube") {
      const f = frameRef.current;
      if (f && f.contentWindow) {
        const send = (func, args = []) => f.contentWindow.postMessage(JSON.stringify({ event: "command", func, args }), "*");
        if (next) send("mute");
        else {
          send("unMute");
          send("setVolume", [100]);
        }
        send("playVideo");
      }
    }
  }

  return (
    <div className="pr-media" ref={boxRef}>
      {image && !parsed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt="" loading="lazy" className="pr-media-img" />
      ) : null}

      {parsed?.kind === "file" ? (
        <video
          ref={videoRef}
          className="pr-frame pr-cover"
          src={parsed.src}
          poster={image || undefined}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={title}
        />
      ) : null}

      {parsed?.kind === "youtube" ? (
        <iframe
          ref={frameRef}
          className="pr-frame pr-yt"
          src={parsed.src}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture"
          loading="lazy"
        />
      ) : null}

      {parsed ? (
        <button
          type="button"
          className="pr-sound"
          onClick={toggleSound}
          aria-pressed={!muted}
          aria-label={muted ? "Turn sound on" : "Turn sound off"}
        >
          <SoundIcon on={!muted} />
        </button>
      ) : null}
    </div>
  );
}
