// Default dictionary (from the files) + text changes saved in the admin.
// The original getDictionary now lives in lib/baseDictionary.js.

import { getDictionary as getBaseDictionary } from "@/lib/baseDictionary";
import { getOverrides, deepMerge } from "@/lib/siteContent";

export async function getDictionary(locale) {
  const base = await getBaseDictionary(locale);
  const lang = locale === "ar" ? "ar" : "en";
  const overrides = await getOverrides();

  let out = base;
  for (const [key, value] of Object.entries(overrides)) {
    const override = value?.[lang];
    if (override && base[key] !== undefined) out = { ...out, [key]: deepMerge(base[key], override) };
  }
  return out;
}
