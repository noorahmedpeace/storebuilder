import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { Panel } from "@/components/app-shell";
import { getProduct, updateProduct } from "@/lib/repositories/products";
import { getSessionContext, requireStorePermission } from "@/lib/session";

async function updateProductAction(formData: FormData) {
  "use server";
  const storeId = await requireStorePermission("products:write");
  const id = String(formData.get("id") ?? "");
  await updateProduct(storeId, id, {
    title: String(formData.get("title") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    description: String(formData.get("description") ?? ""),
    price: String(formData.get("price") ?? "0"),
    sku: String(formData.get("sku") ?? ""),
    status: formData.get("status") === "active" ? "active" : "draft",
    features: String(formData.get("features") ?? "").trim() || null,
    specs: String(formData.get("specs") ?? "").trim() || null,
    faq: String(formData.get("faq") ?? "").trim() || null,
  });
  revalidatePath("/dashboard/products");
  redirect("/dashboard/products");
}

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { storeId } = await getSessionContext();
  if (!storeId) notFound();
  const product = await getProduct(storeId, id);
  if (!product) notFound();

  const variant = product.variants[0];
  const inputClass =
    "mt-1 w-full rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2 outline-none focus:border-zinc-900";

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/dashboard/products"
        className="text-sm font-semibold text-zinc-500 hover:underline"
      >
        ← Back to products
      </Link>
      <div className="mt-4">
        <Panel title={`Edit · ${product.title}`}>
          <form action={updateProductAction} className="space-y-3">
            <input type="hidden" name="id" value={product.id} />
            <label className="block">
              <span className="text-sm font-semibold text-zinc-600">Title</span>
              <input
                name="title"
                defaultValue={product.title}
                required
                className={inputClass}
              />
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-semibold text-zinc-600">Slug</span>
                <input
                  name="slug"
                  defaultValue={product.slug}
                  required
                  className={inputClass}
                />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-zinc-600">Status</span>
                <select
                  name="status"
                  defaultValue={product.status}
                  className={inputClass}
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active (published)</option>
                </select>
              </label>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-semibold text-zinc-600">Price</span>
                <input
                  name="price"
                  type="number"
                  step="0.01"
                  defaultValue={variant ? Number(variant.price) : 0}
                  className={inputClass}
                />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-zinc-600">SKU</span>
                <input
                  name="sku"
                  defaultValue={variant?.sku ?? ""}
                  className={inputClass}
                />
              </label>
            </div>
            <label className="block">
              <span className="text-sm font-semibold text-zinc-600">Description</span>
              <textarea
                name="description"
                rows={3}
                defaultValue={product.description}
                className={inputClass}
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-zinc-600">
                Features (one per line)
              </span>
              <textarea
                name="features"
                rows={3}
                defaultValue={product.features ?? ""}
                placeholder={"Reusable\nFood-safe\n1-year warranty"}
                className={inputClass}
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-zinc-600">
                Specifications (Label | Value per line)
              </span>
              <textarea
                name="specs"
                rows={3}
                defaultValue={product.specs ?? ""}
                placeholder={"Weight | 1 kg\nColor | Blue\nMaterial | Silica"}
                className={inputClass}
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-zinc-600">
                FAQ (Question | Answer per line)
              </span>
              <textarea
                name="faq"
                rows={3}
                defaultValue={product.faq ?? ""}
                placeholder={"Is it reusable? | Yes, just dry it\nDelivery time? | 2-3 days"}
                className={inputClass}
              />
            </label>
            <button
              type="submit"
              className="rounded-lg bg-[#143c3a] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#0d2b29]"
            >
              Save changes
            </button>
          </form>
        </Panel>
      </div>
    </div>
  );
}
