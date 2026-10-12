"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { setEnquiryStatus } from "@/app/admin/(panel)/enquiries/actions";

// Marks the enquiry as read once the page has been opened.
export default function MarkRead({ id, status }) {
  const router = useRouter();
  useEffect(() => {
    if (status !== "new") return;
    setEnquiryStatus(id, "read").then(() => router.refresh());
  }, [id, status, router]);
  return null;
}
