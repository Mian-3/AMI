"use client";

import { useState } from "react";
import { parseVideo } from "@/lib/videoUrl";

function PlayIcon() {
  return (
    <svg viewBox="0 0 76 76" fill="none" aria-hidden="true">
      <circle className="ring" cx="38" cy="38" r="36.5" stroke="currentColor" strokeWidth="2.4" fill="rgba(255,255,255,0)" />
      <path d="M31 25.5v25a1.6 1.6 0 0 0 2.5 1.3l19-12.5a1.6 1.6 0 0 0 0-2.6l-19-12.5A1.6 1.6 0 0 0 31 25.5Z" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" />
    </svg>
  );
}

// The grey box next to each step. It shows the image if one is set, a play button when a video is set,
// and the plain grey placeholder (as in the design) when neither is set.
export default function ProcessMedia({ image, video, playLabel, title }) {
  const [playing, setPlaying] = useState(false);
  const parsed = parseVideo(video);

  return (
    <div className="pr-media">
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt="" loading="lazy" className="pr-media-img" />
      ) : null}

      {playing && parsed ? (
        parsed.kind === "youtube" ? (
          <iframe
            className="pr-frame"
            src={parsed.src}
            title={title}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <video className="pr-frame" src={parsed.src} poster={image || undefined} controls autoPlay playsInline />
        )
      ) : parsed ? (
        <button type="button" className="pr-play" onClick={() => setPlaying(true)} aria-label={`${playLabel}: ${title}`}>
          <PlayIcon />
        </button>
      ) : (
        <span className="pr-play" aria-hidden="true">
          <PlayIcon />
        </span>
      )}
    </div>
  );
}
