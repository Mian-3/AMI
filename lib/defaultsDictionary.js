import { getDictionary as getBaseDictionary } from "@/lib/baseDictionary";
import { flavoursPageContent } from "@/lib/flavoursContent";
import { processPageContent } from "@/lib/processContent";
import { aboutLeadershipContent } from "@/lib/aboutLeadershipContent";
import { enquiryContent } from "@/lib/enquiryContent";
import { downloadsPageContent } from "@/lib/downloadsContent";

export async function getDefaultsDictionary(locale) {
  const lang = locale === "ar" ? "ar" : "en";
  const base = await getBaseDictionary(lang);
  return {
    ...base,
    about: { ...(base.about || {}), ...aboutLeadershipContent[lang] },
    flavoursPage: flavoursPageContent[lang],
    processPage: processPageContent[lang],
    enquiryForm: enquiryContent[lang],
    downloadsPage: downloadsPageContent[lang],
  };
}
