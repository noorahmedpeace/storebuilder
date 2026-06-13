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

const customerInclude = {
  orders: { select: { id: true, total: true, status: true, createdAt: true } },
} as const;

export type CustomerInput = {
  name: string;
  email?: string | null;
  phone?: string | null;
  tags?: string[];
};

export async function createCustomer(storeId: string, input: CustomerInput) {
  const db = getDb();
  return db.customer.create({
    data: {
      storeId,
      name: input.name,
      email: input.email ?? null,
      phone: input.phone ?? null,
      tags: input.tags ?? [],
    },
  });
}

/** Single customer, tenant-scoped. Returns null if not owned by the store. */
export async function getCustomer(storeId: string, id: string) {
  const db = getDb();
  return db.customer.findFirst({
    where: tenantWhere(storeId, { id }),
    include: customerInclude,
  });
}

export async function updateCustomer(
  storeId: string,
  id: string,
  input: Partial<CustomerInput>,
) {
  const db = getDb();

  const existing = await db.customer.findFirst({
    where: tenantWhere(storeId, { id }),
    select: { id: true },
  });
  if (!existing) return null;

  await db.customer.update({
    where: { id: existing.id },
    data: {
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(input.email !== undefined ? { email: input.email } : {}),
      ...(input.phone !== undefined ? { phone: input.phone } : {}),
      ...(input.tags !== undefined ? { tags: input.tags } : {}),
    },
  });

  return db.customer.findFirst({
    where: tenantWhere(storeId, { id }),
    include: customerInclude,
  });
}

export async function deleteCustomer(storeId: string, id: string) {
  const db = getDb();
  const result = await db.customer.deleteMany({
    where: tenantWhere(storeId, { id }),
  });
  return result.count > 0;
}
