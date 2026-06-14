import { Prisma } from "@prisma/client";
import { getDb, isDatabaseConfigured } from "@/lib/db";
import { products } from "@/lib/platform-data";
import { normalizePrice } from "@/lib/validation";
import { tenantWhere } from "./tenant";

export async function listProducts(storeId: string) {
  if (!isDatabaseConfigured()) {
    return { data: products, source: "mock" as const };
  }

  try {
    const db = getDb();
    const data = await db.product.findMany({
      where: tenantWhere(storeId),
      include: { category: true, variants: true, images: true },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    return { data, source: "database" as const };
  } catch (error) {
    console.error("Product query failed, falling back to mock data", error);
    return { data: products, source: "mock" as const };
  }
}

export async function createProduct(
  storeId: string,
  input: {
    title: string;
    slug: string;
    description?: string;
    sku: string;
    price: string | number;
  },
) {
  const db = getDb();

  return db.product.create({
    data: {
      storeId,
      title: input.title,
      slug: input.slug,
      description: input.description ?? "",
      status: "draft",
      variants: {
        create: {
          sku: input.sku,
          title: "Default",
          price: new Prisma.Decimal(normalizePrice(input.price)),
        },
      },
    },
    include: { variants: true },
  });
}

const productInclude = {
  category: true,
  variants: true,
  images: true,
} as const;

/** Single product, tenant-scoped. Returns null if not owned by the store. */
export async function getProduct(storeId: string, id: string) {
  const db = getDb();
  return db.product.findFirst({
    where: tenantWhere(storeId, { id }),
    include: productInclude,
  });
}

export type UpdateProductInput = {
  title?: string;
  slug?: string;
  description?: string;
  status?: string;
  seoTitle?: string | null;
  seoDescription?: string | null;
  price?: string | number;
  sku?: string;
};

/** Updates a product (and optionally its first variant), tenant-scoped.
 *  Returns the updated product, or null if not owned by the store. */
export async function updateProduct(
  storeId: string,
  id: string,
  input: UpdateProductInput,
) {
  const db = getDb();

  const existing = await db.product.findFirst({
    where: tenantWhere(storeId, { id }),
    include: { variants: { take: 1, orderBy: { sku: "asc" } } },
  });
  if (!existing) return null;

  const data: Prisma.ProductUpdateInput = {};
  if (input.title !== undefined) data.title = input.title;
  if (input.slug !== undefined) data.slug = input.slug;
  if (input.description !== undefined) data.description = input.description;
  if (input.status !== undefined) data.status = input.status;
  if (input.seoTitle !== undefined) data.seoTitle = input.seoTitle;
  if (input.seoDescription !== undefined) data.seoDescription = input.seoDescription;

  await db.product.update({ where: { id: existing.id }, data });

  const firstVariant = existing.variants[0];
  if ((input.price !== undefined || input.sku !== undefined) && firstVariant) {
    await db.productVariant.update({
      where: { id: firstVariant.id },
      data: {
        ...(input.sku !== undefined ? { sku: input.sku } : {}),
        ...(input.price !== undefined
          ? { price: new Prisma.Decimal(normalizePrice(input.price)) }
          : {}),
      },
    });
  }

  return db.product.findFirst({
    where: tenantWhere(storeId, { id }),
    include: productInclude,
  });
}

/** Deletes a product, tenant-scoped. Returns true if a row was removed. */
export async function deleteProduct(storeId: string, id: string) {
  const db = getDb();
  const result = await db.product.deleteMany({
    where: tenantWhere(storeId, { id }),
  });
  return result.count > 0;
}

/** Attaches an image to a product, tenant-scoped. Returns null if not owned. */
export async function addProductImage(
  storeId: string,
  productId: string,
  url: string,
  alt?: string,
) {
  const db = getDb();
  const product = await db.product.findFirst({
    where: tenantWhere(storeId, { id: productId }),
    select: { id: true },
  });
  if (!product) return null;

  return db.productImage.create({
    data: { productId: product.id, url, alt: alt ?? null },
  });
}
