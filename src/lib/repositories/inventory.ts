import { getDb, isDatabaseConfigured } from "@/lib/db";

/** Owned by the Inventory vertical (Wave 2). Inventory is scoped via the
 *  variant -> product -> storeId chain (InventoryItem has no direct storeId). */
export async function listInventory(storeId: string) {
  if (!isDatabaseConfigured()) {
    return { data: [], source: "mock" as const };
  }

  try {
    const db = getDb();
    const data = await db.inventoryItem.findMany({
      where: { variant: { product: { storeId } } },
      include: { variant: { include: { product: true } }, warehouse: true },
      take: 200,
    });

    return { data, source: "database" as const };
  } catch (error) {
    console.error("Inventory query failed, falling back to mock data", error);
    return { data: [], source: "mock" as const };
  }
}
