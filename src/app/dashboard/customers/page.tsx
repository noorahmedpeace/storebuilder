import { revalidatePath } from "next/cache";
import { EmptyState, Panel } from "@/components/app-shell";
import {
  createCustomer,
  deleteCustomer,
  listCustomers,
} from "@/lib/repositories/customers";
import { getSessionContext, requireStorePermission } from "@/lib/session";

function parseTags(raw: FormDataEntryValue | null): string[] {
  return String(raw ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

async function createCustomerAction(formData: FormData) {
  "use server";
  const storeId = await requireStorePermission("customers:write");
  try {
    await createCustomer(storeId, {
      name: String(formData.get("name") ?? ""),
      email: (String(formData.get("email") ?? "").trim() || null) as string | null,
      phone: (String(formData.get("phone") ?? "").trim() || null) as string | null,
      tags: parseTags(formData.get("tags")),
    });
  } catch (error) {
    console.error("Create customer failed", error);
    return;
  }
  revalidatePath("/dashboard/customers");
}

async function deleteCustomerAction(formData: FormData) {
  "use server";
  const storeId = await requireStorePermission("customers:write");
  await deleteCustomer(storeId, String(formData.get("id") ?? ""));
  revalidatePath("/dashboard/customers");
}

export default async function CustomersPage() {
  const { storeId } = await getSessionContext();
  const result = storeId ? await listCustomers(storeId) : null;
  const live = result?.source === "database";

  return (
    <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
      <Panel title="Add customer">
        <form action={createCustomerAction} className="space-y-3">
          {(
            [
              ["name", "Name", "Maira Saleem", true],
              ["email", "Email", "maira@example.com", false],
              ["phone", "Phone", "+9230012...", false],
              ["tags", "Tags (comma separated)", "vip, repeat-buyer", false],
            ] as const
          ).map(([name, label, placeholder, required]) => (
            <label key={name} className="block">
              <span className="text-sm font-semibold text-zinc-600">{label}</span>
              <input
                name={name}
                required={required}
                placeholder={placeholder}
                className="mt-1 h-10 w-full rounded-lg border border-zinc-300 bg-zinc-50 px-3 outline-none focus:border-zinc-900"
              />
            </label>
          ))}
          <button
            type="submit"
            disabled={!live}
            className="h-10 w-full rounded-lg bg-[#143c3a] font-semibold text-white transition hover:bg-[#0f2c2a] disabled:opacity-50"
          >
            Create customer
          </button>
          {!live ? (
            <p className="text-xs text-[#a23b3b]">
              Connect a store/database to add customers.
            </p>
          ) : null}
        </form>
      </Panel>

      <Panel title="Customers" action={live ? `${result.data.length} profiles` : undefined}>
        {!live || result.data.length === 0 ? (
          <EmptyState
            title="No customers yet"
            description="Add your first customer using the form on the left."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead className="border-b border-zinc-200 text-xs uppercase tracking-[0.14em] text-zinc-500">
                <tr>
                  <th className="py-3">Name</th>
                  <th>Contact</th>
                  <th>Orders</th>
                  <th>Tags</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {result.data.map((customer) => (
                  <tr key={customer.id} className="border-b border-zinc-100">
                    <td className="py-3 font-bold">{customer.name}</td>
                    <td>{customer.email ?? customer.phone ?? "—"}</td>
                    <td className="font-mono">{customer.orders.length}</td>
                    <td className="text-xs text-zinc-500">
                      {customer.tags.length ? customer.tags.join(", ") : "—"}
                    </td>
                    <td>
                      <div className="flex justify-end">
                        <form action={deleteCustomerAction}>
                          <input type="hidden" name="id" value={customer.id} />
                          <button
                            type="submit"
                            className="rounded-lg border border-[#a23b3b]/40 px-3 py-1 text-xs font-semibold text-[#a23b3b] transition hover:bg-[#fbeaea]"
                          >
                            Delete
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </div>
  );
}
