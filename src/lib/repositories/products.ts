import { Prisma } from "@prisma/client";
import { getDb, isDatabaseConfigured } from "@/lib/db";
import { products } from "@/lib/platform-data";
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
          price: new Prisma.Decimal(input.price),
        },
      },
    },
    include: { variants: true },
  });
}
