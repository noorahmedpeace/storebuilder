/**
 * Storefront theme presets. Picking a theme seeds the store's brand/accent
 * colors and layout style; merchants can still override individual colors.
 * Used by the dashboard customizer and the live storefront renderer.
 */
import type { FontKey } from "@/lib/fonts";

export type ThemeKey =
  | "modern-retail"
  | "grocery"
  | "electronics"
  | "perfume"
  | "fashion"
  | "gift"
  | "wholesale"
  | "luxury";

export type ThemePreset = {
  key: ThemeKey;
  name: string;
  category: string;
  brandColor: string;
  accentColor: string;
  /** page background */
  bg: string;
  /** rounded corners style */
  radius: "rounded-md" | "rounded-lg" | "rounded-2xl" | "rounded-none";
  /** heading typeface for the storefront */
  heading: "sans" | "serif";
  /** uppercase + letter-spacing on headings (editorial feel) */
  uppercase?: boolean;
  /** default storefront font (overridable per store via fontKey) */
  defaultFont: FontKey;
};

export const THEMES: ThemePreset[] = [
  { key: "modern-retail", name: "Modern Retail", category: "General", brandColor: "#143c3a", accentColor: "#f3b74f", bg: "#fbfaf5", radius: "rounded-lg", heading: "sans", defaultFont: "inter" },
  { key: "grocery", name: "Grocery Express", category: "Grocery", brandColor: "#1f7a3d", accentColor: "#f6c445", bg: "#f6faf4", radius: "rounded-2xl", heading: "sans", defaultFont: "poppins" },
  { key: "electronics", name: "Electro Pro", category: "Electronics", brandColor: "#0f2a52", accentColor: "#2f9be8", bg: "#f4f7fb", radius: "rounded-md", heading: "sans", defaultFont: "space" },
  { key: "perfume", name: "Oud Luxury", category: "Perfume", brandColor: "#143c3a", accentColor: "#c79a4b", bg: "#fbf8f1", radius: "rounded-lg", heading: "serif", defaultFont: "playfair" },
  { key: "fashion", name: "Fashion Grid", category: "Fashion", brandColor: "#1a1a1a", accentColor: "#e0567f", bg: "#faf7f7", radius: "rounded-none", heading: "serif", uppercase: true, defaultFont: "montserrat" },
  { key: "gift", name: "Gift Box", category: "Gifts", brandColor: "#8a2846", accentColor: "#f3a8c0", bg: "#fdf6f8", radius: "rounded-2xl", heading: "serif", defaultFont: "poppins" },
  { key: "wholesale", name: "Wholesale Ledger", category: "B2B", brandColor: "#22324a", accentColor: "#5aa0d6", bg: "#f5f6f8", radius: "rounded-md", heading: "sans", defaultFont: "inter" },
  { key: "luxury", name: "Luxury Noir", category: "Premium", brandColor: "#0d0d0d", accentColor: "#caa15a", bg: "#f7f5f1", radius: "rounded-none", heading: "serif", uppercase: true, defaultFont: "playfair" },
];

export function getTheme(key: string | null | undefined): ThemePreset {
  return THEMES.find((t) => t.key === key) ?? THEMES[0];
}
