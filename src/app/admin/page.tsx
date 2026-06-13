import {
  Bot,
  Building2,
  CircleDollarSign,
  Flag,
  Globe2,
  Headphones,
  ShieldCheck,
} from "lucide-react";
import { MetricCard, PageShell, Panel } from "@/components/app-shell";
import {
  featureFlags,
  platformKpis,
  stores,
  subscriptionPlans,
} from "@/lib/platform-data";

const adminModules = [
  { label: "Store management", icon: Building2, count: "1,284 stores" },
  { label: "Revenue management", icon: CircleDollarSign, count: "Rs 22.4M MRR" },
  { label: "Domain management", icon: Globe2, count: "892 domains" },
  { label: "Support system", icon: Headphones, count: "34 open tickets" },
  { label: "AI usage monitoring", icon: Bot, count: "Rs 92k cost" },
  { label: "Security and audit", icon: ShieldCheck, count: "18 alerts" },
];

export default function SuperAdminPage() {
  return (
    <PageShell
      eyebrow="Super Admin"
      title="Platform command center for the SaaS owner."
      description="Control every tenant, subscription, domain, white-label account, staff role, feature flag, support queue, and platform-wide KPI from one operating console."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {platformKpis.map((item) => (
          <MetricCard key={item.label} {...item} />
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <Panel title="Stores" action="Tenant isolated">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-black/10 text-xs uppercase tracking-[0.14em] text-[#6b6f69]">
                <tr>
                  <th className="py-3">Store</th>
                  <th>Owner</th>
                  <th>Plan</th>
                  <th>Revenue</th>
                  <th>Orders</th>
                  <th>Domain</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {stores.map((store) => (
                  <tr key={store.id} className="border-b border-black/5">
                    <td className="py-4 font-bold">{store.name}</td>
                    <td>{store.owner}</td>
                    <td>{store.plan}</td>
                    <td className="font-mono">{store.revenue}</td>
                    <td className="font-mono">{store.orders}</td>
                    <td>{store.domain}</td>
                    <td>
                      <span className="rounded-lg bg-[#e7ece2] px-3 py-1 text-xs font-bold text-[#143c3a]">
                        {store.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel title="Admin modules" action="Live">
          <div className="space-y-3">
            {adminModules.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-3 rounded-lg border border-black/10 bg-[#f7f4ee] p-3"
              >
                <span className="grid size-10 place-items-center rounded-lg bg-white text-[#143c3a]">
                  <item.icon size={18} />
                </span>
                <div>
                  <p className="font-bold">{item.label}</p>
                  <p className="text-sm text-[#68716d]">{item.count}</p>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel title="Subscription management" action="Plans">
          <div className="grid gap-3 sm:grid-cols-2">
            {subscriptionPlans.map((plan) => (
              <div
                key={plan.name}
                className="rounded-lg border border-black/10 bg-[#f7f4ee] p-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold">{plan.name}</h3>
                  <span className="font-mono text-sm">{plan.stores}</span>
                </div>
                <p className="mt-3 text-sm text-[#68716d]">{plan.price}</p>
                <p className="mt-2 font-mono text-xl font-bold text-[#143c3a]">
                  {plan.mrr}
                </p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Feature flags" action="Rollout control">
          <div className="space-y-3">
            {featureFlags.map((flag, index) => (
              <div
                key={flag}
                className="flex items-center justify-between rounded-lg border border-black/10 p-4"
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
