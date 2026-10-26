// The admin is organised by website page. Each page has sections, and each section opens
// the editor that already exists for it. Safe to import from server and client code.
//
// section.perm is the team permission needed (same keys as the team settings).

const c = (key) => `/admin/content/${key}`;

export const PAGES = [
  {
    id: "home",
    label: "Home",
    icon: "home",
    live: "",
    blurb: "The landing page: hero, intro, statistics, clients, expertise, process, industries and more.",
    sections: [
      { label: "Layout and visibility", href: `/admin/arrange/home`, perm: "content" },
      { label: "Hero", href: c("hero"), perm: "content" },
      { label: "Intro and Stats", href: "/admin/home", perm: "content" },
      { label: "Clients", href: c("clients"), perm: "content" },
      { label: "Expertise", href: c("expertise"), perm: "content" },
      { label: "Process", href: c("process"), perm: "content" },
      { label: "Industries", href: c("industries"), perm: "content" },
      { label: "Events block", href: c("events"), perm: "content" },
      { label: "Insights block", href: c("insights"), perm: "content" },
      { label: "Certifications", href: c("certifications"), perm: "content" },
    ],
  },
  {
    id: "about",
    label: "About",
    icon: "content",
    live: "/about",
    blurb: "Company story, vision, mission and leadership.",
    sections: [
      { label: "Layout and visibility", href: `/admin/arrange/about`, perm: "content" },
      { label: "About text", href: c("about"), perm: "content" },
    ],
  },
  {
    id: "flavours",
    label: "Flavours and Fragrances",
    short: "Flavours",
    icon: "flavours",
    live: "/flavours-fragrances",
    blurb: "Product tabs, formats, client logos and the page text.",
    sections: [
      { label: "Layout and visibility", href: `/admin/arrange/flavours`, perm: "content" },
      { label: "Products and logos", href: "/admin/flavours", perm: "content" },
      { label: "Page text", href: c("flavoursPage"), perm: "content" },
    ],
  },
  {
    id: "process",
    label: "Our Process",
    icon: "content",
    live: "/our-process",
    blurb: "How a product goes from idea to delivery.",
    sections: [
      { label: "Layout and visibility", href: `/admin/arrange/process`, perm: "content" },{ label: "Process text", href: c("processPage"), perm: "content" }],
  },
  {
    id: "events",
    label: "Events",
    icon: "events",
    live: "/events",
    blurb: "Upcoming and past events, and the page text.",
    sections: [
      { label: "Layout and visibility", href: `/admin/arrange/events`, perm: "content" },
      { label: "Events list", href: "/admin/events", perm: "events" },
      { label: "Page text", href: c("eventsPage"), perm: "content" },
    ],
  },
  {
    id: "downloads",
    label: "Downloads",
    icon: "downloads",
    live: "/downloads",
    blurb: "Catalogues and PDF files, and the page text.",
    sections: [
      { label: "Layout and visibility", href: `/admin/arrange/downloads`, perm: "content" },
      { label: "Files", href: "/admin/downloads", perm: "downloads" },
      { label: "Page text", href: c("downloadsPage"), perm: "content" },
    ],
  },
  {
    id: "insights",
    label: "Insights",
    icon: "insights",
    live: "/insights",
    blurb: "Articles, the listing page and the article page text.",
    sections: [
      { label: "Layout and visibility", href: `/admin/arrange/insights`, perm: "content" },
      { label: "Articles", href: "/admin/insights", perm: "insights" },
      { label: "Listing page text", href: c("insightsPage"), perm: "content" },
      { label: "Article page text", href: c("insightArticle"), perm: "content" },
    ],
  },
  {
    id: "contact",
    label: "Contact",
    icon: "enquiries",
    live: "/contact",
    blurb: "Contact page text and the Request for Sample form.",
    sections: [
      { label: "Layout and visibility", href: `/admin/arrange/contact`, perm: "content" },
      { label: "Contact text", href: c("contactPage"), perm: "content" },
      { label: "Enquiry form", href: c("enquiryForm"), perm: "content" },
    ],
  },
];

// The layout editor entry always comes last in each page's section list.
for (const p of PAGES) p.sections.sort((a, b) => Number(a.href.startsWith("/admin/arrange")) - Number(b.href.startsWith("/admin/arrange")));

// Things that appear on every page.
export const SITE_WIDE = {
  id: "sitewide",
  label: "Header and footer",
  short: "Header and footer",
  icon: "media",
  live: "",
  blurb: "Menu, buttons, footer, floating WhatsApp and YouTube buttons, photos and links.",
  sections: [
    { label: "Menu", href: c("nav"), perm: "content" },
    { label: "Buttons", href: c("buttons"), perm: "content" },
    { label: "Footer text", href: c("footer"), perm: "content" },
    { label: "Footer contacts", href: "/admin/footer", perm: "content" },
    { label: "WhatsApp and YouTube", href: c("whatsapp"), perm: "content" },
    { label: "Photos and links", href: "/admin/media", perm: "media" },
  ],
};

export const ALL_PAGES = [...PAGES, SITE_WIDE];

function matches(pathname, href) {
  return pathname === href || pathname.startsWith(href + "/");
}

// The page and section that own this admin URL, or null.
export function findOwner(pathname) {
  for (const page of ALL_PAGES) {
    for (const section of page.sections) {
      if (matches(pathname, section.href)) return { page, section };
    }
  }
  return null;
}

// Page that owns a site content key such as "hero" (used for breadcrumbs).
export function findByContentKey(key) {
  return findOwner(`/admin/content/${key}`);
}

// Pages and sections this user is allowed to open.
export function allowedPages(sections = [], isOwner = true) {
  const ok = (s) => isOwner || sections.includes(s.perm);
  return ALL_PAGES.map((p) => ({ ...p, sections: p.sections.filter(ok) })).filter((p) => p.sections.length);
}
