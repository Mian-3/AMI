import Link from "next/link";
import EventForm from "@/components/admin/EventForm";

export default function NewEventPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <Link href="/admin/events" className="text-sm text-ink/60 hover:text-brand-orange">&larr; All events</Link>
      <h1 className="mt-2 text-2xl font-bold text-brand-navy">New event</h1>
      <EventForm event={null} />
    </div>
  );
}
