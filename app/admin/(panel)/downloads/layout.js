import { requireSection } from "@/lib/guard";

export default async function DownloadsAdminLayout({ children }) {
  await requireSection("downloads");
  return children;
}
