/**
 * Starter templates: ready-made full-store presets. Picking one seeds the
 * store's branding (theme/colors/font) AND a complete, pre-filled section
 * layout with sample copy — so a merchant gets a finished-looking homepage in
 * one click, then tweaks. This is the layer above THEMES (which only seed
 * colors). Used by the /create builder's "Templates" tab.
 */
import type { FontKey } from "@/lib/fonts";
import type { Section } from "@/lib/sections";
import type { ThemeKey } from "@/lib/themes";

export type StarterTemplate = {
  key: string;
  name: string;
  emoji: string;
  description: string;
  themeKey: ThemeKey;
  brandColor: string;
  accentColor: string;
  fontKey: FontKey;
  businessType: string;
  tagline: string;
  layout: Section[];
};

const s = (
  id: string,
  type: Section["type"],
  props: Record<string, string> = {},
): Section => ({ id, type, visible: true, props });

export const STARTER_TEMPLATES: StarterTemplate[] = [
  {
    key: "mobile-shop",
    name: "Mobile Shop",
    emoji: "📱",
    description:
      "Smartphones, accessories & gadgets — deals, brand grid, warranty perks. Like a modern mobile-walla store.",
    themeKey: "electronics",
    brandColor: "#0f2a52",
    accentColor: "#2f9be8",
    fontKey: "space",
    businessType: "Mobiles & Electronics",
    tagline: "Latest smartphones at the best prices",
    layout: [
      s("t-ann", "announcement", {
        text: "📱 Free delivery all over Pakistan · Cash on Delivery available",
      }),
      s("t-slide", "slider", {
        caption: "New arrivals every week",
      }),
      s("t-deals", "deals", {
        title: "🔥 Today's Best Deals",
        d1: "Smartphone Pro Max | Rs 249,900",
        d2: "Wireless Earbuds | Rs 4,500",
        d3: "Fast Charger 65W | Rs 2,900",
      }),
      s("t-feat", "features", {
        title: "Why shop with us",
        items:
          "Official Warranty, Cash on Delivery, Free Delivery, 7-Day Easy Returns",
      }),
      s("t-prod", "products", { title: "Latest Smartphones" }),
      s("t-stats", "stats", {
        title: "Trusted by thousands",
        n1: "50,000+ | Happy customers",
        n2: "100% | Genuine products",
        n3: "4.9 | Average rating",
        n4: "24/7 | Support",
      }),
      s("t-it", "imageText", {
        heading: "Pakistan's trusted mobile store",
        body: "We stock only 100% original, PTA-approved devices with full warranty. Order online and pay cash when it reaches your door.",
        side: "left",
      }),
      s("t-rev", "reviews", {
        title: "What customers say",
        r1: "Ahmed — Original phone, delivered next day!",
        r2: "Sana — Best price I found anywhere.",
        r3: "Bilal — Smooth COD experience.",
      }),
      s("t-faq", "faq", {
        title: "FAQ",
        q1: "Are the phones original? | Yes, 100% genuine and PTA-approved with warranty.",
        q2: "Do you offer cash on delivery? | Yes, COD is available across Pakistan.",
        q3: "What about warranty? | Every device comes with official brand warranty.",
      }),
      s("t-contact", "contactBar", {
        phone: "021-111-666-111",
        address: "Saddar, Karachi",
        hours: "Open 11am – 10pm",
      }),
      s("t-wa", "whatsapp", { text: "Order on WhatsApp" }),
    ],
  },
  {
    key: "restaurant",
    name: "Restaurant / Food",
    emoji: "🍔",
    description:
      "Menu, hot combos, photo wall and ordering — for a fast-food or restaurant brand.",
    themeKey: "modern-retail",
    brandColor: "#7a1f1f",
    accentColor: "#f6b545",
    fontKey: "poppins",
    businessType: "Restaurant",
    tagline: "Fresh, fast & full of flavour",
    layout: [
      s("t-ann", "announcement", {
        text: "🍔 Free delivery on orders above Rs 1500",
      }),
      s("t-slide", "slider", { caption: "Today's specials" }),
      s("t-deals", "deals", {
        title: "🔥 Hot Combos",
        d1: "Zinger Combo | Rs 650",
        d2: "Family Deal | Rs 1,800",
        d3: "Pizza + Drink | Rs 1,200",
      }),
      s("t-menu", "menuList", {
        title: "Our Menu",
        items:
          "Zinger Burger | 650 | Crispy chicken fillet with fresh mayo\nLoaded Fries | 450 | Cheese & jalapeño\nFamily Bucket | 1800 | 8pc chicken + sides\nChocolate Shake | 350 | Thick & creamy",
      }),
      s("t-gallery", "gallery", { title: "Straight from our kitchen" }),
      s("t-feat", "features", {
        title: "Why order from us",
        items: "Hot & Fresh, Fast Delivery, Cash on Delivery, Hygienic Kitchen",
      }),
      s("t-rev", "reviews", {
        title: "Loved by foodies",
        r1: "Hira — Best zinger in town!",
        r2: "Usman — Always hot and on time.",
        r3: "Maryam — Generous portions.",
      }),
      s("t-contact", "contactBar", {
        phone: "021-111-222-333",
        address: "Main Boulevard, Lahore",
        hours: "Open 12pm – 1am",
      }),
      s("t-wa", "whatsapp", { text: "Order on WhatsApp" }),
    ],
  },
  {
    key: "fashion",
    name: "Fashion / Clothing",
    emoji: "👗",
    description:
      "Editorial hero, lookbook gallery and collections — for apparel and accessories.",
    themeKey: "fashion",
    brandColor: "#1a1a1a",
    accentColor: "#e0567f",
    fontKey: "montserrat",
    businessType: "Fashion & Clothing",
    tagline: "Wear the season",
    layout: [
      s("t-ann", "announcement", { text: "✨ New season collection is live" }),
      s("t-slide", "slider", { caption: "Spring / Summer lookbook" }),
      s("t-it", "imageText", {
        heading: "Designed for everyday confidence",
        body: "Premium fabrics, modern cuts, and timeless colours — made to be worn again and again.",
        side: "right",
      }),
      s("t-prod", "products", { title: "New Arrivals" }),
      s("t-gallery", "gallery", { title: "The Lookbook" }),
      s("t-feat", "features", {
        title: "The promise",
        items: "Premium Fabric, Free Returns, Cash on Delivery, Nationwide Shipping",
      }),
      s("t-news", "newsletter", {
        title: "Get 10% off your first order",
        text: "Join our list for early access to drops.",
        buttonLabel: "Join",
      }),
      s("t-rev", "reviews", {
        title: "From our community",
        r1: "Zara — Quality is unmatched.",
        r2: "Ali — Fit is perfect.",
      }),
      s("t-wa", "whatsapp", { text: "Chat with a stylist" }),
    ],
  },
  {
    key: "grocery",
    name: "Grocery / Mart",
    emoji: "🛒",
    description:
      "Categories, daily deals and fast-delivery messaging — for a kiryana or online mart.",
    themeKey: "grocery",
    brandColor: "#1f7a3d",
    accentColor: "#f6c445",
    fontKey: "poppins",
    businessType: "Grocery & Daily Needs",
    tagline: "Fresh groceries, delivered fast",
    layout: [
      s("t-ann", "announcement", {
        text: "🛒 Delivery within 60 minutes · Free above Rs 2000",
      }),
      s("t-banner", "banner", { text: "Mega Monthly Savings — up to 30% off" }),
      s("t-deals", "deals", {
        title: "🔥 Daily Deals",
        d1: "Cooking Oil 5L | Rs 2,750",
        d2: "Basmati Rice 5kg | Rs 1,950",
        d3: "Tea Pack 950g | Rs 1,450",
      }),
      s("t-prod", "products", { title: "Popular this week" }),
      s("t-steps", "steps", {
        title: "How it works",
        s1: "Add to cart",
        s2: "Place order",
        s3: "Get it delivered",
      }),
      s("t-feat", "features", {
        title: "Why us",
        items: "Fresh Stock, 60-min Delivery, Cash on Delivery, Best Prices",
      }),
      s("t-contact", "contactBar", {
        phone: "0800-12345",
        address: "Serving your city",
        hours: "Open 9am – 11pm",
      }),
      s("t-wa", "whatsapp", { text: "Order on WhatsApp" }),
    ],
  },
];

export function getTemplate(key: string | null | undefined) {
  return STARTER_TEMPLATES.find((t) => t.key === key) ?? null;
}
