import { Archive, Fingerprint, KeyRound, LockKeyhole, Radar, ShieldCheck, Siren, TimerReset } from "lucide-react";
import { PageShell, Panel } from "@/components/app-shell";

const controls = [
  ["Tenant isolation", "storeId scoping across app, ORM, and database", ShieldCheck],
  ["RBAC", "Role and permission checks on server-side actions", KeyRound],
  ["2FA", "Ready for owner and staff account protection", Fingerprint],
  ["Rate limiting", "Protect auth, checkout, AI, and webhook routes", TimerReset],
  ["Webhook verification", "Provider signatures for payments and couriers", LockKeyhole],
  ["Audit logs", "Track actor, action, entity, metadata, and time", Archive],
  ["WAF integration", "Block malicious traffic and suspicious headers", Radar],
  ["Backups", "Automated database and object storage recovery plan", Siren],
];

export default function SecurityPage() {
  return (
    <PageShell
      eyebrow="Security Architecture"
      title="Enterprise controls for tenant data, payments, staff, and platform operations."
      description="Security is layered across application authorization, ORM scoping, database constraints, webhook verification, audit logs, WAF rules, rate limits, encryption, and backups."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {controls.map(([title, text, Icon]) => (
          <article key={title as string} className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
            <Icon className="text-[#143c3a]" size={24} />
            <h2 className="mt-4 text-lg font-bold">{title as string}</h2>
            <p className="mt-2 text-sm leading-6 text-[#68716d]">{text as string}</p>
          </article>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel title="Authorization rule" action="Never UI-only">
          <p className="leading-8 text-[#4f5b58]">
            Every route handler and server action must verify the authenticated
            actor, role, store membership, feature entitlement, and tenant scope
            before loading or mutating data. Navigation visibility is not a
            security boundary.
          </p>
        </Panel>
        <Panel title="Data protection rule" action="storeId">
          <p className="leading-8 text-[#4f5b58]">
            Tenant-owned tables require `storeId`, composite unique constraints,
            indexed query paths, audit logging, and optional row-level security
            policies for defense in depth.
          </p>
        </Panel>
      </div>
    </PageShell>
  );
}
