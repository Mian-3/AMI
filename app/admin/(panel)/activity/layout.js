import { requireOwner } from "@/lib/guard";

export default async function ActivityLayout({ children }) {
  await requireOwner();
  return children;
}
