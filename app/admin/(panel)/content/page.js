import { redirect } from "next/navigation";

// The old list of all text sections now lives in the Pages overview.
export default function ContentIndexPage() {
  redirect("/admin/pages");
}
