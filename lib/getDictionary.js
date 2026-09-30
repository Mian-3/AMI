import en from "@/lib/dictionaries/en";
import ar from "@/lib/dictionaries/ar";

const dictionaries = { en, ar };

export function getDictionary(locale) {
  return dictionaries[locale] || dictionaries.en;
}