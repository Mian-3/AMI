// The default dictionary (files only, no admin edits) with the page content files added in.
// Used by getDictionary() for the public site and by the Site content editor, so both
// always see the same defaults.

import { getDictionary as getBaseDictionary } from "@/lib/baseDictionary";
import { flavoursPageContent } from "@/lib/flavoursContent";
import { processPageContent } from "@/lib/processContent";
import { aboutLeadershipContent } from "@/lib/aboutLeadershipContent";

export async function getDefaultsDictionary(locale) {
  const lang = locale === "ar" ? "ar" : "en";
  const base = await getBaseDictionary(lang);
  return {
    ...base,
    about: { ...(base.about || {}), ...aboutLeadershipContent[lang] },
    flavoursPage: flavoursPageContent[lang],
    processPage: processPageContent[lang],
  };
}
