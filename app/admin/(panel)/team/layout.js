import { requireOwner } from "@/lib/guard";

export default async function TeamLayout({ children }) {
  await requireOwner();
  return children;
}
