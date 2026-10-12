"use client";

import { createContext, useContext } from "react";
import { MEDIA_DEFAULTS } from "@/lib/mediaShared";

// Defaults are used when no provider is mounted, so the site works either way.
const MediaContext = createContext(MEDIA_DEFAULTS);

export function MediaProvider({ media, children }) {
  return <MediaContext.Provider value={media}>{children}</MediaContext.Provider>;
}

export function useMedia() {
  return useContext(MediaContext);
}
