import { EmptyState, Panel } from "@/components/app-shell";
import { listCategories } from "@/lib/repositories";
import { getSessionContext } from "@/lib/session";

export default async function CatalogPage() {
  const { storeId } = await getSessionContext();
  const result = storeId ? await listCategories(storeId) : null;

  if (!result || result.source !== "database") {
    return (
      <Panel title="Catalog">
        <EmptyState
          title="No categories yet"
          description="Organize products into categories and collections. (Category tree CRUD ships with the Catalog vertical.)"
        />
      </Panel>
    );
  }

  return (
    <Panel title="Categories" action={`${result.data.length} categories`}>
      <div className="grid gap-3 sm:grid-cols-2">
        {result.data.map((category) => (
          <div
            key={category.id}
            className="flex items-center justify-between rounded-lg border border-black/10 bg-[#f7f4ee] p-4"
          >
            <div>
              <p className="font-bold">{category.name}</p>
              <p className="text-sm text-[#68716d]">
                {category.children.length} subcategories
              </p>
            </div>
            <span className="rounded-lg bg-[#e7ece2] px-3 py-1 text-xs font-bold text-[#143c3a]">
              {category._count.products} products
            </span>
          </div>
        ))}
      </div>
    </Panel>
  );
}
