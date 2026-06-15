import { getDb, isDatabaseConfigured } from "@/lib/db";
import { tenantWhere } from "./tenant";

/** Public storefront: a category by slug + its active products. */
export async function getStorefrontCategory(storeId: string, slug: string) {
  const db = getDb();
  return db.category.findFirst({
    where: tenantWhere(storeId, { slug }),
    include: {
      products: {
        where: { status: "active" },
        include: { variants: { take: 1 }, images: { take: 1 } },
        orderBy: { createdAt: "desc" },
        take: 48,
      },
    },
  });
}

/** Owned by the Catalog vertical (Wave 2): categories & collections. */
export async function listCategories(storeId: string) {
  if (!isDatabaseConfigured()) {
    return { data: [], source: "mock" as const };
  }

  try {
    const db = getDb();
    const data = await db.category.findMany({
      where: tenantWhere(storeId),
      include: { children: true, _count: { select: { products: true } } },
      orderBy: { name: "asc" },
      take: 200,
    });

    return { data, source: "database" as const };
  } catch (error) {
    console.error("Category query failed, falling back to mock data", error);
    return { data: [], source: "mock" as const };
  }
}
