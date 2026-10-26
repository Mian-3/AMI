import { requireOwner } from "@/lib/guard";

export default async function ReportsLayout({ children }) {
  await requireOwner();
  return children;
}
