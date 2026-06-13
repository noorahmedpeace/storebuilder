import { Bot, MessageCircle, PackagePlus, Search, ShoppingBag } from "lucide-react";
import { PageShell, Panel } from "@/components/app-shell";
import { marketplaceApps } from "@/lib/platform-data";

const premiumServices = [
  "Custom development",
  "SEO services",
  "Marketing services",
  "Business email setup",
  "Domain reselling",
  "Agency onboarding",
];

export default function MarketplacePage() {
  return (
    <PageShell
      eyebrow="App Marketplace"
      title="Premium apps, services, themes, and partner monetization."
      description="A marketplace layer for WhatsApp automation, SMS, SEO, AI credits, premium themes, domains, business email, agency partnerships, and custom development services."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {marketplaceApps.map((app) => (
          <article key={app.name} className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
            <PackagePlus className="text-[#143c3a]" size={24} />
            <h2 className="mt-4 text-lg font-bold">{app.name}</h2>
            <p className="mt-2 text-sm text-[#68716d]">{app.type}</p>
            <p className="mt-4 font-mono font-bold text-[#143c3a]">{app.price}</p>
          </article>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Panel title="Premium services" action="Upsells">
          <div className="grid gap-3 sm:grid-cols-2">
            {premiumServices.map((service) => (
              <div key={service} className="rounded-lg border border-black/10 bg-[#f7f4ee] p-4 font-semibold">
                {service}
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Marketplace categories" action="Extensible">
          <div className="space-y-3">
            {[
              ["Marketing", MessageCircle],
              ["SEO", Search],
              ["AI", Bot],
              ["Storefront", ShoppingBag],
            ].map(([category, Icon]) => (
              <div key={category as string} className="flex items-center gap-3 rounded-lg border border-black/10 bg-[#f7f4ee] p-4">
                <span className="grid size-10 place-items-center rounded-lg bg-white text-[#143c3a]">
                  <Icon size={18} />
                </span>
                <span className="font-bold">{category as string}</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </PageShell>
  );
}
