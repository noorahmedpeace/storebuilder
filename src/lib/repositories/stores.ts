import { getDb, isDatabaseConfigured } from "@/lib/db";
import { stores } from "@/lib/platform-data";

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
