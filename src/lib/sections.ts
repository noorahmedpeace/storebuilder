/**
 * Storefront section model. A store's `layout` (Json) is an ordered list of
 * sections; the storefront renders the visible ones top-to-bottom, and the
 * dashboard builder lets merchants reorder / toggle / edit them.
 */
export type SectionType =
  | "announcement"
  | "hero"
  | "products"
  | "richText"
  | "banner"
  | "whatsapp"
  | "features"
  | "reviews"
  | "faq"
  | "imageBanner"
  | "video"
  | "countdown"
  | "newsletter"
  | "slider"
  | "gallery"
  | "deals"
  | "menuList"
  | "steps"
  | "stats"
  | "imageText"
  | "cta"
  | "contactBar";

export type FieldType = "text" | "textarea" | "image";
export type SectionField = { key: string; label: string; type?: FieldType };

export type Section = {
  id: string;
  type: SectionType;
  visible: boolean;
  props: Record<string, string>;
};

export const SECTION_LABELS: Record<SectionType, string> = {
  announcement: "📣 Top Bar",
  hero: "🚀 Hero Banner",
  products: "🛍️ Shop Grid",
  richText: "📝 Text Block",
  banner: "🎨 Color Strip",
  whatsapp: "💚 WhatsApp Button",
  features: "⭐ Perks",
  reviews: "💬 Customer Love",
  faq: "❓ FAQ",
  imageBanner: "🖼️ Big Banner",
  video: "▶️ Video Spotlight",
  countdown: "⏰ Sale Timer",
  newsletter: "✉️ Email Club",
  slider: "🎞️ Slideshow",
  gallery: "📸 Photo Wall",
  deals: "🔥 Hot Picks",
  menuList: "📋 The Lineup",
  steps: "🪜 Easy Steps",
  stats: "📊 Big Numbers",
  imageText: "✨ Story Block",
  cta: "👉 Big CTA",
  contactBar: "📞 Contact Strip",
};

/** Section types a merchant can add from the builder palette. */
export const ADDABLE_SECTIONS: SectionType[] = [
  "slider",
  "imageBanner",
  "deals",
  "menuList",
  "gallery",
  "imageText",
  "features",
  "steps",
  "stats",
  "reviews",
  "faq",
  "cta",
  "banner",
  "richText",
  "video",
  "countdown",
  "newsletter",
  "contactBar",
  "whatsapp",
  "products",
];

