// PLACEHOLDER CONTENT. Replace with real articles (or a database) later.

const IMAGES = [
  "/images/insights/Rectangle 240649770 (1).png",
  "/images/insights/Rectangle 240649819.png",
  "/images/insights/Rectangle 240649822.png",
  "/images/insights/in-1.png",
];

const templates = [
  {
    title: { en: "The Future of Flavours: What's Next?", ar: "مستقبل النكهات: ماذا بعد؟" },
    excerpt: {
      en: "From evolving consumer preferences to new sensory experiences, discover the trends shaping the future of flavour…",
      ar: "من تفضيلات المستهلكين المتغيرة إلى التجارب الحسية الجديدة، اكتشف الاتجاهات التي تشكل مستقبل النكهات…",
    },
    readTime: { en: "5 min read", ar: "5 دقائق قراءة" },
    date: { en: "Sep 2026", ar: "سبتمبر 2026" },
  },
  {
    title: { en: "From Ingredients to Experiences", ar: "من المكونات إلى التجارب" },
    excerpt: {
      en: "The right ingredient can do more than improve a formula. Discover how ingredients shape the way products are experienced…",
      ar: "المكوّن المناسب يفعل أكثر من تحسين التركيبة. اكتشف كيف تشكل المكونات طريقة تجربة المنتجات…",
    },
    readTime: { en: "7 min read", ar: "7 دقائق قراءة" },
    date: { en: "September 2026", ar: "سبتمبر 2026" },
  },
  {
    title: { en: "Creating Taste People Remember", ar: "ابتكار نكهة لا تُنسى" },
    excerpt: {
      en: "What makes a flavour memorable? Explore the balance of taste, application and consumer expectations behind…",
      ar: "ما الذي يجعل النكهة لا تُنسى؟ استكشف توازن الطعم والتطبيق وتوقعات المستهلك وراء…",
    },
    readTime: { en: "5 min read", ar: "5 دقائق قراءة" },
    date: { en: "February 2026", ar: "فبراير 2026" },
  },
  {
    title: { en: "Inside the Lab: Where Ideas Take Shape", ar: "داخل المختبر: حيث تتشكل الأفكار" },
    excerpt: {
      en: "A look at how research and development turns a creative brief into a formula ready for production…",
      ar: "نظرة على كيفية تحويل البحث والتطوير للملخص الإبداعي إلى تركيبة جاهزة للإنتاج…",
    },
    readTime: { en: "6 min read", ar: "6 دقائق قراءة" },
    date: { en: "October 2026", ar: "أكتوبر 2026" },
  },
];

// category: fragrances | flavours | rd | process
const rows = [
  { category: "fragrances", img: 0, tpl: 0 },
  { category: "flavours", img: 1, tpl: 0 },
  { category: "flavours", img: 2, tpl: 1 },
  { category: "fragrances", img: 3, tpl: 2 },
  { category: "process", img: 0, tpl: 3 },
  { category: "rd", img: 1, tpl: 3 },
  { category: "flavours", img: 2, tpl: 1 },
  { category: "fragrances", img: 3, tpl: 2 },
  { category: "fragrances", img: 0, tpl: 0 },
  { category: "flavours", img: 1, tpl: 0 },
  { category: "flavours", img: 2, tpl: 1 },
  { category: "fragrances", img: 3, tpl: 2 },
];

export function getPosts(locale) {
  const lang = locale === "ar" ? "ar" : "en";
  return rows.map((row, i) => {
    const t = templates[row.tpl];
    return {
      id: i + 1,
      slug: `insight-${i + 1}`,
      category: row.category,
      image: IMAGES[row.img],
      title: t.title[lang],
      excerpt: t.excerpt[lang],
      readTime: t.readTime[lang],
      date: t.date[lang],
    };
  });
}