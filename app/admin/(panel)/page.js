import { count, desc, eq, gte, asc } from "drizzle-orm";
import { getDb, schema } from "@/db";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { getTeamStatus, getRecentActivity } from "@/lib/activity";

const TZ = "Asia/Karachi";

/* ---------- data ---------- */
async function getData() {
  const db = getDb();
  if (!db) return null;
  try {
    const [posts] = await db.select({ n: count() }).from(schema.posts);
    const [published] = await db.select({ n: count() }).from(schema.posts).where(eq(schema.posts.status, "published"));
    const [events] = await db.select({ n: count() }).from(schema.events);
    const [enqNew] = await db.select({ n: count() }).from(schema.enquiries).where(eq(schema.enquiries.status, "new"));
    const [enqAll] = await db.select({ n: count() }).from(schema.enquiries);
    const recentEnq = await db.select().from(schema.enquiries).orderBy(desc(schema.enquiries.createdAt)).limit(5);
    const recentPosts = await db.select().from(schema.posts).orderBy(desc(schema.posts.updatedAt)).limit(4);
    const upcoming = await db.select().from(schema.events).where(gte(schema.events.eventDate, new Date())).orderBy(asc(schema.events.eventDate)).limit(4);
    return {
      posts: posts.n,
      published: published.n,
      events: events.n,
      enqNew: enqNew.n,
      enqAll: enqAll.n,
      recentEnq,
      recentPosts,
      upcoming,
    };
  } catch {
    return null;
  }
}

/* ---------- helpers ---------- */
function greeting() {
  const h = Number(new Intl.DateTimeFormat("en-GB", { hour: "numeric", hour12: false, timeZone: TZ }).format(new Date())) % 24;
  return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
}

function today() {
  return new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: TZ }).format(new Date());
}

function ago(date) {
  const t = new Date(date).getTime();
  if (!t) return "";
  const s = Math.max(0, (Date.now() - t) / 1000);
  if (s < 60) return "Just now";
  if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  if (s < 86400) return `${Math.floor(s / 3600)} h ago`;
  if (s < 86400 * 7) return `${Math.floor(s / 86400)} d ago`;
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", timeZone: TZ }).format(new Date(t));
}

function titleOf(row, fallback) {
  return row?.data?.en?.title || row?.data?.title || fallback || row?.slug || "Untitled";
}

const ICON = {
  insights: <><rect x="3.5" y="3.5" width="13" height="13" rx="2" /><path d="M6.8 7.4h6.4M6.8 10h6.4M6.8 12.6h3.6" /></>,
  events: <><rect x="3.5" y="4.6" width="13" height="11.9" rx="2" /><path d="M3.5 8.4h13M7 3v3M13 3v3" /></>,
  enquiries: <><path d="M3.5 10.6 5.6 4.9a1 1 0 0 1 .94-.65h6.92a1 1 0 0 1 .94.65l2.1 5.7" /><path d="M3.5 10.6v4.6a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.6h-3.7a2.8 2.8 0 0 1-5.6 0H3.5Z" /></>,
  team: <><circle cx="8" cy="7.2" r="2.7" /><path d="M2.9 16c.4-2.6 2.5-4 5.1-4s4.7 1.4 5.1 4" /><path d="M13 4.7a2.5 2.5 0 0 1 0 5M14.3 12.3c1.5.5 2.5 1.7 2.8 3.7" /></>,
  downloads: <path d="M10 3.8v8.4m0 0L6.8 9m3.2 3.2L13.2 9M4 13.6v1.6a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-1.6" />,
  content: <><rect x="3.5" y="3.5" width="13" height="13" rx="2" /><path d="M3.5 7.6h13M7.6 7.6v8.9" /></>,
  media: <><rect x="3.5" y="4" width="13" height="12" rx="2" /><circle cx="7.8" cy="8.2" r="1.2" /><path d="m3.8 14.2 3.7-3.5 2.6 2.4 2.2-2 3.9 3.2" /></>,
  plus: <path d="M10 4.5v11M4.5 10h11" />,
  arrow: <path d="M4.5 10h11m0 0L11 5.5m4.5 4.5L11 14.5" />,
};

function Icon({ name, className = "", size = 18 }) {
  return (
    <svg viewBox="0 0 20 20" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      {ICON[name]}
    </svg>
  );
}

