import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { logout } from "@/app/admin/actions";
import AdminShell from "@/components/admin/AdminShell";
import { getLayout } from "@/lib/sectionLayout";
import Heartbeat from "@/components/admin/Heartbeat";

export default async function PanelLayout({ children }) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const layout = await getLayout();
  const layoutState = Object.fromEntries([...layout.hidden.map((i) => [i, "hidden"]), ...layout.deleted.map((i) => [i, "deleted"])]);
  const canLayout = Boolean(session.isOwner) || (session.sections || []).includes("content");

  return (
    <>
      <Heartbeat />
      <AdminShell
        user={{ name: session.name || "", email: session.email || "" }}
        sections={session.sections}
        isOwner={session.isOwner}
        layoutState={layoutState}
        canLayout={canLayout}
        logoutAction={logout}
      >
        {children}
      </AdminShell>
    </>
  );
}
