import { getDb, isDatabaseConfigured } from "@/lib/db";
import { merchantOrders } from "@/lib/platform-data";
import { tenantWhere } from "./tenant";

export async function listOrders(storeId: string) {
  if (!isDatabaseConfigured()) {
    return { data: merchantOrders, source: "mock" as const };
  }

  try {
    const db = getDb();
    const data = await db.order.findMany({
      where: tenantWhere(storeId),
      include: {
        customer: true,
        items: { include: { variant: true } },
        payment: true,
        shipment: true,
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    return { data, source: "database" as const };
  } catch (error) {
    console.error("Order query failed, falling back to mock data", error);
    return { data: merchantOrders, source: "mock" as const };
  }
}
