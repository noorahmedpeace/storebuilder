import { revalidatePath } from "next/cache";
import { EmptyState, Panel } from "@/components/app-shell";
import {
  LOW_STOCK_THRESHOLD,
  adjustInventory,
  listInventory,
} from "@/lib/repositories/inventory";
import { getSessionContext, requireStorePermission } from "@/lib/session";

async function adjustAction(formData: FormData) {
  "use server";
  const storeId = await requireStorePermission("inventory:write");
  const id = String(formData.get("id") ?? "");
  const delta = Number(formData.get("delta") ?? 0);
  await adjustInventory(storeId, id, delta);
  revalidatePath("/dashboard/inventory");
}

const DELTAS = [-10, -1, 1, 10];

export default async function InventoryPage() {
  const { storeId } = await getSessionContext();
  const result = storeId ? await listInventory(storeId) : null;

  if (!result || result.source !== "database") {
    return (
      <Panel title="Inventory">
        <EmptyState
          title="No inventory records yet"
          description="Stock levels per variant and warehouse appear here, with low-stock alerts and adjustment controls."
        />
      </Panel>
    );
  }

  const lowCount = result.data.filter(
    (item) => item.quantity <= LOW_STOCK_THRESHOLD,
  ).length;

  return (
    <Panel
      title="Inventory"
      action={`${result.data.length} records · ${lowCount} low`}
    >
      {result.data.length === 0 ? (
        <EmptyState
          title="No stock records"
          description="Add products with variants and warehouses to track stock."
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="border-b border-black/10 text-xs uppercase tracking-[0.14em] text-[#6b6f69]">
              <tr>
                <th className="py-3">Product</th>
                <th>SKU</th>
                <th>Warehouse</th>
                <th>Qty</th>
                <th className="text-right">Adjust</th>
              </tr>
            </thead>
            <tbody>
              {result.data.map((item) => {
                const low = item.quantity <= LOW_STOCK_THRESHOLD;
                return (
                  <tr key={item.id} className="border-b border-black/5">
                    <td className="py-3 font-bold">{item.variant.product.title}</td>
                    <td className="font-mono text-xs">{item.variant.sku}</td>
                    <td>{item.warehouse.name}</td>
                    <td>
                      <span
                        className={
                          low
                            ? "font-mono font-bold text-[#a23b3b]"
                            : "font-mono text-[#143c3a]"
                        }
                      >
                        {item.quantity}
                        {low ? " ⚠" : ""}
                      </span>
                    </td>
                    <td>
                      <div className="flex justify-end gap-1">
                        {DELTAS.map((delta) => (
                          <form key={delta} action={adjustAction}>
                            <input type="hidden" name="id" value={item.id} />
                            <input type="hidden" name="delta" value={delta} />
                            <button
                              type="submit"
                              className="w-10 rounded-lg border border-black/15 py-1 text-xs font-semibold transition hover:border-[#143c3a]"
                            >
                              {delta > 0 ? `+${delta}` : delta}
                            </button>
                          </form>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Panel>
  );
}
