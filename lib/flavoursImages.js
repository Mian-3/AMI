// Flavours & Fragrances page: the category photos and the client logos live in the website files,
// not in the admin. The admin edits the text only.
// Each list is in the same order as the cards on the page. To change a photo or a logo, replace the file
// in public/images/flavours-page/<category>/ (keep the same file name), or edit the path below.
export const FLAVOUR_IMAGES = {
  "food": [
    {
      "image": "/images/flavours-page/confectionery/card.webp",
      "logos": [
        "/images/flavours-page/confectionery/logo-1.png",
        "/images/flavours-page/confectionery/logo-2.png",
        "/images/flavours-page/confectionery/logo-3.png",
        "/images/flavours-page/confectionery/logo-4.png",
        "/images/flavours-page/confectionery/logo-5.png"
      ]
    },
    {
      "image": "/images/flavours-page/baking/card.webp",
      "logos": [
        "/images/flavours-page/baking/logo-1.png",
        "/images/flavours-page/baking/logo-2.png",
        "/images/flavours-page/baking/logo-3.png",
        "/images/flavours-page/baking/logo-4.png",
        "/images/flavours-page/baking/logo-5.png"
      ]
    },
    {
      "image": "/images/flavours-page/beverages/card.webp",
      "logos": [
        "/images/flavours-page/beverages/logo-1.png",
        "/images/flavours-page/beverages/logo-2.png",
        "/images/flavours-page/beverages/logo-3.png",
        "/images/flavours-page/beverages/logo-4.png"
      ]
    },
    {
      "image": "/images/flavours-page/pharmaceutical/card.webp",
      "logos": [
        "/images/flavours-page/pharmaceutical/logo-1.png",
        "/images/flavours-page/pharmaceutical/logo-2.png",
        "/images/flavours-page/pharmaceutical/logo-3.png",
        "/images/flavours-page/pharmaceutical/logo-4.png"
      ]
    },
    {
      "image": "/images/flavours-page/frozen-food/card.webp",
      "logos": [
        "/images/flavours-page/frozen-food/logo-1.png",
        "/images/flavours-page/frozen-food/logo-2.png",
        "/images/flavours-page/frozen-food/logo-3.png",
        "/images/flavours-page/frozen-food/logo-4.png"
      ]
    },
    {
      "image": "/images/flavours-page/savory/card.webp",
      "logos": [
        "/images/flavours-page/savory/logo-1.png",
        "/images/flavours-page/savory/logo-2.png",
        "/images/flavours-page/savory/logo-3.png",
        "/images/flavours-page/savory/logo-4.png"
      ]
    },
    {
      "image": "/images/flavours-page/cup-cake/card.webp",
      "logos": [
        "/images/flavours-page/cup-cake/logo-1.png",
        "/images/flavours-page/cup-cake/logo-2.png",
        "/images/flavours-page/cup-cake/logo-3.png",
        "/images/flavours-page/cup-cake/logo-4.png"
      ]
    }
  ],
  "fragrance": [
    {
      "image": "/images/flavours-page/soap/card.webp",
      "logos": [
        "/images/flavours-page/soap/logo-1.png",
        "/images/flavours-page/soap/logo-2.png",
        "/images/flavours-page/soap/logo-3.png",
        "/images/flavours-page/soap/logo-4.png"
      ]
    },
    {
      "image": "/images/flavours-page/detergents/card.webp",
      "logos": [
        "/images/flavours-page/detergents/logo-1.png",
        "/images/flavours-page/detergents/logo-2.png",
        "/images/flavours-page/detergents/logo-3.png",
        "/images/flavours-page/detergents/logo-4.png"
      ]
    },
    {
      "image": "/images/flavours-page/cosmetics/card.webp",
      "logos": [
        "/images/flavours-page/cosmetics/logo-1.png",
        "/images/flavours-page/cosmetics/logo-2.png",
        "/images/flavours-page/cosmetics/logo-3.png",
        "/images/flavours-page/cosmetics/logo-4.png"
      ]
    },
    {
      "image": "/images/flavours-page/paints/card.webp",
      "logos": [
        "/images/flavours-page/paints/logo-1.png",
        "/images/flavours-page/paints/logo-2.png",
        "/images/flavours-page/paints/logo-3.png",
        "/images/flavours-page/paints/logo-4.png"
      ]
    },
    {
      "image": "/images/flavours-page/baby-skin-care/card.webp",
      "logos": [
        "/images/flavours-page/baby-skin-care/logo-1.png",
        "/images/flavours-page/baby-skin-care/logo-2.png",
        "/images/flavours-page/baby-skin-care/logo-3.png",
        "/images/flavours-page/baby-skin-care/logo-4.png"
      ]
    },
    {
      "image": "/images/flavours-page/home-care/card.webp",
      "logos": [
        "/images/flavours-page/home-care/logo-1.png",
        "/images/flavours-page/home-care/logo-2.png",
        "/images/flavours-page/home-care/logo-3.png",
        "/images/flavours-page/home-care/logo-4.png"
      ]
    },
    {
      "image": "/images/flavours-page/leather-car-care/card.webp",
      "logos": [
        "/images/flavours-page/leather-car-care/logo-1.png",
        "/images/flavours-page/leather-car-care/logo-2.png",
        "/images/flavours-page/leather-car-care/logo-3.png",
        "/images/flavours-page/leather-car-care/logo-4.png"
      ]
    }
  ]
};

// Puts the photos and logos above onto the page content (matched by position, same order as the page).
export function withFlavourImages(page) {
  if (!page || typeof page !== "object") return page;
  const out = { ...page };
  for (const group of ["food", "fragrance"]) {
    const list = FLAVOUR_IMAGES[group];
    if (!page[group] || !Array.isArray(page[group].items)) continue;
    out[group] = {
      ...page[group],
      items: page[group].items.map((item, i) => {
        const set = list[i];
        if (!set) return item;
        const next = { ...item, image: set.image };
        for (let n = 1; n <= 6; n++) next[`logo${n}Image`] = set.logos[n - 1] || "";
        return next;
      }),
    };
  }
  return out;
}
