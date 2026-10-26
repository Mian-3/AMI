// Sections of each public page that the admin can hide or delete.
// Ids are "<page>.<section>". Safe to import from server and client code.
export const LAYOUT_KEY = "layout:sections";

export const LAYOUT_PAGES = [
  { id: "home", label: "Home", sections: [
    ["hero", "Hero"], ["intro", "Introduction"], ["stats", "Statistics"], ["clients", "Clients"], ["expertise", "Expertise"],
    ["process", "Process"], ["industries", "Industries"], ["events", "Events block"], ["insights", "Insights block"], ["certifications", "Certifications"],
  ] },
  { id: "about", label: "About", sections: [
    ["hero", "Hero"], ["journey", "Journey"], ["meaning", "Meaning"], ["missionVision", "Mission and vision"], ["leadership", "Leadership"],
  ] },
  { id: "flavours", label: "Flavours and Fragrances", sections: [["hero", "Hero"], ["food", "Flavours"], ["fragrance", "Fragrances"]] },
  { id: "process", label: "Our Process", sections: [["hero", "Hero"], ["steps", "Steps"]] },
  { id: "events", label: "Events", sections: [["hero", "Featured event"], ["grid", "Events grid"]] },
  { id: "downloads", label: "Downloads", sections: [["hero", "Hero"], ["library", "Files"], ["cta", "Call to action"]] },
  { id: "insights", label: "Insights", sections: [["hero", "Hero"], ["explorer", "Articles"]] },
  { id: "contact", label: "Contact", sections: [
    ["hero", "Hero"], ["form", "Contact form"], ["locations", "Offices"], ["direct", "Direct contacts"], ["cta", "Call to action"],
  ] },
];

export const ALL_SECTION_IDS = LAYOUT_PAGES.flatMap((p) => p.sections.map(([k]) => `${p.id}.${k}`));
