import { revalidatePath } from "next/cache";
import Link from "next/link";
import type { OrderStatus } from "@prisma/client";
import { EmptyState, Panel } from "@/components/app-shell";
import {
  canTransition,
  listOrders,
  updateOrderStatus,
} from "@/lib/repositories/orders";
import { getSessionContext, requireStorePermission } from "@/lib/session";

const ALL_STATUSES: OrderStatus[] = [
  "DRAFT",
  "PENDING",
  "PAID",
  "PACKING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED",
];

async function advanceStatusAction(formData: FormData) {
  "use server";
  const storeId = await requireStorePermission("orders:write");
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as OrderStatus;
  await updateOrderStatus(storeId, id, status);
  revalidatePath("/dashboard/orders");
}

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { storeId } = await getSessionContext();
  const { order: selectedId } = await searchParams;
  const result = storeId ? await listOrders(storeId) : null;

  if (!result || result.source !== "database") {
    return (
      <Panel title="Orders">
        <EmptyState
          title="No live orders yet"
          description="Orders placed in your store will appear here with payment, fulfillment, and status controls."
        />
      </Panel>
    );
  }

  const orders = result.data;
  const selected = selectedId
    ? orders.find((o) => o.id === selectedId)
    : undefined;

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
      <Panel title="Orders" action={`${orders.length} orders`}>
        <div className="space-y-2">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/dashboard/orders?order=${order.id}`}
              className={`grid gap-3 rounded-lg border p-4 text-sm transition md:grid-cols-4 ${
                order.id === selectedId
                  ? "border-[#143c3a] bg-zinc-100"
                  : "border-zinc-200 bg-zinc-50 hover:border-[#143c3a]"
              }`}
            >
              <span className="font-mono font-bold">
                {order.id.slice(0, 8).toUpperCase()}
              </span>
              <span>{order.customer?.name ?? "Guest"}</span>
              <span className="text-zinc-500">{order.status}</span>
              <span className="font-mono font-bold">
                Rs {Number(order.total).toLocaleString()}
              </span>
            </Link>
          ))}
        </div>
      </Panel>

      {selected ? (
        <Panel title={`Order ${selected.id.slice(0, 8).toUpperCase()}`} action={selected.status}>
          <div className="space-y-4 text-sm">
            <div>
              <p className="font-bold">Customer</p>
              <p className="text-zinc-500">{selected.customer?.name ?? "Guest"}</p>
            </div>

            <div>
              <p className="font-bold">Items</p>
              <ul className="mt-1 space-y-1">
                {selected.items.map((item) => (
                  <li key={item.id} className="flex justify-between">
                    <span>
                      {item.variant.title} × {item.quantity}
                    </span>
                    <span className="font-mono">
                      Rs {Number(item.price).toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-between border-t border-zinc-200 pt-2 font-bold">
              <span>Total</span>
              <span className="font-mono">
                Rs {Number(selected.total).toLocaleString()}
              </span>
            </div>

            <div>
              <p className="font-bold">Payment</p>
              <p className="text-zinc-500">
                {selected.payment
                  ? `${selected.payment.provider} · ${selected.payment.status}`
                  : "Unpaid"}
              </p>
            </div>

            <div>
              <p className="font-bold">Shipment</p>
              <p className="text-zinc-500">
                {selected.shipment
                  ? `${selected.shipment.courier} · ${selected.shipment.status}${
                      selected.shipment.trackingNo
                        ? ` · ${selected.shipment.trackingNo}`
                        : ""
                    }`
                  : "Not booked"}
              </p>
            </div>

            <div>
              <p className="font-bold">Advance status</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {ALL_STATUSES.filter((s) => canTransition(selected.status, s)).map(
                  (status) => (
                    <form key={status} action={advanceStatusAction}>
                      <input type="hidden" name="id" value={selected.id} />
                      <input type="hidden" name="status" value={status} />
                      <button
                        type="submit"
                        className="rounded-lg border border-zinc-300 px-3 py-1 text-xs font-semibold transition hover:border-[#143c3a]"
                      >
                        {status}
                      </button>
                    </form>
                  ),
                )}
                {ALL_STATUSES.filter((s) => canTransition(selected.status, s)).length ===
                0 ? (
                  <span className="text-xs text-zinc-500">Terminal status.</span>
                ) : null}
              </div>
            </div>

            <details className="rounded-lg border border-zinc-200 p-3">
              <summary className="cursor-pointer font-bold">Packing slip</summary>
              <div className="mt-3 space-y-1 text-xs">
                <p className="font-mono">ORDER {selected.id.slice(0, 8).toUpperCase()}</p>
                <p>Ship to: {selected.customer?.name ?? "Guest"}</p>
                <p>{selected.customer?.phone ?? ""}</p>
                <ul className="mt-2">
                  {selected.items.map((item) => (
                    <li key={item.id}>
                      {item.quantity} × {item.variant.title} ({item.variant.sku})
                    </li>
                  ))}
                </ul>
              </div>
            </details>
          </div>
        </Panel>
      ) : (
        <Panel title="Order detail">
          <EmptyState
            title="Select an order"
            description="Click an order on the left to view items, payment, shipment, and advance its status."
          />
        </Panel>
      )}
    </div>
  );
}
