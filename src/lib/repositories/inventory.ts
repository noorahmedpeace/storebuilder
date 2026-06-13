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

export const LOW_STOCK_THRESHOLD = 5;

/** Low-stock items (quantity <= threshold) for a store. */
export async function lowStock(storeId: string, threshold = LOW_STOCK_THRESHOLD) {
  if (!isDatabaseConfigured()) {
    return { data: [], source: "mock" as const };
  }

  try {
    const db = getDb();
    const data = await db.inventoryItem.findMany({
      where: {
        quantity: { lte: threshold },
        variant: { product: { storeId } },
      },
      include: { variant: { include: { product: true } }, warehouse: true },
      take: 200,
    });
    return { data, source: "database" as const };
  } catch (error) {
    console.error("Low-stock query failed, falling back to mock data", error);
    return { data: [], source: "mock" as const };
  }
}

export type AdjustResult =
  | { status: "not_found" }
  | { status: "ok"; quantity: number; id: string };

/** Adjusts an inventory item's quantity by `delta`, clamped at 0. Ownership is
 *  enforced via variant -> product -> storeId (InventoryItem has no storeId). */
export async function adjustInventory(
  storeId: string,
  inventoryItemId: string,
  delta: number,
): Promise<AdjustResult> {
  const db = getDb();

  const item = await db.inventoryItem.findFirst({
    where: { id: inventoryItemId, variant: { product: { storeId } } },
    select: { id: true, quantity: true },
  });
  if (!item) return { status: "not_found" };

  const nextQuantity = Math.max(0, item.quantity + delta);
  await db.inventoryItem.update({
    where: { id: item.id },
    data: { quantity: nextQuantity },
  });

  return { status: "ok", quantity: nextQuantity, id: item.id };
}
