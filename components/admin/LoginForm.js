"use client";

import { useActionState } from "react";
import { login } from "@/app/admin/actions";

const FIELD =
  "h-11 w-full rounded-lg border border-black/10 bg-white px-4 text-sm text-ink outline-none transition focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/15";

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(login, null);

  return (
    <form action={formAction} className="mt-6 space-y-4">
      <div>
        <label htmlFor="email" className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink/60">Email</label>
        <input id="email" name="email" type="email" required autoComplete="username" className={FIELD} />
      </div>
      <div>
        <label htmlFor="password" className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink/60">Password</label>
        <input id="password" name="password" type="password" required autoComplete="current-password" className={FIELD} />
      </div>
      {state?.error ? (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="h-11 w-full rounded-lg bg-brand-orange text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-wait disabled:opacity-70"
      >
        {pending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
