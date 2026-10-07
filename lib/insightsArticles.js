// Each article is keyed by the post slug from lib/insightsData.js.
// Block types:
//   { type: "h", text }                         heading (also builds the sidebar contents)
//   { type: "p", text }                         paragraph (the first one is shown as the larger lead)
//   { type: "list", intro, items: [{n,title,text}] }   numbered cards
//   { type: "callout", title, text }            dark highlight box
//   { type: "quote", text, cite }               pull quote (cite is optional)
//   { type: "image", src, alt, caption }        image inside the article (caption is optional)
// Optional: heroImage: "/images/insights/your-image.png" to override the card image.

const sample = {
  tags: {
    en: ["Flavours", "Innovation", "Product Development", "Industry Trends"],
    ar: ["النكهات", "الابتكار", "تطوير المنتجات", "اتجاهات الصناعة"],
  },
  body: {
    en: [
      { type: "h", text: "Flavour Is More Than Taste" },
      { type: "p", text: "Flavour has become an increasingly important part of how consumers experience a product." },
      { type: "p", text: "Today, people are not simply looking for something that tastes good. They are looking for products that feel distinctive, familiar, exciting and memorable." },
      { type: "p", text: "For manufacturers and product developers, this creates an opportunity to think beyond individual ingredients and explore how flavour can become part of the overall product experience." },
      { type: "h", text: "Understanding the Changing Consumer" },
      { type: "p", text: "Consumer expectations continue to evolve. Familiar flavours remain important, but there is growing interest in new combinations, distinctive sensory experiences and products that offer something different." },
      { type: "p", text: "For brands, understanding these changing expectations can help inform better product development decisions, from the initial concept to the final application." },
      {
        type: "list",
        intro: "Three areas are particularly important:",
        items: [
          { n: "01", title: "Familiarity", text: "Consumers continue to connect with flavours they know and enjoy." },
          { n: "02", title: "Discovery", text: "New combinations and unexpected sensory experiences can create opportunities for differentiation." },
          { n: "03", title: "Experience", text: "Taste becomes part of the overall identity and perception of a product." },
        ],
      },
      { type: "callout", title: "Key takeaway", text: "The best flavour is not the strongest one. It is the one that performs consistently in the product your customer actually makes." },
      { type: "h", text: "From Concept to Application" },
      { type: "p", text: "Creating the right flavour is not simply about selecting a flavour profile." },
      { type: "p", text: "The final result depends on how that flavour performs within the intended product and application." },
      { type: "p", text: "Factors such as formulation, processing, stability, dosage and product characteristics can all influence the final sensory experience." },
      { type: "p", text: "That is why application-focused development plays an important role in creating consistent and effective flavour solutions." },
    ],
    ar: [
      { type: "h", text: "النكهة أكثر من مجرد طعم" },
      { type: "p", text: "أصبحت النكهة جزءًا مهمًا بشكل متزايد من كيفية اختبار المستهلكين للمنتج." },
      { type: "p", text: "اليوم، لا يبحث الناس عن شيء طعمه جيد فحسب، بل عن منتجات تبدو مميزة ومألوفة ومثيرة وتبقى في الذاكرة." },
      { type: "p", text: "بالنسبة للمصنّعين ومطوّري المنتجات، يخلق هذا فرصة للتفكير بما يتجاوز المكونات الفردية واستكشاف كيف تصبح النكهة جزءًا من تجربة المنتج الكاملة." },
      { type: "h", text: "فهم المستهلك المتغيّر" },
      { type: "p", text: "تستمر توقعات المستهلكين في التطور. تبقى النكهات المألوفة مهمة، لكن هناك اهتمامًا متزايدًا بالتركيبات الجديدة والتجارب الحسية المميزة والمنتجات التي تقدم شيئًا مختلفًا." },
      { type: "p", text: "وبالنسبة للعلامات التجارية، يساعد فهم هذه التوقعات المتغيرة على اتخاذ قرارات أفضل في تطوير المنتج، من الفكرة الأولى حتى التطبيق النهائي." },
      {
        type: "list",
        intro: "ثلاثة مجالات مهمة بشكل خاص:",
        items: [
          { n: "01", title: "الألفة", text: "يواصل المستهلكون الارتباط بالنكهات التي يعرفونها ويستمتعون بها." },
          { n: "02", title: "الاكتشاف", text: "يمكن للتركيبات الجديدة والتجارب الحسية غير المتوقعة أن تخلق فرصًا للتميّز." },
          { n: "03", title: "التجربة", text: "يصبح الطعم جزءًا من هوية المنتج وانطباعه العام." },
        ],
      },
      { type: "callout", title: "الخلاصة", text: "أفضل نكهة ليست الأقوى، بل التي تؤدي بثبات داخل المنتج الذي يصنعه عميلك فعليًا." },
      { type: "h", text: "من الفكرة إلى التطبيق" },
      { type: "p", text: "لا يقتصر ابتكار النكهة المناسبة على اختيار ملف نكهة معين." },
      { type: "p", text: "تعتمد النتيجة النهائية على أداء تلك النكهة داخل المنتج والتطبيق المقصودين." },
      { type: "p", text: "يمكن لعوامل مثل التركيبة والمعالجة والثبات والجرعة وخصائص المنتج أن تؤثر جميعها في التجربة الحسية النهائية." },
      { type: "p", text: "لهذا يلعب التطوير المرتكز على التطبيق دورًا مهمًا في ابتكار حلول نكهات متسقة وفعّالة." },
    ],
  },
};

// Add real articles here, one entry per slug. Example:
// "insight-2": { heroImage: "/images/insights/x.png", tags: {en:[...], ar:[...]}, body: {en:[...], ar:[...]} },
export const articles = {
  "insight-1": sample,
};

export function getArticle(slug, locale) {
  const a = articles[slug] ?? sample;
  const lang = locale === "ar" ? "ar" : "en";
  return { heroImage: a.heroImage ?? null, tags: a.tags[lang], body: a.body[lang] };
}