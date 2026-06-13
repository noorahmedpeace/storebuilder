import Link from "next/link";
import { ArrowRight, Megaphone } from "lucide-react";
import { MetricCard, Panel } from "@/components/app-shell";
import { automations } from "@/lib/platform-data";
import { getSessionContext } from "@/lib/session";
import { listCustomers, listOrders, listProducts } from "@/lib/repositories";

const moduleCards = [
  { href: "/dashboard/products", label: "Products", hint: "Catalog, variants, SEO" },
  { href: "/dashboard/orders", label: "Orders", hint: "Fulfillment & status" },
  { href: "/dashboard/inventory", label: "Inventory", hint: "Stock & warehouses" },
  { href: "/dashboard/customers", label: "Customers", hint: "Profiles & segments" },
  { href: "/dashboard/catalog", label: "Catalog", hint: "Categories & collections" },
  { href: "/dashboard/marketing", label: "Marketing", hint: "Coupons & campaigns" },
];

export default async function MerchantOverviewPage() {
  const { storeId } = await getSessionContext();

  let productCount = 0;
  let orderCount = 0;
  let customerCount = 0;
  let live = false;

  if (storeId) {
    const [products, orders, customers] = await Promise.all([
      listProducts(storeId),
      listOrders(storeId),
      listCustomers(storeId),
    ]);
    live =
      products.source === "database" ||
      orders.source === "database" ||
      customers.source === "database";
    productCount = products.data.length;
    orderCount = orders.data.length;
    customerCount = customers.data.length;
  }

  const kpis = [
    { label: "Products", value: String(productCount), change: live ? "live data" : "no store data" },
    { label: "Orders", value: String(orderCount), change: live ? "live data" : "no store data" },
    { label: "Customers", value: String(customerCount), change: live ? "live data" : "no store data" },
    { label: "Store scope", value: storeId ? "Active" : "None", change: storeId ?? "no membership" },
  ];

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map((item) => (
          <MetricCard key={item.label} {...item} />
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <Panel title="Modules" action="Tenant-scoped">
          <div className="grid gap-3 sm:grid-cols-2">
            {moduleCards.map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="flex items-center justify-between rounded-lg border border-black/10 bg-[#f7f4ee] p-4 transition hover:border-[#143c3a]"
              >
                <span>
                  <span className="block font-bold">{card.label}</span>
                  <span className="block text-sm text-[#68716d]">{card.hint}</span>
                </span>
                <ArrowRight size={18} className="text-[#143c3a]" />
              </Link>
            ))}
          </div>
        </Panel>

        <Panel title="Growth assistant">
          <div className="rounded-lg bg-[#143c3a] p-5 text-white">
            <Megaphone className="text-[#f3b74f]" />
            <h3 className="mt-4 text-xl font-bold">Launch Summer Campaign</h3>
            <p className="mt-2 leading-7 text-white/72">
              Generate a landing page, coupon, WhatsApp campaign, email copy, SEO
              article, and social content from one prompt.
            </p>
          </div>
        </Panel>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {automations.map((automation) => (
          <Panel key={automation.title} title={automation.title}>
            <div className="space-y-3">
              {automation.steps.map((step) => (
                <div
                  key={step}
                  className="rounded-lg border border-black/10 bg-[#f7f4ee] px-4 py-3 text-sm font-semibold"
                >
                  {step}
                </div>
              ))}
            </div>
          </Panel>
        ))}
      </div>
    </>
  );
}
