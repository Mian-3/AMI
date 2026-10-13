// Default text and images for the Flavours & Fragrances page.
// Add to the dictionaries: en.js gets `flavoursPage: flavoursPageContent.en`
// and ar.js gets `flavoursPage: flavoursPageContent.ar`.
// NOTE: the Arabic below was drafted by Claude and is not approved by the client.

const IMG = "/images/flavours";

export const flavoursPageContent = {
  en: {
    exploreCta: "Explore Flavours & Fragrances →",
    heroEyebrow: "Flavours & Fragrances",
    heroHeading: "Bringing Taste, Scent & Ideas to Life",
    heroP1:
      "From distinctive flavour profiles to memorable fragrance experiences, AM International delivers solutions designed to help businesses develop products that stand out.",
    heroP2:
      "Explore our flavour and fragrance solutions, discover the industries we serve, and find the right direction for your next product.",
    food: {
      eyebrow: "Food Flavours",
      bandText:
        "AM International develops flavour solutions for food and beverage applications, helping manufacturers explore distinctive taste profiles for their products.",
      bandImage: `${IMG}/food-band.webp`,
      heading: "Food Flavours",
      formatsLabel: "Available formats",
      liquid: "Liquid Flavours",
      powder: "Dry Powder Flavours",
      items: [
        { title: "Beverages", desc: "Flavour possibilities for a wide range of drink applications.", image: `${IMG}/beverages.webp` },
        { title: "Bakery", desc: "Flavour profiles for baked goods and sweet treats.", image: `${IMG}/bakery.webp` },
        { title: "Confectionery", desc: "Distinctive flavour experiences for confectionery products.", image: `${IMG}/confectionery.webp` },
        { title: "Dairy", desc: "Flavour solutions for dairy-based product applications.", image: `${IMG}/dairy.webp` },
        { title: "Savoury & Snacks", desc: "Taste profiles for savoury foods and snack products.", image: `${IMG}/savoury-snacks.webp` },
        { title: "Pharmaceuticals", desc: "Explore flavour options suitable for relevant pharmaceutical formulations.", image: `${IMG}/pharmaceuticals.webp` },
      ],
    },
    fragrance: {
      eyebrow: "Fragrances",
      bandText:
        "Fragrance plays an important role in product identity and the way people experience everyday products. AM International offers fragrance solutions for a variety of personal care, home care and other applications.",
      bandImage: `${IMG}/fragrance-band.webp`,
      heading: "Fragrances",
      formatsLabel: "Available formats",
      liquid: "Liquid Fragrances",
      powder: "Dry Powder Fragrances",
      items: [
        { title: "Detergents & Soap", desc: "Fragrance options for cleaning and laundry products.", image: `${IMG}/detergents-soap.webp` },
        { title: "Cosmetics", desc: "Fragrance solutions for cosmetic product applications.", image: `${IMG}/cosmetics.webp` },
        { title: "Baby Care & Skin Care", desc: "Explore fragrance options for personal care formulations.", image: `${IMG}/baby-care.webp` },
        { title: "Car Care", desc: "Fragrance possibilities for selected automotive care products.", image: `${IMG}/car-care.webp` },
        { title: "Home Care", desc: "Fragrance options for home care and household products.", image: `${IMG}/home-care.webp` },
        { title: "Paints & Industrial Products", desc: "Explore fragrance solutions", image: `${IMG}/paints-industrial.webp` },
      ],
    },
  },

  ar: {
    exploreCta: "استكشف النكهات والعطور ←",
    heroEyebrow: "النكهات والعطور",
    heroHeading: "نمنح المذاق والعطر والأفكار حياة",
    heroP1:
      "من النكهات المميزة إلى تجارب العطور التي لا تُنسى، تقدم AM International حلولاً مصممة لمساعدة الشركات على تطوير منتجات تتميز عن غيرها.",
    heroP2:
      "استكشف حلول النكهات والعطور لدينا، وتعرّف على القطاعات التي نخدمها، واعثر على الاتجاه المناسب لمنتجك القادم.",
    food: {
      eyebrow: "نكهات الأغذية",
      bandText:
        "تطوّر AM International حلول النكهات للأغذية والمشروبات، لمساعدة المصنّعين على استكشاف نكهات مميزة لمنتجاتهم.",
      bandImage: `${IMG}/food-band.webp`,
      heading: "نكهات الأغذية",
      formatsLabel: "الأشكال المتاحة",
      liquid: "نكهات سائلة",
      powder: "نكهات مسحوق جاف",
      items: [
        { title: "المشروبات", desc: "إمكانيات نكهات لمجموعة واسعة من تطبيقات المشروبات.", image: `${IMG}/beverages.webp` },
        { title: "المخبوزات", desc: "نكهات للمخبوزات والحلويات.", image: `${IMG}/bakery.webp` },
        { title: "الحلويات والسكاكر", desc: "تجارب نكهات مميزة لمنتجات الحلويات والسكاكر.", image: `${IMG}/confectionery.webp` },
        { title: "الألبان", desc: "حلول نكهات لتطبيقات منتجات الألبان.", image: `${IMG}/dairy.webp` },
        { title: "المالحات والوجبات الخفيفة", desc: "نكهات للأطعمة المالحة ومنتجات الوجبات الخفيفة.", image: `${IMG}/savoury-snacks.webp` },
        { title: "الأدوية", desc: "استكشف خيارات النكهات المناسبة للتركيبات الدوائية ذات الصلة.", image: `${IMG}/pharmaceuticals.webp` },
      ],
    },
    fragrance: {
      eyebrow: "العطور",
      bandText:
        "تلعب العطور دوراً مهماً في هوية المنتج وفي الطريقة التي يختبر بها الناس منتجاتهم اليومية. تقدم AM International حلول عطور لمجموعة متنوعة من تطبيقات العناية الشخصية والعناية بالمنزل وغيرها.",
      bandImage: `${IMG}/fragrance-band.webp`,
      heading: "العطور",
      formatsLabel: "الأشكال المتاحة",
      liquid: "عطور سائلة",
      powder: "عطور مسحوق جاف",
      items: [
        { title: "المنظفات والصابون", desc: "خيارات عطور لمنتجات التنظيف والغسيل.", image: `${IMG}/detergents-soap.webp` },
        { title: "مستحضرات التجميل", desc: "حلول عطور لتطبيقات منتجات التجميل.", image: `${IMG}/cosmetics.webp` },
        { title: "العناية بالأطفال والبشرة", desc: "استكشف خيارات العطور لتركيبات العناية الشخصية.", image: `${IMG}/baby-care.webp` },
        { title: "العناية بالسيارات", desc: "إمكانيات عطور لمنتجات العناية بالسيارات المختارة.", image: `${IMG}/car-care.webp` },
        { title: "العناية بالمنزل", desc: "خيارات عطور لمنتجات العناية بالمنزل والمنتجات المنزلية.", image: `${IMG}/home-care.webp` },
        { title: "الدهانات والمنتجات الصناعية", desc: "استكشف حلول العطور", image: `${IMG}/paints-industrial.webp` },
      ],
    },
  },
};
