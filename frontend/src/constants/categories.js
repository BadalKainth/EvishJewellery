export const primaryCategoryLinks = [
  {
    slug: "bracelets",
    label: "Tiny Treasures",
    subtitle: "Kids & Toys Collection",
    path: "/category/bracelets",
  },
  {
    slug: "rings",
    label: "Hydro Luxe",
    subtitle: "Water Bottles & Drinkware",
    path: "/category/rings",
  },
  {
    slug: "earrings",
    label: "Smart Living",
    subtitle: "Home & Kitchen Essentials",
    path: "/category/earrings",
  },
  {
    slug: "necklaces",
    label: "Aura Decor",
    subtitle: "Home Decor Collection",
    path: "/category/necklaces",
  },
  {
    slug: "couple-sets",
    label: "New Launches",
    subtitle: "Fresh arrivals just in",
    path: "/category/couple-sets",
  },
  {
    slug: "anklets",
    label: "SheVerse",
    subtitle: "All women-related products.",
    path: "/category/anklets",
  },
  {
    slug: "royal-crunch",
    label: "Royal Crunch",
    subtitle: "Premium Dry Fruits & Nuts Collection",
    path: "/category/royal-crunch",
  },
];

export const categoryMeta = primaryCategoryLinks.reduce((acc, category) => {
  acc[category.slug] = category;
  return acc;
}, {});

export const getCategoryLabel = (slug) =>
  categoryMeta[slug]?.label || slug;

export const getCategorySubtitle = (slug) =>
  categoryMeta[slug]?.subtitle || "";
