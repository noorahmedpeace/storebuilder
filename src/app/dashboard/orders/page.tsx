import { EmptyState, Panel } from "@/components/app-shell";
import { listOrders } from "@/lib/repositories";
import { getSessionContext } from "@/lib/session";

export default async function OrdersPage() {
  const { storeId } = await getSessionContext();
  const result = storeId ? await listOrders(storeId) : null;

  if (!result || result.source !== "database") {
    return (
      <Panel title="Orders">
        <EmptyState
          title="No live orders yet"
          description="Orders placed in your store will appear here with payment and fulfillment status. (Status transitions ship with the Orders vertical.)"
        />
      </Panel>
    );
  }

  return (
    <Panel title="Orders" action={`${result.data.length} orders`}>
      <div className="space-y-3">
        {result.data.map((order) => (
          <div
            key={order.id}
            className="grid gap-3 rounded-lg border border-black/10 bg-[#f7f4ee] p-4 text-sm md:grid-cols-4"
          >
            <span className="font-mono font-bold">
              {order.id.slice(0, 8).toUpperCase()}
            </span>
            <span>{order.customer?.name ?? "Guest"}</span>
            <span>{order.payment?.provider ?? "Unpaid"}</span>
            <span className="font-mono font-bold">
              Rs {Number(order.total).toLocaleString()} · {order.status}
            </span>
          </div>
        ))}
      </div>
    </Panel>
  );
}
