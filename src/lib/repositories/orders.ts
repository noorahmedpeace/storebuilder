import type { OrderStatus } from "@prisma/client";
import { getDb, isDatabaseConfigured } from "@/lib/db";
import { merchantOrders } from "@/lib/platform-data";
import { tenantWhere } from "./tenant";

const orderInclude = {
  customer: true,
  items: { include: { variant: true } },
  payment: true,
  shipment: true,
} as const;

/** Legal forward/terminal status transitions for an order. */
const STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  DRAFT: ["PENDING", "CANCELLED"],
  PENDING: ["PAID", "CANCELLED"],
  PAID: ["PACKING", "REFUNDED", "CANCELLED"],
  PACKING: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["DELIVERED"],
  DELIVERED: ["REFUNDED"],
  CANCELLED: [],
  REFUNDED: [],
};

export function canTransition(from: OrderStatus, to: OrderStatus) {
  return STATUS_TRANSITIONS[from]?.includes(to) ?? false;
}

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

/** Single order, tenant-scoped. Returns null if not owned by the store. */
export async function getOrder(storeId: string, id: string) {
  const db = getDb();
  return db.order.findFirst({
    where: tenantWhere(storeId, { id }),
    include: orderInclude,
  });
}

export type UpdateOrderStatusResult =
  | { status: "not_found" }
  | { status: "illegal"; from: OrderStatus; to: OrderStatus }
  | { status: "ok"; order: Awaited<ReturnType<typeof getOrder>> };

/** Advances an order's status if the transition is legal, tenant-scoped. */
export async function updateOrderStatus(
  storeId: string,
  id: string,
  to: OrderStatus,
): Promise<UpdateOrderStatusResult> {
  const db = getDb();

  const existing = await db.order.findFirst({
    where: tenantWhere(storeId, { id }),
    select: { id: true, status: true },
  });
  if (!existing) return { status: "not_found" };

  if (existing.status !== to && !canTransition(existing.status, to)) {
    return { status: "illegal", from: existing.status, to };
  }

  await db.order.update({ where: { id: existing.id }, data: { status: to } });
  const order = await getOrder(storeId, id);
  return { status: "ok", order };
}
