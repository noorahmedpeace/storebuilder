/**
 * Storefront-selectable fonts. The CSS variables are defined by next/font in
 * the root layout; here we map a stable key -> the variable + a label for the
 * pickers. `css` is used as the storefront `fontFamily`.
 */
export type FontKey =
  | "inter"
  | "poppins"
  | "montserrat"
  | "space"
  | "playfair"
  | "lora";

export type FontOption = {
  key: FontKey;
  label: string;
  css: string;
  category: "Sans" | "Serif";
};

export const FONTS: FontOption[] = [
  { key: "inter", label: "Inter", css: "var(--font-inter)", category: "Sans" },
  { key: "poppins", label: "Poppins", css: "var(--font-poppins)", category: "Sans" },
  { key: "montserrat", label: "Montserrat", css: "var(--font-montserrat)", category: "Sans" },
  { key: "space", label: "Space Grotesk", css: "var(--font-space)", category: "Sans" },
  { key: "playfair", label: "Playfair Display", css: "var(--font-playfair)", category: "Serif" },
  { key: "lora", label: "Lora", css: "var(--font-lora)", category: "Serif" },
];

export function getFont(key?: string | null): FontOption {
  return FONTS.find((f) => f.key === key) ?? FONTS[0];
}
