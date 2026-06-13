import { getDb, isDatabaseConfigured } from "@/lib/db";
import { tenantWhere } from "./tenant";

/** Owned by the Marketing vertical (Wave 2): coupons, bundles, flash sales. */
export async function listCoupons(storeId: string) {
  if (!isDatabaseConfigured()) {
    return { data: [], source: "mock" as const };
  }

  try {
    const db = getDb();
    const data = await db.coupon.findMany({
      where: tenantWhere(storeId),
      orderBy: { code: "asc" },
      take: 200,
    });

    return { data, source: "database" as const };
  } catch (error) {
    console.error("Coupon query failed, falling back to mock data", error);
    return { data: [], source: "mock" as const };
  }
}