function Card({ title, action, children, className = "" }) {
  return (
    <section className={`min-w-0 rounded-2xl border border-black/[0.07] bg-white ${className}`}>
      <div className="flex items-center justify-between px-5 pb-3 pt-4">
        <h2 className="text-[14px] font-semibold text-ink">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function ViewAll({ href, label = "View all" }) {
  return (
    <Link href={href} className="text-[13px] font-medium text-ink/55 transition-colors hover:text-brand-orange">
      {label}
    </Link>
  );
}

function Pill({ tone, children }) {
  const tones = {
    green: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    orange: "bg-orange-50 text-orange-700",
    gray: "bg-black/[0.05] text-ink/60",
  };
  return <span className={`inline-flex h-6 items-center rounded-full px-2.5 text-[12px] font-medium ${tones[tone] || tones.gray}`}>{children}</span>;
}

/* ---------- page ---------- */
export default async function DashboardPage({ searchParams }) {
  const { denied } = await searchParams;
  const session = await getSession();
  const d = await getData();
  const allowed = session?.sections || [];
  const can = (s) => allowed.includes(s);
  const owner = !!session?.isOwner;

  const team = owner ? await getTeamStatus() : [];
  const online = team.filter((m) => m.online);
  const activity = owner ? (await getRecentActivity(7)) : [];

  const first = (session?.name || "").split(" ")[0];

  const kpis = [
    can("insights") && {
      label: "Insights articles",
      value: d?.posts,
      sub: d ? `${d.published} published, ${Math.max(d.posts - d.published, 0)} draft` : "",
      icon: "insights",
      href: "/admin/insights",
      tint: "bg-sky-50 text-sky-600",
    },
    can("events") && {
      label: "Events",
      value: d?.events,
      sub: d ? `${d.upcoming.length} upcoming` : "",
      icon: "events",
      href: "/admin/events",
      tint: "bg-violet-50 text-violet-600",
    },
    can("enquiries") && {
      label: "New enquiries",
      value: d?.enqNew,
      sub: d ? `${d.enqAll} in total` : "",
      icon: "enquiries",
      href: "/admin/enquiries",
      tint: "bg-orange-50 text-brand-orange",
      hot: d?.enqNew > 0,
    },
    owner && {
      label: "Team online",
      value: online.length,
      sub: team.length ? `of ${team.length} members` : "",
      icon: "team",
      href: "/admin/team",
      tint: "bg-emerald-50 text-emerald-600",
    },
  ].filter(Boolean);

  const actions = [
    can("insights") && { href: "/admin/insights", label: "Write an article", hint: "Publish news on Insights", icon: "insights" },
    can("events") && { href: "/admin/events", label: "Add an event", hint: "Show it on the events page", icon: "events" },
    can("downloads") && { href: "/admin/downloads", label: "Manage downloads", hint: "Catalogues and price lists", icon: "downloads" },
    can("content") && { href: "/admin/content", label: "Edit pages", hint: "Every page and its sections", icon: "content" },
    can("media") && { href: "/admin/media", label: "Media and links", hint: "Hero, logos, social links", icon: "media" },
  ].filter(Boolean);

  const primary = [
    can("insights") && { href: "/admin/insights", label: "New article" },
    can("events") && { href: "/admin/events", label: "Add event" },
  ].filter(Boolean);

  return (
    <div className="mx-auto w-full max-w-[1320px]">
      {/* header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[13px] text-ink/50">{today()}</p>
          <h1 className="mt-1 text-[26px] font-bold leading-8 tracking-[-0.015em] text-brand-navy">
            {greeting()}{first ? `, ${first}` : ""}
          </h1>
          <p className="mt-1 text-[14px] text-ink/60">Here is what is happening on the AM International website.</p>
        </div>
        {primary.length ? (
          <div className="flex flex-wrap gap-2">
            {primary.map((p, i) => (
              <Link
                key={p.href}
                href={p.href}
                className={`inline-flex h-10 items-center gap-2 rounded-lg px-4 text-[13px] font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-navy ${
                  i === 0 ? "bg-brand-navy text-white hover:bg-brand-navy/90" : "border border-black/10 bg-white text-ink hover:bg-black/[0.03]"
                }`}
              >
                <Icon name="plus" size={16} />
                {p.label}
              </Link>
            ))}
          </div>
        ) : null}
      </div>

      {denied ? (
        <p role="alert" className="mt-5 rounded-xl bg-amber-50 px-4 py-3 text-[13px] text-amber-800">
          You do not have access to that section. Ask the owner if you need it.
        </p>
      ) : null}

      {!d ? (
        <p className="mt-5 rounded-xl bg-amber-50 px-4 py-3 text-[13px] text-amber-800">
          The database could not be reached, so the numbers are hidden. Check DATABASE_URL.
        </p>
      ) : null}

      {/* KPIs */}
      {kpis.length ? (
        <div className={`mt-7 grid grid-cols-2 gap-3 sm:gap-4 ${kpis.length >= 4 ? "xl:grid-cols-4" : kpis.length === 3 ? "xl:grid-cols-3" : ""}`}>
          {kpis.map((k) => (
            <Link
              key={k.label}
              href={k.href}
              className="group relative min-w-0 rounded-2xl border border-black/[0.07] bg-white p-4 transition sm:p-5-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_28px_-14px_rgba(10,37,64,0.28)] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              <div className="flex items-start justify-between">
                <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${k.tint}`}>
                  <Icon name={k.icon} size={20} />
                </span>
                {k.hot ? <span className="flex h-6 items-center rounded-full bg-brand-orange px-2.5 text-[11px] font-semibold text-white">Needs reply</span> : null}
              </div>
              <p className="mt-4 text-[13px] text-ink/60">{k.label}</p>
              <p className="mt-1 text-[32px] font-bold leading-9 tracking-[-0.02em] text-brand-navy">{k.value ?? "-"}</p>
              {k.sub ? <p className="mt-1 text-[12px] text-ink/50">{k.sub}</p> : null}
            </Link>
          ))}
        </div>
      ) : null}

      {/* main grid */}
      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="min-w-0 space-y-6">
          {can("enquiries") ? (
            <Card title="Recent enquiries" action={<ViewAll href="/admin/enquiries" />}>
              {d?.recentEnq?.length ? (
                <ul className="divide-y divide-black/5 border-t border-black/5">
                  {d.recentEnq.map((r) => (
                    <li key={r.id}>
                      <Link href="/admin/enquiries" className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-black/[0.02]">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-navy/[0.07] text-[12px] font-bold text-brand-navy">
                          {(r.name || "?").trim().slice(0, 1).toUpperCase()}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className={`block truncate text-[14px] ${r.status === "new" ? "font-semibold text-brand-navy" : "font-medium text-ink/80"}`}>{r.name}</span>
                          <span className="block truncate text-[12px] text-ink/50">{[r.company, r.topic].filter(Boolean).join("  ·  ")}</span>
                        </span>
                        <span className="hidden text-[12px] text-ink/45 sm:block">{ago(r.createdAt)}</span>
                        <Pill tone={r.status === "new" ? "orange" : "gray"}>{r.status === "new" ? "New" : "Read"}</Pill>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="border-t border-black/5 px-5 py-8 text-center text-[13px] text-ink/50">No enquiries yet. Messages from the contact form will appear here.</p>
              )}
            </Card>
          ) : null}

          <div className="grid gap-6 lg:grid-cols-2">
            {can("insights") ? (
              <Card title="Latest articles" action={<ViewAll href="/admin/insights" />}>
                {d?.recentPosts?.length ? (
                  <ul className="divide-y divide-black/5 border-t border-black/5">
                    {d.recentPosts.map((p) => (
                      <li key={p.id}>
                        <Link href={`/admin/insights/${p.id}`} className="flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-black/[0.02]">
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-[14px] font-medium text-ink">{titleOf(p)}</span>
                            <span className="block text-[12px] text-ink/45">Edited {ago(p.updatedAt)}</span>
                          </span>
                          <Pill tone={p.status === "published" ? "green" : "amber"}>{p.status === "published" ? "Published" : "Draft"}</Pill>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="border-t border-black/5 px-5 py-8 text-center text-[13px] text-ink/50">No articles yet.</p>
                )}
              </Card>
            ) : null}

            {can("events") ? (
              <Card title="Upcoming events" action={<ViewAll href="/admin/events" />}>
                {d?.upcoming?.length ? (
                  <ul className="divide-y divide-black/5 border-t border-black/5">
                    {d.upcoming.map((e) => {
                      const dt = e.eventDate ? new Date(e.eventDate) : null;
                      return (
                        <li key={e.id}>
                          <Link href={`/admin/events/${e.id}`} className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-black/[0.02]">
                            <span className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-lg bg-brand-navy/[0.06] text-brand-navy">
                              <span className="text-[10px] font-semibold uppercase leading-3 tracking-wide">
                                {dt ? new Intl.DateTimeFormat("en-GB", { month: "short", timeZone: TZ }).format(dt) : ""}
                              </span>
                              <span className="text-[16px] font-bold leading-5">{dt ? new Intl.DateTimeFormat("en-GB", { day: "numeric", timeZone: TZ }).format(dt) : ""}</span>
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-[14px] font-medium text-ink">{titleOf(e)}</span>
                              <span className="block truncate text-[12px] text-ink/45">{e.data?.en?.venue || ""}</span>
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="border-t border-black/5 px-5 py-8 text-center text-[13px] text-ink/50">No upcoming events.</p>
                )}
              </Card>
            ) : null}
          </div>
        </div>

        {/* side column */}
        <div className="min-w-0 space-y-6">
          {actions.length ? (
            <Card title="Quick actions">
              <ul className="border-t border-black/5 p-2">
                {actions.map((a) => (
                  <li key={a.href}>
                    <Link href={a.href} className="group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-black/[0.035]">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-black/[0.05] text-ink/70 transition-colors group-hover:bg-brand-orange/15 group-hover:text-brand-orange">
                        <Icon name={a.icon} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[14px] font-medium text-ink">{a.label}</span>
                        <span className="block truncate text-[12px] text-ink/50">{a.hint}</span>
                      </span>
                      <Icon name="arrow" size={16} className="text-ink/25 transition-[transform,color] duration-200 group-hover:translate-x-0.5 group-hover:text-ink/60 motion-reduce:transition-none" />
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>
          ) : null}

          {owner ? (
            <Card title="Team" action={<ViewAll href="/admin/team" label="Manage" />}>
              <ul className="border-t border-black/5 p-2">
                {team.length === 0 ? <li className="px-3 py-4 text-[13px] text-ink/50">No team members yet.</li> : null}
                {team.slice(0, 5).map((m) => (
                  <li key={m.id} className="flex items-center gap-3 rounded-xl px-3 py-2">
                    <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-navy/[0.07] text-[12px] font-bold text-brand-navy">
                      {(m.name || "?").trim().slice(0, 1).toUpperCase()}
                      <span className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-white ${m.online ? "bg-emerald-500" : "bg-black/20"}`} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] font-medium text-ink">{m.name}</span>
                      <span className="block truncate text-[12px] text-ink/45">{m.online ? "Online now" : m.lastSeen ? `Seen ${ago(m.lastSeen)}` : "Not signed in yet"}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
          ) : null}

          {owner ? (
            <Card title="Recent activity" action={<ViewAll href="/admin/activity" />}>
              {activity.length ? (
                <ul className="border-t border-black/5 px-5 py-3">
                  {activity.map((a, i) => (
                    <li key={a.id} className="relative flex gap-3 pb-4 last:pb-1">
                      {i < activity.length - 1 ? <span className="absolute left-[4px] top-3 h-full w-px bg-black/10" aria-hidden="true" /> : null}
                      <span className="relative mt-1.5 h-[9px] w-[9px] shrink-0 rounded-full border-2 border-brand-orange bg-white" />
                      <span className="min-w-0 flex-1">
                        <span className="block text-[13px] leading-5 text-ink/80">
                          <span className="font-medium text-ink">{a.name || a.email}</span> {a.action}
                        </span>
                        {a.detail ? <span className="block truncate text-[12px] text-ink/45">{a.detail}</span> : null}
                        <span className="block text-[11px] text-ink/40">{ago(a.at)}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="border-t border-black/5 px-5 py-8 text-center text-[13px] text-ink/50">Nothing yet. Edits made in the admin will show here.</p>
              )}
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  );
}
