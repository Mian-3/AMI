import { requireSection } from "@/lib/guard";

export default async function SectionLayout({ children }) {
  await requireSection("media");
  return children;
}
