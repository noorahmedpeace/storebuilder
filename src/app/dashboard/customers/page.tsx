import { EmptyState, Panel } from "@/components/app-shell";
import { listCustomers } from "@/lib/repositories";
import { getSessionContext } from "@/lib/session";

export default async function CustomersPage() {
  const { storeId } = await getSessionContext();
  const result = storeId ? await listCustomers(storeId) : null;

  if (!result || result.source !== "database") {
    return (
      <Panel title="Customers">
        <EmptyState
          title="No customers yet"
          description="Customer profiles, tags, and order history will appear here. (Segments and CRUD ship with the Customers vertical.)"
        />
      </Panel>
    );
  }

  return (
    <Panel title="Customers" action={`${result.data.length} profiles`}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="border-b border-black/10 text-xs uppercase tracking-[0.14em] text-[#6b6f69]">
            <tr>
              <th className="py-3">Name</th>
              <th>Contact</th>
              <th>Orders</th>
              <th>Tags</th>
            </tr>
          </thead>
          <tbody>
            {result.data.map((customer) => (
              <tr key={customer.id} className="border-b border-black/5">
                <td className="py-4 font-bold">{customer.name}</td>
                <td>{customer.email ?? customer.phone ?? "—"}</td>
                <td className="font-mono">{customer.orders.length}</td>
                <td className="text-xs text-[#68716d]">
                  {customer.tags.length ? customer.tags.join(", ") : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}
