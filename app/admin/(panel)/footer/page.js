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
      <FooterContactForm initial={value} edited={Boolean(saved)} address={dict.footer.address} />
    </div>
  );
}
