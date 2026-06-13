import { revalidatePath } from "next/cache";
import { EmptyState, Panel } from "@/components/app-shell";
import {
  createProduct,
  deleteProduct,
  listProducts,
  updateProduct,
} from "@/lib/repositories/products";
import { getSessionContext, requireStorePermission } from "@/lib/session";

async function createProductAction(formData: FormData) {
  "use server";
  const storeId = await requireStorePermission("products:write");
  try {
    await createProduct(storeId, {
      title: String(formData.get("title") ?? ""),
      slug: String(formData.get("slug") ?? ""),
      sku: String(formData.get("sku") ?? ""),
      price: String(formData.get("price") ?? "0"),
      description: String(formData.get("description") ?? ""),
    });
  } catch (error) {
    console.error("Create product failed", error);
    return;
  }
  revalidatePath("/dashboard/products");
}

async function toggleStatusAction(formData: FormData) {
  "use server";
  const storeId = await requireStorePermission("products:write");
  const id = String(formData.get("id") ?? "");
  const next = formData.get("next") === "active" ? "active" : "draft";
  await updateProduct(storeId, id, { status: next });
  revalidatePath("/dashboard/products");
}

async function deleteProductAction(formData: FormData) {
  "use server";
  const storeId = await requireStorePermission("products:write");
  await deleteProduct(storeId, String(formData.get("id") ?? ""));
  revalidatePath("/dashboard/products");
}

export default async function ProductsPage() {
  const { storeId } = await getSessionContext();
  const result = storeId ? await listProducts(storeId) : null;
  const live = result?.source === "database";

  return (
    <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
      <Panel title="Add product">
        <form action={createProductAction} className="space-y-3">
          {(
            [
              ["title", "Title", "Oud Reserve Noir"],
              ["slug", "Slug", "oud-reserve-noir"],
              ["sku", "SKU", "OUD-NOIR-50"],
              ["price", "Price (PKR)", "8900"],
            ] as const
          ).map(([name, label, placeholder]) => (
            <label key={name} className="block">
              <span className="text-sm font-semibold text-[#4f5b58]">{label}</span>
              <input
                name={name}
                required
                placeholder={placeholder}
                className="mt-1 h-10 w-full rounded-lg border border-black/15 bg-[#f7f4ee] px-3 outline-none focus:border-[#143c3a]"
              />
            </label>
          ))}
          <label className="block">
            <span className="text-sm font-semibold text-[#4f5b58]">Description</span>
            <textarea
              name="description"
              rows={2}
              className="mt-1 w-full rounded-lg border border-black/15 bg-[#f7f4ee] px-3 py-2 outline-none focus:border-[#143c3a]"
            />
          </label>
          <button
            type="submit"
            disabled={!live}
            className="h-10 w-full rounded-lg bg-[#143c3a] font-semibold text-white transition hover:bg-[#0f2c2a] disabled:opacity-50"
          >
            Create product
          </button>
          {!live ? (
            <p className="text-xs text-[#a23b3b]">
              Connect a store/database to add products.
            </p>
          ) : null}
        </form>
      </Panel>

      <Panel title="Products" action={live ? `${result.data.length} items` : undefined}>
        {!live || result.data.length === 0 ? (
          <EmptyState
            title="No products yet"
            description="Create your first product using the form on the left."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-black/10 text-xs uppercase tracking-[0.14em] text-[#6b6f69]">
                <tr>
                  <th className="py-3">Product</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {result.data.map((product) => {
                  const isActive = product.status === "active";
                  return (
                    <tr key={product.id} className="border-b border-black/5">
                      <td className="py-3">
                        <span className="block font-bold">{product.title}</span>
                        <span className="block text-xs text-[#68716d]">
                          {product.category?.name ?? "Uncategorized"}
                        </span>
                      </td>
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
                      <td>
                        <div className="flex justify-end gap-2">
                          <form action={toggleStatusAction}>
                            <input type="hidden" name="id" value={product.id} />
                            <input
                              type="hidden"
                              name="next"
                              value={isActive ? "draft" : "active"}
                            />
                            <button
                              type="submit"
                              className="rounded-lg border border-black/15 px-3 py-1 text-xs font-semibold transition hover:border-[#143c3a]"
                            >
                              {isActive ? "Unpublish" : "Publish"}
                            </button>
                          </form>
                          <form action={deleteProductAction}>
                            <input type="hidden" name="id" value={product.id} />
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
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </div>
  );
}
