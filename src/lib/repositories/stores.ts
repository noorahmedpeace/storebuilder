import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import { getDb, isDatabaseConfigured } from "@/lib/db";
import { stores } from "@/lib/platform-data";
import { getTheme } from "@/lib/themes";
import { normalizeLayout } from "@/lib/sections";
import type { Section } from "@/lib/sections";
import { normalizePrice } from "@/lib/validation";

/** Pull every sellable item out of a builder layout (Shop Grid products, Deals,
 *  and Menu rows) so they can be created as real, buyable catalog products. */
function sellableItemsFromLayout(
  layout: Section[],
): { name: string; price: string; img?: string; desc?: string }[] {
  const items: { name: string; price: string; img?: string; desc?: string }[] = [];
  for (const sec of layout) {
    const p = sec.props ?? {};
    if (sec.type === "products" || sec.type === "deals") {
      const prefix = sec.type === "products" ? "pr" : "d";
      for (let i = 1; i <= 24; i++) {
        const raw = p[`${prefix}${i}`];
        const img = p[`${prefix}${i}img`];
        if (!raw && !img) continue;
        const [name, price] = String(raw ?? "").split("|");
        if ((name && name.trim()) || img) {
          items.push({ name: (name || "Product").trim(), price: (price || "").trim(), img: img || undefined });
        }
      }
    } else if (sec.type === "menuList") {
      for (const row of String(p.items ?? "").split("\n")) {
        const [name, price, desc] = row.split("|");
        if (name && name.trim()) {
          items.push({ name: name.trim(), price: (price || "").trim(), desc: (desc || "").trim() });
        }
      }
    }
  }
  return items;
}

