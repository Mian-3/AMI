import Link from "next/link";
import { getDictionary } from "@/lib/getDictionary";
import { getSavedFooterContact, getFooterContact } from "@/lib/footerContactServer";
import FooterContactForm from "@/components/admin/FooterContactForm";

export const dynamic = "force-dynamic";

export default async function FooterAdminPage() {
  const dict = await getDictionary("en");
  const saved = await getSavedFooterContact();
  const value = saved || (await getFooterContact(dict));

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold text-brand-navy">Footer contacts</h1>
      <p className="mt-1 text-sm text-ink/60">The phone numbers and emails shown under "Contact" in the footer of every page.</p>
      <div className="mt-4 flex flex-wrap gap-3 text-sm">
        <Link href="/en" target="_blank" className="rounded-full border border-black/10 bg-white px-4 py-1.5 font-medium transition hover:border-brand-orange hover:text-brand-orange">
          View website
        </Link>
        <Link href="/admin/content/footer" className="rounded-full border border-black/10 bg-white px-4 py-1.5 font-medium transition hover:border-brand-orange hover:text-brand-orange">
          Edit address and link names
        </Link>
      </div>
      <FooterContactForm initial={value} edited={Boolean(saved)} address={dict.footer.address} />
    </div>
  );
}