/** Editable props per section type (shown as inputs in the builder). */
export const SECTION_FIELDS: Partial<Record<SectionType, SectionField[]>> = {
  hero: [
    { key: "heading", label: "Heading" },
    { key: "subheading", label: "Subheading" },
  ],
  richText: [
    { key: "heading", label: "Heading" },
    { key: "body", label: "Body text" },
  ],
  banner: [{ key: "text", label: "Banner text" }],
  products: [{ key: "title", label: "Section title" }],
  whatsapp: [{ key: "text", label: "Button label" }],
  features: [
    { key: "title", label: "Title" },
    { key: "items", label: "Items (comma separated)" },
  ],
  reviews: [
    { key: "title", label: "Title" },
    { key: "r1", label: "Review 1 (Name — quote)" },
    { key: "r2", label: "Review 2 (Name — quote)" },
    { key: "r3", label: "Review 3 (Name — quote)" },
  ],
  faq: [
    { key: "title", label: "Title" },
    { key: "q1", label: "Q1 (Question | Answer)" },
    { key: "q2", label: "Q2 (Question | Answer)" },
    { key: "q3", label: "Q3 (Question | Answer)" },
  ],
  imageBanner: [
    { key: "imageUrl", label: "Image URL" },
    { key: "heading", label: "Heading" },
    { key: "text", label: "Subtext" },
  ],
  video: [
    { key: "url", label: "Video URL (YouTube or .mp4)" },
    { key: "title", label: "Title" },
  ],
  countdown: [
    { key: "title", label: "Title" },
    { key: "endsAt", label: "Ends at (YYYY-MM-DD or ISO)" },
  ],
  newsletter: [
    { key: "title", label: "Title" },
    { key: "text", label: "Subtext" },
    { key: "buttonLabel", label: "Button label" },
  ],
  slider: [
    { key: "image1", label: "Slide 1 image", type: "image" },
    { key: "image2", label: "Slide 2 image", type: "image" },
    { key: "image3", label: "Slide 3 image", type: "image" },
    { key: "caption", label: "Caption (optional)" },
  ],
  gallery: [
    { key: "title", label: "Title" },
    { key: "g1", label: "Image 1", type: "image" },
    { key: "g2", label: "Image 2", type: "image" },
    { key: "g3", label: "Image 3", type: "image" },
    { key: "g4", label: "Image 4", type: "image" },
    { key: "g5", label: "Image 5", type: "image" },
    { key: "g6", label: "Image 6", type: "image" },
  ],
  deals: [
    { key: "title", label: "Title" },
    { key: "d1img", label: "Deal 1 image", type: "image" },
    { key: "d1", label: "Deal 1 (Name | Price)" },
    { key: "d2img", label: "Deal 2 image", type: "image" },
    { key: "d2", label: "Deal 2 (Name | Price)" },
    { key: "d3img", label: "Deal 3 image", type: "image" },
    { key: "d3", label: "Deal 3 (Name | Price)" },
  ],
  menuList: [
    { key: "title", label: "Title" },
    { key: "items", label: "Items — one per line: Name | Price | Description", type: "textarea" },
  ],
  steps: [
    { key: "title", label: "Title" },
    { key: "s1", label: "Step 1" },
    { key: "s2", label: "Step 2" },
    { key: "s3", label: "Step 3" },
  ],
  stats: [
    { key: "title", label: "Title" },
    { key: "n1", label: "Stat 1 (Value | Label)" },
    { key: "n2", label: "Stat 2 (Value | Label)" },
    { key: "n3", label: "Stat 3 (Value | Label)" },
    { key: "n4", label: "Stat 4 (Value | Label)" },
  ],
  imageText: [
    { key: "image", label: "Image", type: "image" },
    { key: "heading", label: "Heading" },
    { key: "body", label: "Body text", type: "textarea" },
    { key: "side", label: "Image side (left/right)" },
  ],
  cta: [
    { key: "heading", label: "Heading" },
    { key: "subheading", label: "Subtext" },
    { key: "buttonText", label: "Button text" },
    { key: "bgImage", label: "Background image (optional)", type: "image" },
  ],
  contactBar: [
    { key: "phone", label: "Phone" },
    { key: "address", label: "Address" },
    { key: "hours", label: "Hours (optional)" },
  ],
};

export const DEFAULT_LAYOUT: Section[] = [
  { id: "announcement", type: "announcement", visible: true, props: {} },
  { id: "hero", type: "hero", visible: true, props: {} },
  { id: "products", type: "products", visible: true, props: { title: "Products" } },
];

/** Coerce an untrusted JSON value into a valid Section[]. */
export function normalizeLayout(raw: unknown): Section[] {
  if (!Array.isArray(raw)) return DEFAULT_LAYOUT;

  const sections = raw
    .filter(
      (s): s is Record<string, unknown> =>
        !!s && typeof s === "object" && !Array.isArray(s),
    )
    .filter(
      (s) => typeof s.type === "string" && (s.type as string) in SECTION_LABELS,
    )
    .map((s, i) => ({
      id: typeof s.id === "string" ? s.id : `section-${i}`,
      type: s.type as SectionType,
      visible: s.visible !== false,
      props:
        s.props && typeof s.props === "object" && !Array.isArray(s.props)
          ? (s.props as Record<string, string>)
          : {},
    }));

  return sections.length ? sections : DEFAULT_LAYOUT;
}