/** Platform-admin scope: stores ARE the tenants, so these are not storeId-scoped. */
export async function listStores() {
  if (!isDatabaseConfigured()) {
    return { data: stores, source: "mock" as const };
  }

  try {
    const db = getDb();
    const data = await db.store.findMany({
      include: { domains: true, subscription: true },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return { data, source: "database" as const };
  } catch (error) {
    console.error("Store query failed, falling back to mock data", error);
    return { data: stores, source: "mock" as const };
  }
}

export async function createStore(input: {
  name: string;
  slug: string;
  domain?: string;
  plan?: string;
}) {
  const db = getDb();

  return db.store.create({
    data: {
      name: input.name,
      slug: input.slug,
      status: "TRIAL",
      domains: input.domain
        ? {
            create: {
              host: input.domain,
              primary: true,
            },
          }
        : undefined,
      subscription: {
        create: {
          plan: input.plan ?? "Starter",
          status: "trialing",
        },
      },
    },
    include: { domains: true, subscription: true },
  });
}

/** Slugify a store name into a URL-safe, unique-ish slug. */
export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
}

export type SignupInput = {
  ownerName: string;
  email: string;
  password: string;
  storeName: string;
  storeSlug: string;
  businessType?: string;
  themeKey?: string;
  brandColor?: string;
  accentColor?: string;
  tagline?: string;
  logoText?: string;
  logoUrl?: string;
  fontKey?: string;
  layout?: unknown;
};

export type SignupResult =
  | { ok: true; storeId: string; slug: string; userId: string }
  | { ok: false; reason: "email" | "slug" | "unknown" };

/** Self-service signup: provisions a new tenant store + owner user in one go. */
export async function createStoreWithOwner(
  input: SignupInput,
): Promise<SignupResult> {
  const db = getDb();
  const slug = slugify(input.storeSlug || input.storeName);
  const email = input.email.trim().toLowerCase();

  const [existingUser, existingStore] = await Promise.all([
    db.user.findUnique({ where: { email }, select: { id: true } }),
    db.store.findUnique({ where: { slug }, select: { id: true } }),
  ]);
  if (existingUser) return { ok: false, reason: "email" };
  if (existingStore) return { ok: false, reason: "slug" };

  const theme = getTheme(input.themeKey);
  const passwordHash = await bcrypt.hash(input.password, 10);

  // Build the final layout: normalize, and ensure there's a Shop Grid so the
  // store always has a working products section to sell from.
  const layout: Section[] = input.layout ? normalizeLayout(input.layout) : [];
  if (layout.length && !layout.some((s) => s.type === "products" && s.visible !== false)) {
    layout.push({ id: "shop-grid", type: "products", visible: true, props: { title: "Shop" } });
  }
  const sellable = sellableItemsFromLayout(layout);

  try {
    const result = await db.$transaction(async (tx) => {
      const ownerRole = await tx.role.upsert({
        where: { name: "STORE_OWNER" },
        update: {},
        create: { name: "STORE_OWNER" },
      });

      const user = await tx.user.create({
        data: { email, name: input.ownerName, passwordHash },
      });

      const store = await tx.store.create({
        data: {
          name: input.storeName,
          slug,
          status: "TRIAL",
          businessType: input.businessType ?? null,
          themeKey: theme.key,
          brandColor: input.brandColor || theme.brandColor,
          accentColor: input.accentColor || theme.accentColor,
          logoText:
            input.logoText || input.storeName.slice(0, 2).toUpperCase(),
          logoUrl: input.logoUrl || null,
          fontKey: input.fontKey || theme.defaultFont,
          ...(layout.length
            ? { layout: layout as unknown as Prisma.InputJsonValue }
            : {}),
          tagline: input.tagline || `Welcome to ${input.storeName}`,
          subscription: { create: { plan: "Starter", status: "trialing" } },
          members: { create: { userId: user.id, roleId: ownerRole.id } },
        },
      });

      // Turn the builder's items into real, buyable catalog products.
      const seen = new Set<string>();
      let idx = 0;
      for (const item of sellable) {
        const key = item.name.toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        idx += 1;
        const baseSlug = (slugify(item.name) || "item").slice(0, 36);
        await tx.product.create({
          data: {
            storeId: store.id,
            title: item.name,
            slug: `${baseSlug}-${idx}`,
            description: item.desc || "",
            status: "active",
            variants: {
              create: {
                sku: `SKU-${idx}`,
                title: "Default",
                price: new Prisma.Decimal(normalizePrice(item.price || "0")),
              },
            },
            ...(item.img
              ? { images: { create: { url: item.img, position: 0 } } }
              : {}),
          },
        });
      }

      return { storeId: store.id, slug: store.slug, userId: user.id };
    });

    return { ok: true, ...result };
  } catch (error) {
    console.error("Store signup failed", error);
    return { ok: false, reason: "unknown" };
  }
}

const STOREFRONT_FIELDS = {
  id: true,
  name: true,
  slug: true,
  businessType: true,
  tagline: true,
  logoText: true,
  brandColor: true,
  accentColor: true,
  themeKey: true,
  whatsapp: true,
  announcement: true,
  heroHeading: true,
  heroSubheading: true,
  aboutText: true,
  logoUrl: true,
  fontKey: true,
  gaId: true,
  clarityId: true,
  layout: true,
  currency: true,
} as const;

/** Public storefront data: a store by slug + its active products. */
export async function getStoreBySlug(slug: string) {
  if (!isDatabaseConfigured()) {
    if (slug !== "oud-reserve") return null;

    return {
      id: "demo_store",
      name: "Oud Reserve",
      slug: "oud-reserve",
      businessType: "Luxury fragrance",
      tagline: "Premium oud perfumes for modern gifting.",
      logoText: "OR",
      brandColor: "#143c3a",
      accentColor: "#d6a747",
      themeKey: "luxury-store",
      whatsapp: "923001234567",
      announcement: "Free delivery over Rs 10,000. WhatsApp support available.",
      heroHeading: "Luxury oud perfumes for modern gifting.",
      heroSubheading:
        "A demo storefront powered by StoreBuilder Cloud with products, reviews, WhatsApp checkout, and SEO-ready content.",
      logoUrl: null,
      fontKey: "playfair",
      aboutText: null,
      gaId: null,
      clarityId: null,
      layout: null,
      currency: "PKR",
      products: [
        {
          id: "demo_oud_noir",
          title: "Oud Reserve Noir",
          slug: "oud-reserve-noir",
          description: "Smoky oud, amber, saffron, and soft musk.",
          status: "active",
          variants: [{ id: "var_oud_noir", price: new Prisma.Decimal("8900") }],
          images: [{ id: "img_oud_noir", url: "", alt: "Oud Reserve Noir" }],
        },
        {
          id: "demo_amber",
          title: "Amber Silk Attar",
          slug: "amber-silk-attar",
          description: "Warm amber oil with a clean everyday finish.",
          status: "active",
          variants: [{ id: "var_amber", price: new Prisma.Decimal("5400") }],
          images: [{ id: "img_amber", url: "", alt: "Amber Silk Attar" }],
        },
      ],
    };
  }

  const db = getDb();
  return db.store.findUnique({
    where: { slug },
    select: {
      ...STOREFRONT_FIELDS,
      products: {
        where: { status: "active" },
        include: { variants: { take: 1 }, images: { take: 1 } },
        orderBy: { createdAt: "desc" },
        take: 24,
      },
    },
  });
}

/** Current store branding/theme settings for the dashboard customizer. */
export async function getStoreSettings(storeId: string) {
  const db = getDb();
  return db.store.findUnique({
    where: { id: storeId },
    select: { ...STOREFRONT_FIELDS, status: true },
  });
}

export type StoreSettingsInput = {
  name?: string;
  tagline?: string | null;
  logoText?: string | null;
  logoUrl?: string | null;
  brandColor?: string;
  accentColor?: string;
  themeKey?: string;
  whatsapp?: string | null;
  announcement?: string | null;
  heroHeading?: string | null;
  heroSubheading?: string | null;
  aboutText?: string | null;
  fontKey?: string | null;
  gaId?: string | null;
  clarityId?: string | null;
};

export async function updateStoreSettings(
  storeId: string,
  input: StoreSettingsInput,
) {
  const db = getDb();
  return db.store.update({
    where: { id: storeId },
    data: {
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(input.tagline !== undefined ? { tagline: input.tagline } : {}),
      ...(input.logoText !== undefined ? { logoText: input.logoText } : {}),
      ...(input.logoUrl !== undefined ? { logoUrl: input.logoUrl } : {}),
      ...(input.brandColor !== undefined ? { brandColor: input.brandColor } : {}),
      ...(input.accentColor !== undefined ? { accentColor: input.accentColor } : {}),
      ...(input.themeKey !== undefined ? { themeKey: input.themeKey } : {}),
      ...(input.whatsapp !== undefined ? { whatsapp: input.whatsapp } : {}),
      ...(input.announcement !== undefined ? { announcement: input.announcement } : {}),
      ...(input.heroHeading !== undefined ? { heroHeading: input.heroHeading } : {}),
      ...(input.heroSubheading !== undefined
        ? { heroSubheading: input.heroSubheading }
        : {}),
      ...(input.fontKey !== undefined ? { fontKey: input.fontKey } : {}),
      ...(input.aboutText !== undefined ? { aboutText: input.aboutText } : {}),
      ...(input.gaId !== undefined ? { gaId: input.gaId } : {}),
      ...(input.clarityId !== undefined ? { clarityId: input.clarityId } : {}),
    },
  });
}

/** Persists the storefront section layout for a store. */
export async function updateStoreLayout(storeId: string, layout: Section[]) {
  const db = getDb();
  return db.store.update({
    where: { id: storeId },
    data: { layout: layout as unknown as Prisma.InputJsonValue },
  });
}
