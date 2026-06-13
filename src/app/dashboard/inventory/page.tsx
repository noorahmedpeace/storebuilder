import { EmptyState, Panel } from "@/components/app-shell";
import { listInventory } from "@/lib/repositories";
import { getSessionContext } from "@/lib/session";

export default async function InventoryPage() {
  const { storeId } = await getSessionContext();
  const result = storeId ? await listInventory(storeId) : null;

  if (!result || result.source !== "database") {
    return (
      <Panel title="Inventory">
        <EmptyState
          title="No inventory records yet"
          description="Stock levels per variant and warehouse will appear here, with low-stock alerts. (Stock adjustments ship with the Inventory vertical.)"
        />
      </Panel>
    );
  }

  return (
    <Panel title="Inventory" action={`${result.data.length} records`}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-black/10 text-xs uppercase tracking-[0.14em] text-[#6b6f69]">
            <tr>
              <th className="py-3">Product</th>
              <th>SKU</th>
              <th>Warehouse</th>
              <th>Qty</th>
            </tr>
          </thead>
          <tbody>
            {result.data.map((item) => (
              <tr key={item.id} className="border-b border-black/5">
                <td className="py-4 font-bold">{item.variant.product.title}</td>
                <td className="font-mono text-xs">{item.variant.sku}</td>
                <td>{item.warehouse.name}</td>
                <td className="font-mono">
                  <span
                    className={
                      item.quantity <= 5
                        ? "font-bold text-[#a23b3b]"
                        : "text-[#143c3a]"
                    }
                  >
                    {item.quantity}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}
