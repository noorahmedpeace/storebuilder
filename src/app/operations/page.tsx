import {
  Building,
  Flag,
  Globe2,
  KeyRound,
  LifeBuoy,
  Network,
  ShieldAlert,
  Store,
} from "lucide-react";
import { PageShell, Panel } from "@/components/app-shell";
import { domainQueue, featureFlags, supportTickets } from "@/lib/platform-data";

const opsCards = [
  ["White label licensing", "12 active partners", Building],
  ["Agency accounts", "38 agencies", Network],
  ["Franchise management", "7 franchise groups", Store],
  ["Staff permissions", "64 staff users", KeyRound],
  ["Audit alerts", "18 events", ShieldAlert],
  ["Support SLA", "92% on time", LifeBuoy],
];

export default function OperationsPage() {
  return (
    <PageShell
      eyebrow="Platform Operations"
      title="Run domains, support, staff, agencies, franchises, and risk from one console."
      description="This covers the PDF's centralized management layer: domain verification, support, feature flags, staff permissions, audit logs, white-label programs, agency partnerships, and franchise licensing."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {opsCards.map(([title, text, Icon]) => (
          <article key={title as string} className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
            <Icon className="text-[#143c3a]" size={24} />
            <h2 className="mt-4 text-xl font-bold">{title as string}</h2>
            <p className="mt-2 text-[#68716d]">{text as string}</p>
          </article>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Panel title="Domain management" action="Cloudflare ready">
          <div className="space-y-3">
            {domainQueue.map((domain) => (
              <div key={domain.host} className="grid gap-2 rounded-lg border border-black/10 bg-[#f7f4ee] p-4 md:grid-cols-4">
                <span className="flex items-center gap-2 font-bold">
                  <Globe2 size={16} className="text-[#143c3a]" />
                  {domain.host}
                </span>
                <span>{domain.store}</span>
                <span>{domain.status}</span>
                <span className="font-semibold text-[#143c3a]">{domain.ssl}</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Feature rollout" action="Flags">
          <div className="space-y-3">
            {featureFlags.map((flag, index) => (
              <div key={flag} className="flex items-center justify-between rounded-lg border border-black/10 p-4">
                <span className="flex items-center gap-3 font-semibold">
                  <Flag size={17} className="text-[#143c3a]" />
                  {flag}
                </span>
                <span className="rounded-lg bg-[#e7ece2] px-3 py-1 text-xs font-bold text-[#143c3a]">
                  {index < 2 ? "Live" : "Beta"}
                </span>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="mt-6">
        <Panel title="Support tickets" action="SLA queue">
          <div className="grid gap-3 lg:grid-cols-3">
            {supportTickets.map((ticket) => (
              <div key={ticket.id} className="rounded-lg border border-black/10 bg-[#f7f4ee] p-4">
                <p className="font-mono text-sm font-bold text-[#143c3a]">{ticket.id}</p>
                <h3 className="mt-3 font-bold">{ticket.topic}</h3>
                <p className="mt-2 text-sm text-[#68716d]">{ticket.store}</p>
                <span className="mt-4 inline-flex rounded-lg bg-white px-3 py-1 text-xs font-bold">
                  {ticket.priority}
                </span>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </PageShell>
  );
}
