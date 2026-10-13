"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

// A link that keeps the visitor's language: href="/flavours-fragrances" becomes
// /en/flavours-fragrances or /ar/flavours-fragrances depending on the current page.
export default function LocaleLink({ href, children, ...props }) {
  const params = useParams();
  const locale = params?.locale === "ar" ? "ar" : "en";
  return (
    <Link href={`/${locale}${href}`} {...props}>
      {children}
    </Link>
  );
}
