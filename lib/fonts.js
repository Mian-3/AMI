// Design fonts: DM Sans for headings, Inter for body text (as in the Figma files).
// Import where needed: <div className={inter.className}> ... <h2 className={dmSans.className}>
import { Inter, DM_Sans } from "next/font/google";

export const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600"], display: "swap" });
export const dmSans = DM_Sans({ subsets: ["latin"], weight: ["500", "600", "700"], display: "swap" });
