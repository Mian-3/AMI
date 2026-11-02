// Design fonts: DM Sans for headings, Inter for body text (as in the Figma files).
// Self-hosted (files in lib/fontfiles) so the build never depends on Google Fonts being reachable.
// Import where needed: <div className={inter.className}> ... <h2 className={dmSans.className}>
import localFont from "next/font/local";

export const inter = localFont({ src: "./fontfiles/inter-latin-wght-normal.woff2", weight: "100 900", display: "swap" });
export const dmSans = localFont({ src: "./fontfiles/dm-sans-latin-wght-normal.woff2", weight: "100 1000", display: "swap" });
