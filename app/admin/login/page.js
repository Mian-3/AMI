import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import LoginForm from "@/components/admin/LoginForm";

export default async function LoginPage() {
  const session = await getSession();
  if (session) redirect("/admin");

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-[26rem] rounded-2xl border border-black/5 bg-white p-8 shadow-[0_20px_60px_rgba(10,37,64,0.08)]">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-orange">AM International</p>
        <h1 className="mt-2 text-2xl font-bold text-brand-navy">Admin login</h1>
        <p className="mt-1 text-sm text-ink/60">Sign in to manage the website content.</p>
        <LoginForm />
      </div>
    </main>
  );
}
