import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { logout } from "@/app/admin/actions";
import AdminNav from "@/components/admin/AdminNav";

export default async function PanelLayout({ children }) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="flex flex-col gap-4 bg-brand-navy p-4 text-white md:sticky md:top-0 md:h-screen md:w-64 md:shrink-0 md:gap-6 md:p-5">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-orange">AM International</p>
          <p className="text-lg font-bold">Admin</p>
        </div>
        <AdminNav />
        <div className="mt-auto hidden border-t border-white/10 pt-4 md:block">
          <p className="truncate text-sm text-white/80">{session.name || session.email}</p>
          <p className="truncate text-xs text-white/50">{session.email}</p>
          <form action={logout} className="mt-3">
            <button type="submit" className="w-full rounded-lg border border-white/20 px-3 py-2 text-sm text-white transition hover:bg-white/10">
              Log out
            </button>
          </form>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between border-b border-black/5 bg-white px-4 py-3 md:hidden">
          <p className="truncate text-sm text-ink/70">{session.email}</p>
          <form action={logout}>
            <button type="submit" className="rounded-lg border border-black/10 px-3 py-1.5 text-sm">Log out</button>
          </form>
        </div>
        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
