import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { logout } from "@/app/admin/actions";
import AdminShell from "@/components/admin/AdminShell";
import Heartbeat from "@/components/admin/Heartbeat";

export default async function PanelLayout({ children }) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  return (
    <>
      <Heartbeat />
      <AdminShell
        user={{ name: session.name || "", email: session.email || "" }}
        sections={session.sections}
        isOwner={session.isOwner}
        logoutAction={logout}
      >
        {children}
      </AdminShell>
    </>
  );
}
