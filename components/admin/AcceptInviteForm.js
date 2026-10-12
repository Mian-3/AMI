"use client";

import { useActionState } from "react";
import { acceptInvite } from "@/app/admin/invite/actions";

const FIELD =
  "h-11 w-full rounded-lg border border-black/10 bg-white px-4 text-sm text-ink outline-none transition focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/15";
const LABEL = "mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink/60";

export default function AcceptInviteForm({ token, defaultName }) {
  const [state, formAction, pending] = useActionState(acceptInvite, null);
  return (
    <form action={formAction} className="mt-6 space-y-4">
      <input type="hidden" name="token" value={token} />
      <div>
        <label htmlFor="name" className={LABEL}>Your name</label>
        <input id="name" name="name" defaultValue={defaultName} autoComplete="name" className={FIELD} />
      </div>
      <div>
        <label htmlFor="password" className={LABEL}>Create password (min 10 characters)</label>
        <input id="password" name="password" type="password" required minLength={10} autoComplete="new-password" className={FIELD} />
      </div>
      <div>
        <label htmlFor="confirm" className={LABEL}>Confirm password</label>
        <input id="confirm" name="confirm" type="password" required minLength={10} autoComplete="new-password" className={FIELD} />
      </div>
      {state?.error ? <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p> : null}
      <button type="submit" disabled={pending} className="h-11 w-full rounded-lg bg-brand-orange text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-wait disabled:opacity-70">
        {pending ? "Creating account..." : "Accept and sign in"}
      </button>
    </form>
  );
}
