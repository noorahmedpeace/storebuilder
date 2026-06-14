import { Flag } from "lucide-react";
import { MetricCard, PageShell, Panel } from "@/components/app-shell";
import { featureFlags } from "@/lib/platform-data";
import { getPlatformStats, listAllStores } from "@/lib/repositories/admin";

function rs(n: number) {
  return `Rs ${n.toLocaleString()}`;
}

export default async function SuperAdminPage() {
  const [stats, stores] = await Promise.all([
    getPlatformStats(),
    listAllStores(),
  ]);

  const kpis = [
    { label: "Total stores", value: stats.storeCount.toLocaleString(), change: `${stats.liveStores} live` },
    { label: "Trial stores", value: stats.trialStores.toLocaleString(), change: "in trial" },
    { label: "Orders", value: stats.orderCount.toLocaleString(), change: "all stores" },
    { label: "GMV", value: rs(stats.gmv), change: "gross volume" },
    { label: "Customers", value: stats.customerCount.toLocaleString(), change: "all stores" },
    { label: "Products", value: stats.productCount.toLocaleString(), change: "catalog items" },
    { label: "Users", value: stats.userCount.toLocaleString(), change: "accounts" },
    { label: "Data source", value: stats.source === "database" ? "Live" : "Demo", change: stats.source === "database" ? "from DB" : "no DB" },
  ];

  return (
    <PageShell
      eyebrow="Super Admin"
      title="Platform command center for the SaaS owner."
      description="Control every tenant, subscription, domain, staff role, feature flag, and platform-wide KPI from one operating console."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map((item) => (
          <MetricCard key={item.label} {...item} />
        ))}
      </div>

      <div className="mt-6">
        <Panel
          title="Stores"
          action={stores.source === "database" ? `${stores.data.length} stores` : "Demo"}
        >
          {stores.data.length === 0 ? (
            <p className="rounded-lg border border-dashed border-zinc-200 bg-zinc-50 p-8 text-center text-sm text-zinc-500">
              No stores yet. They appear here as merchants sign up.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="border-b border-zinc-200 text-xs uppercase tracking-[0.14em] text-zinc-500">
                  <tr>
                    <th className="py-3">Store</th>
                    <th>Owner</th>
                    <th>Plan</th>
                    <th>Products</th>
                    <th>Orders</th>
                    <th>Domain</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stores.data.map((store) => (
                    <tr key={store.id} className="border-b border-zinc-100">
                      <td className="py-3 font-bold">
                        <a
                          href={`/store/${store.slug}`}
                          target="_blank"
                          className="hover:text-[#143c3a] hover:underline"
                        >
                          {store.name}
                        </a>
                      </td>
                      <td>{store.members[0]?.user?.name ?? "—"}</td>
                      <td>{store.subscription?.plan ?? "—"}</td>
                      <td className="font-mono">{store._count.products}</td>
                      <td className="font-mono">{store._count.orders}</td>
                      <td className="text-zinc-500">{store.domains[0]?.host ?? "—"}</td>
                      <td>
                        <span className="rounded-lg bg-zinc-100 px-3 py-1 text-xs font-bold text-[#143c3a]">
                          {store.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Panel>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel title="Subscriptions by plan" action="Live">
          {stats.plans.length === 0 ? (
            <p className="text-sm text-zinc-500">No subscriptions yet.</p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {stats.plans.map((plan) => (
                <div
                  key={plan.plan}
                  className="rounded-lg border border-zinc-200 bg-zinc-50 p-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold">{plan.plan}</h3>
                    <span className="font-mono text-xl font-bold text-[#143c3a]">
                      {plan.count}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-zinc-500">stores</p>
                </div>
              ))}
            </div>
          )}
        </Panel>

        <Panel title="Feature flags" action="Rollout control">
          <div className="space-y-3">
            {featureFlags.map((flag, index) => (
              <div
                key={flag}
                className="flex items-center justify-between rounded-lg border border-zinc-200 p-4"
              >
                <div className="flex items-center gap-3">
                  <Flag className="text-[#143c3a]" size={18} />
                  <span className="font-semibold">{flag}</span>
                </div>
                <span className="rounded-lg bg-[#143c3a] px-3 py-1 text-xs font-bold text-white">
                  {index < 2 ? "On" : "Beta"}
                </span>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </PageShell>
  );
}
