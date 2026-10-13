import { requireSection } from "@/lib/guard";

// The Flavours page settings are part of "Site content" in the team permissions.
export default async function FlavoursAdminLayout({ children }) {
  await requireSection("content");
  return children;
}
