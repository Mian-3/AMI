import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import CopyLoginLink from "@/components/admin/CopyLoginLink";

export const dynamic = "force-dynamic";

export default async function WelcomePage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const h = await headers();
  const host = h.get("x-forwarded-host") || h.get("host") || "";
  const proto = h.get("x-forwarded-proto") || "https";
  const loginUrl = host ? `${proto}://${host}/admin/login` : "/admin/login";

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-[30rem] rounded-2xl border border-black/5 bg-white p-8 shadow-[0_20px_60px_rgba(10,37,64,0.08)]">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-orange">A.M International</p>
        <h1 className="mt-2 text-2xl font-bold text-brand-navy">Welcome{session.name ? `, ${session.name}` : ""}</h1>
        <p className="mt-1 text-sm text-ink/60">Your account is ready. Here is how to come back any time. You do not need this invitation link again.</p>

        <div className="mt-6 rounded-xl bg-[#fef4e5] p-5">
          <p className="text-sm font-semibold text-brand-navy">Sign in next time</p>
          <ol className="mt-3 space-y-3 text-sm text-ink/75">
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-orange text-xs font-bold text-white">1</span>
              <span>Open the A.M International website and tap the <strong>search</strong> icon at the top.</span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-orange text-xs font-bold text-white">2</span>
              <span>Type <strong>admin</strong> and press Enter.</span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-orange text-xs font-bold text-white">3</span>
              <span>
                Sign in with <strong>{session.email}</strong> and the password you just created.
              </span>
            </li>
          </ol>
        </div>

        <div className="mt-5 space-y-3">
          <p className="text-xs font-medium uppercase tracking-wide text-ink/50">Or save the direct login page</p>
          <p className="break-all rounded-lg bg-black/[0.04] px-3 py-2 text-sm text-ink/70" dir="ltr">{loginUrl}</p>
          <CopyLoginLink url={loginUrl} />
          <p className="text-xs text-ink/50">Tip: press Ctrl + D (Cmd + D on Mac) on that page to bookmark it, or choose Add to Home screen on your phone.</p>
        </div>

        <Link href="/admin" className="mt-6 flex h-11 w-full items-center justify-center rounded-lg bg-brand-orange text-sm font-medium text-white transition hover:opacity-90">
          Go to dashboard
        </Link>
      </div>
    </main>
  );
}
