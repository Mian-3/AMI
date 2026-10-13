import { requireSection } from "@/lib/guard";

export default async function EventsAdminLayout({ children }) {
  await requireSection("events");
  return children;
}
