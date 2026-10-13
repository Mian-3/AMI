"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { HEARTBEAT_MS } from "@/lib/activityShared";

// Tells the server this person is here. Only pings while the tab is visible,
// so "online" means someone is actually looking at the admin.
export default function Heartbeat() {
  const pathname = usePathname();

  useEffect(() => {
    let stopped = false;
    const ping = () => {
      if (stopped || document.visibilityState !== "visible") return;
      fetch("/api/admin/ping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: pathname }),
        keepalive: true,
      }).catch(() => {});
    };
    ping();
    const timer = setInterval(ping, HEARTBEAT_MS);
    document.addEventListener("visibilitychange", ping);
    return () => {
      stopped = true;
      clearInterval(timer);
      document.removeEventListener("visibilitychange", ping);
    };
  }, [pathname]);

  return null;
}
