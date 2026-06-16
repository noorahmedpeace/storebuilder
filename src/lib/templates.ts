/**
 * Starter templates: ready-made full-store presets. Picking one seeds the
 * store's branding (theme/colors/font) AND a complete, pre-filled section
 * layout with real, on-subject sample photos + copy — so a merchant gets a
 * finished-looking homepage in one click, then swaps in their own pictures.
 *
 * Photos are Unsplash CDN images, each sourced from an Unsplash search for the
 * matching subject (so a phone deal shows a phone, a rice deal shows rice) and
 * verified to load. Merchants replace them from the live preview.
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

/** Sized Unsplash CDN url for a verified, on-subject photo id. */
const img = (id: string, w = 1000) =>
  `https://images.unsplash.com/${id}?w=${w}&q=80&auto=format&fit=crop`;

// Verified, subject-matched photo ids (sourced from Unsplash search).
const PIC = {
  // mobile / electronics
  smartphone1: "photo-1592890288564-76628a30a657",
  smartphone2: "photo-1598327105666-5b89351aff97",
  phoneHand: "photo-1511707171634-5f897ff02aa9",
  earbuds: "photo-1572569511254-d8f925fe2cbb",
  charger: "photo-1557767382-97b28f5488e7",
  phoneStore: "photo-1556742111-a301076d9d18",
  // food / restaurant
  burger1: "photo-1568901346375-23c9450c58cd",
  burger2: "photo-1572802419224-296b0aeee0d9",
  burger3: "photo-1607013251379-e6eecfffe234",
  pizza1: "photo-1565299624946-b28f40a0ae38",
  pizza2: "photo-1513104890138-7c749659a591",
  chicken1: "photo-1569058242253-92a9c755a0ec",
  chicken2: "photo-1562967916-eb82221dfb92",
  chicken3: "photo-1586793783658-261cddf883ef",
  restaurant1: "photo-1517248135467-4c7edcad34c4",
  restaurant2: "photo-1551632436-cbf8dd35adfa",
  // fashion
  dress1: "photo-1532453288672-3a27e9be9efd",
  dress2: "photo-1496747611176-843222e1e57c",
  dress3: "photo-1567966456076-905a50a06d8c",
  shoe: "photo-1542291026-7eec264c27ff",
  bag1: "photo-1598532163257-ae3c6b2524b6",
  bag2: "photo-1584917865442-de89df76afd3",
  sunglasses: "photo-1511499767150-a48a237f0083",
  boutique: "photo-1441984904996-e0b6ba687e04",
  // grocery
  vegetables: "photo-1579113800032-c38bd7635818",
  rice: "photo-1586201375761-83865001e31c",
  oil: "photo-1474979266404-7eaacbcd87c5",
  mart: "photo-1604719312566-8912e9227c6a",
};

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
        image1: img(PIC.smartphone1, 1400),
        image2: img(PIC.phoneHand, 1400),
        image3: img(PIC.smartphone2, 1400),
        caption: "New arrivals every week",
      }),
      s("t-cats", "categories", {
        title: "Shop by brand",
        c1: "Samsung",
        c2: "Apple",
        c3: "Xiaomi",
        c4: "Infinix",
        c5: "Oppo",
        c6: "Accessories",
      }),
      s("t-deals", "deals", {
        title: "🔥 Today's Best Deals",
        d1img: img(PIC.smartphone1, 700),
        d1: "Smartphone Pro Max | Rs 249,900",
        d2img: img(PIC.earbuds, 700),
        d2: "Wireless Earbuds | Rs 4,500",
        d3img: img(PIC.charger, 700),
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
        image: img(PIC.phoneStore, 900),
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
      s("t-slide", "slider", {
        image1: img(PIC.burger1, 1400),
        image2: img(PIC.pizza1, 1400),
        image3: img(PIC.chicken1, 1400),
        caption: "Today's specials",
      }),
      s("t-cats", "categories", {
        title: "Explore the menu",
        c1img: img(PIC.burger1, 400),
        c1: "Burgers",
        c2img: img(PIC.pizza1, 400),
        c2: "Pizza",
        c3img: img(PIC.chicken1, 400),
        c3: "Fried Chicken",
        c4: "BBQ & Karahi",
        c5: "Biryani",
        c6: "Desserts",
      }),
      s("t-deals", "deals", {
        title: "🔥 Hot Combos",
        d1img: img(PIC.chicken2, 700),
        d1: "Zinger Combo | Rs 650",
        d2img: img(PIC.burger2, 700),
        d2: "Family Deal | Rs 1,800",
        d3img: img(PIC.pizza2, 700),
        d3: "Pizza + Drink | Rs 1,200",
      }),
      s("t-menu", "menuList", {
        title: "Our Menu",
        items:
          "Zinger Burger | 650 | Crispy chicken fillet with fresh mayo\nLoaded Fries | 450 | Cheese & jalapeño\nFamily Bucket | 1800 | 8pc chicken + sides\nChocolate Shake | 350 | Thick & creamy",
      }),
      s("t-story", "imageText", {
        image: img(PIC.burger3, 900),
        heading: "Freshly cooked, every single time",
        body: "We never pre-cook. Your order is fried fresh when you place it — crispy outside, juicy inside. That's our promise.",
        side: "left",
      }),
      s("t-gallery", "gallery", {
        title: "Straight from our kitchen",
        g1: img(PIC.burger1, 600),
        g2: img(PIC.pizza1, 600),
        g3: img(PIC.chicken1, 600),
        g4: img(PIC.pizza2, 600),
        g5: img(PIC.chicken3, 600),
        g6: img(PIC.restaurant1, 600),
      }),
      s("t-steps", "steps", {
        title: "How to order",
        s1: "Pick your meal",
        s2: "Place the order",
        s3: "Hot delivery to your door",
      }),
      s("t-feat", "features", {
        title: "Why order from us",
        items: "Hot & Fresh, Fast Delivery, Cash on Delivery, Hygienic Kitchen",
      }),
      s("t-stats", "stats", {
        title: "Trusted by food lovers",
        n1: "200,000+ | Orders served",
        n2: "30 min | Average delivery",
        n3: "4.8 | Customer rating",
        n4: "12 | Branches",
      }),
      s("t-rev", "reviews", {
        title: "Loved by foodies",
        r1: "Hira — Best zinger in town!",
        r2: "Usman — Always hot and on time.",
        r3: "Maryam — Generous portions.",
      }),
      s("t-cta", "cta", {
        bgImage: img(PIC.burger1, 1400),
        heading: "Hungry? Order now and get it hot",
        subheading: "Free delivery on orders above Rs 1500",
        buttonText: "Order now",
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
      s("t-slide", "slider", {
        image1: img(PIC.dress1, 1400),
        image2: img(PIC.boutique, 1400),
        image3: img(PIC.dress2, 1400),
        caption: "Spring / Summer lookbook",
      }),
      s("t-cats", "categories", {
        title: "Shop by category",
        c1img: img(PIC.dress1, 400),
        c1: "Women",
        c2: "Men",
        c3: "Kids",
        c4img: img(PIC.shoe, 400),
        c4: "Footwear",
        c5img: img(PIC.bag1, 400),
        c5: "Bags",
        c6img: img(PIC.sunglasses, 400),
        c6: "Accessories",
      }),
      s("t-it", "imageText", {
        image: img(PIC.dress3, 900),
        heading: "Designed for everyday confidence",
        body: "Premium fabrics, modern cuts, and timeless colours — made to be worn again and again.",
        side: "right",
      }),
      s("t-prod", "products", { title: "New Arrivals" }),
      s("t-gallery", "gallery", {
        title: "The Lookbook",
        g1: img(PIC.dress1, 600),
        g2: img(PIC.shoe, 600),
        g3: img(PIC.bag1, 600),
        g4: img(PIC.sunglasses, 600),
        g5: img(PIC.dress2, 600),
        g6: img(PIC.bag2, 600),
      }),
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
      s("t-cats", "categories", {
        title: "Shop by category",
        c1img: img(PIC.vegetables, 400),
        c1: "Fruits & Veg",
        c2img: img(PIC.rice, 400),
        c2: "Rice & Atta",
        c3: "Dairy & Eggs",
        c4img: img(PIC.oil, 400),
        c4: "Oil & Ghee",
        c5: "Beverages",
        c6: "Snacks",
      }),
      s("t-deals", "deals", {
        title: "🔥 Daily Deals",
        d1img: img(PIC.vegetables, 700),
        d1: "Fresh Vegetables | from Rs 99",
        d2img: img(PIC.rice, 700),
        d2: "Basmati Rice 5kg | Rs 1,950",
        d3img: img(PIC.oil, 700),
        d3: "Cooking Oil 5L | Rs 2,750",
      }),
      s("t-it", "imageText", {
        image: img(PIC.mart, 900),
        heading: "Your neighbourhood mart, online",
        body: "Everything from fresh produce to monthly rations — delivered to your door within the hour.",
        side: "left",
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
