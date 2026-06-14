import { getDb, isDatabaseConfigured } from "@/lib/db";

export type PlatformStats = {
  source: "database" | "mock";
  storeCount: number;
  liveStores: number;
  trialStores: number;
  userCount: number;
  productCount: number;
  orderCount: number;
  customerCount: number;
  gmv: number;
  plans: { plan: string; count: number }[];
};

const MOCK_STATS: PlatformStats = {
  source: "mock",
  storeCount: 1284,
  liveStores: 980,
  trialStores: 210,
  userCount: 3120,
  productCount: 18400,
  orderCount: 9240,
  customerCount: 28140,
  gmv: 22400000,
  plans: [
    { plan: "Starter", count: 412 },
    { plan: "Growth", count: 526 },
    { plan: "Scale", count: 294 },
    { plan: "Enterprise", count: 52 },
  ],
};

/** Platform-wide KPIs for the super-admin console (real DB counts). */
export async function getPlatformStats(): Promise<PlatformStats> {
  if (!isDatabaseConfigured()) return MOCK_STATS;

  try {
    const db = getDb();
    const [
      storeCount,
      liveStores,
      trialStores,
      userCount,
      productCount,
      orderCount,
      customerCount,
      gmvAgg,
      planGroups,
    ] = await Promise.all([
      db.store.count(),
      db.store.count({ where: { status: "LIVE" } }),
      db.store.count({ where: { status: "TRIAL" } }),
      db.user.count(),
      db.product.count(),
      db.order.count(),
      db.customer.count(),
      db.order.aggregate({ _sum: { total: true } }),
      db.subscription.groupBy({ by: ["plan"], _count: { _all: true } }),
    ]);

    return {
      source: "database",
      storeCount,
      liveStores,
      trialStores,
      userCount,
      productCount,
      orderCount,
      customerCount,
      gmv: Number(gmvAgg._sum.total ?? 0),
      plans: planGroups
        .map((p) => ({ plan: p.plan, count: p._count._all }))
        .sort((a, b) => b.count - a.count),
    };
  } catch (error) {
    console.error("Platform stats query failed, using mock", error);
    return MOCK_STATS;
  }
}

/** Every store on the platform with owner, plan, domain, and counts. */
export async function listAllStores() {
  if (!isDatabaseConfigured()) {
    return { source: "mock" as const, data: [] };
  }

  try {
    const db = getDb();
    const data = await db.store.findMany({
      include: {
        subscription: true,
        domains: { take: 1, orderBy: { primary: "desc" } },
        members: { include: { user: true }, take: 1 },
        _count: { select: { products: true, orders: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    return { source: "database" as const, data };
  } catch (error) {
    console.error("Admin store list failed, using mock", error);
    return { source: "mock" as const, data: [] };
  }
}
