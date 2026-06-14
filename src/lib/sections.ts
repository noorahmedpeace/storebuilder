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
  | "newsletter";

export type Section = {
  id: string;
  type: SectionType;
  visible: boolean;
  props: Record<string, string>;
};

export const SECTION_LABELS: Record<SectionType, string> = {
  announcement: "Announcement bar",
  hero: "Hero",
  products: "Product grid",
  richText: "Text block",
  banner: "Color banner",
  whatsapp: "WhatsApp CTA",
  features: "Feature badges",
  reviews: "Reviews",
  faq: "FAQ",
  imageBanner: "Image banner",
  video: "Video",
  countdown: "Countdown",
  newsletter: "Newsletter",
};

/** Section types a merchant can add from the builder palette. */
export const ADDABLE_SECTIONS: SectionType[] = [
  "richText",
  "banner",
  "imageBanner",
  "video",
  "countdown",
  "features",
  "reviews",
  "faq",
  "newsletter",
  "whatsapp",
  "products",
];

/** Editable text props per section type (shown as inputs in the builder). */
export const SECTION_FIELDS: Partial<Record<SectionType, { key: string; label: string }[]>> = {
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
