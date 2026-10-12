import { getDictionary as getBaseDictionary } from "@/lib/baseDictionary";
import { getMedia } from "@/lib/media";
import MediaForm from "@/components/admin/MediaForm";

export const dynamic = "force-dynamic";

export default async function MediaPage() {
  const media = await getMedia();
  const en = await getBaseDictionary("en");
  const labels = {
    fragrances: en.footer.fragrancesLinks,
    foodFlavours: en.footer.foodFlavoursLinks,
    quick: en.footer.quickLinks,
  };

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-2xl font-bold text-brand-navy">Media and links</h1>
      <p className="mt-1 text-sm text-ink/60">
        The catalogue, hero video, social links, footer links and client logos. Changes appear on the live website within seconds.
      </p>
      <MediaForm initial={media} labels={labels} />
    </div>
  );
}
