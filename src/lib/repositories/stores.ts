import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import { getDb, isDatabaseConfigured } from "@/lib/db";
import { stores } from "@/lib/platform-data";
import { getTheme } from "@/lib/themes";
import type { Section } from "@/lib/sections";

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
          tagline: input.tagline || `Welcome to ${input.storeName}`,
          subscription: { create: { plan: "Starter", status: "trialing" } },
          members: { create: { userId: user.id, roleId: ownerRole.id } },
        },
      });

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
