import { Banknote, CreditCard, Receipt, Repeat2, Truck } from "lucide-react";
import { PageShell, Panel } from "@/components/app-shell";
import { courierProviders, paymentProviders, subscriptionPlans } from "@/lib/platform-data";

const revenueStreams = [
  "Store setup fees",
  "Monthly subscriptions",
  "Transaction add-ons",
  "Premium themes",
  "Premium apps",
  "Domain reselling",
  "Business email reselling",
  "SEO services",
  "AI content credits",
  "WhatsApp automation",
  "SMS automation",
  "White label licensing",
];

export default function CommercePage() {
  return (
    <PageShell
      eyebrow="Commerce Infrastructure"
      title="Payments, couriers, subscriptions, invoices, and monetization."
      description="The operating backbone for Pakistan and international commerce: COD, EasyPaisa, JazzCash, Raast, Stripe, refunds, webhooks, reconciliation, courier adapters, subscriptions, and platform revenue streams."
    >
      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title="Payment providers" action="Webhook ready">
          <div className="space-y-3">
            {paymentProviders.map((provider) => (
              <div key={provider.provider} className="grid gap-2 rounded-lg border border-black/10 bg-[#f7f4ee] p-4 md:grid-cols-4">
                <span className="flex items-center gap-2 font-bold">
                  <CreditCard size={17} className="text-[#143c3a]" />
                  {provider.provider}
                </span>
                <span>{provider.market}</span>
                <span>{provider.status}</span>
                <span className="font-semibold text-[#143c3a]">{provider.fee}</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Courier abstraction" action="Expandable">
          <div className="space-y-3">
            {courierProviders.map((courier) => (
              <div key={courier.courier} className="grid gap-2 rounded-lg border border-black/10 bg-[#f7f4ee] p-4 md:grid-cols-4">
                <span className="flex items-center gap-2 font-bold">
                  <Truck size={17} className="text-[#143c3a]" />
                  {courier.courier}
                </span>
                <span>{courier.service}</span>
                <span>{courier.status}</span>
                <span className="font-semibold text-[#143c3a]">{courier.sla}</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Panel title="Subscription billing" action="SaaS plans">
          <div className="space-y-3">
            {subscriptionPlans.map((plan) => (
              <div key={plan.name} className="flex items-center justify-between rounded-lg border border-black/10 bg-[#f7f4ee] p-4">
                <div>
                  <p className="font-bold">{plan.name}</p>
                  <p className="text-sm text-[#68716d]">{plan.price}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono font-bold text-[#143c3a]">{plan.mrr}</p>
                  <p className="text-sm text-[#68716d]">{plan.stores} stores</p>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Revenue streams" action="Monetization">
          <div className="grid gap-3 sm:grid-cols-2">
            {revenueStreams.map((stream) => (
              <div key={stream} className="rounded-lg border border-black/10 bg-[#f7f4ee] p-4 font-semibold">
                {stream}
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {[
          ["Refunds and partial refunds", "Provider-specific refund workflows and ledger entries.", Repeat2],
          ["Invoice generation", "Order invoices, subscription invoices, and packing slips.", Receipt],
          ["Reconciliation", "Match provider settlement reports with order payments.", Banknote],
        ].map(([title, text, Icon]) => (
          <article key={title as string} className="rounded-lg border border-black/10 bg-white p-6 shadow-sm">
            <Icon className="text-[#143c3a]" size={24} />
            <h2 className="mt-4 text-xl font-bold">{title as string}</h2>
            <p className="mt-3 leading-7 text-[#5d6561]">{text as string}</p>
          </article>
        ))}
      </div>
    </PageShell>
  );
}
