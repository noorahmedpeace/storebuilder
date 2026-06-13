import { EmptyState, Panel } from "@/components/app-shell";
import { listProducts } from "@/lib/repositories";
import { getSessionContext } from "@/lib/session";

export default async function ProductsPage() {
  const { storeId } = await getSessionContext();
  const result = storeId ? await listProducts(storeId) : null;

  if (!result || result.source !== "database") {
    return (
      <Panel title="Products">
        <EmptyState
          title="No live products yet"
          description="Once your store is connected to the database and you add products, they will appear here. (Full CRUD ships with the Products vertical.)"
        />
      </Panel>
    );
  }

  return (
    <Panel title="Products" action={`${result.data.length} items`}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-black/10 text-xs uppercase tracking-[0.14em] text-[#6b6f69]">
            <tr>
              <th className="py-3">Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {result.data.map((product) => (
              <tr key={product.id} className="border-b border-black/5">
                <td className="py-4 font-bold">{product.title}</td>
                <td>{product.category?.name ?? "Uncategorized"}</td>
                <td className="font-mono">
                  {product.variants[0]
                    ? `Rs ${Number(product.variants[0].price).toLocaleString()}`
                    : "—"}
                </td>
                <td>
                  <span className="rounded-lg bg-[#e7ece2] px-3 py-1 text-xs font-bold text-[#143c3a]">
                    {product.status}
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
