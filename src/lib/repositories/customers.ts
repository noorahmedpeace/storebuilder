import { getDb, isDatabaseConfigured } from "@/lib/db";
import { tenantWhere } from "./tenant";

/** Owned by the Customers vertical (Wave 2). Foundation provides a working list. */
export async function listCustomers(storeId: string) {
  if (!isDatabaseConfigured()) {
    return { data: [], source: "mock" as const };
  }

  try {
    const db = getDb();
    const data = await db.customer.findMany({
      where: tenantWhere(storeId),
      include: { orders: { select: { id: true, total: true, status: true } } },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    return { data, source: "database" as const };
  } catch (error) {
    console.error("Customer query failed, falling back to mock data", error);
    return { data: [], source: "mock" as const };
  }
}
