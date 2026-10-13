import { getRecentActivity, getTeamStatus } from "@/lib/activity";
import ActivityPanel from "@/components/admin/ActivityPanel";

export const dynamic = "force-dynamic";

export default async function ActivityPage() {
  const [team, activity] = await Promise.all([getTeamStatus(), getRecentActivity(150)]);
  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-2xl font-bold text-brand-navy">Activity</h1>
      <p className="mt-1 text-sm text-ink/60">Who is online right now, and who changed what. Updates by itself every 30 seconds.</p>
      <ActivityPanel team={team} activity={activity} nowIso={new Date().toISOString()} />
    </div>
  );
}
