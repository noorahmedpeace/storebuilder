import { EmptyState, Panel } from "@/components/app-shell";
import { listLeads } from "@/lib/repositories/leads";
import { getSessionContext } from "@/lib/session";

export default async function LeadsPage() {
  const { storeId } = await getSessionContext();
  const result = storeId ? await listLeads(storeId) : null;

  if (!result || result.source !== "database" || result.data.length === 0) {
    return (
      <Panel title="Leads">
        <EmptyState
          title="No leads yet"
          description="Contact-form and quote requests from your storefront will appear here."
        />
      </Panel>
    );
  }

  return (
    <Panel title="Leads" action={`${result.data.length}`}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-zinc-200 text-xs uppercase tracking-[0.14em] text-zinc-500">
            <tr>
              <th className="py-3">Name</th>
              <th>Phone</th>
              <th>Type</th>
              <th>Message</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {result.data.map((lead) => (
              <tr key={lead.id} className="border-b border-zinc-100 align-top">
                <td className="py-3 font-bold">
                  {lead.name}
                  {lead.email ? (
                    <span className="block text-xs font-normal text-zinc-500">{lead.email}</span>
                  ) : null}
                </td>
                <td className="font-mono">{lead.phone}</td>
                <td>
                  <span className="rounded-lg bg-zinc-100 px-2 py-1 text-xs font-bold text-[#143c3a]">
                    {lead.kind}
                  </span>
                </td>
                <td className="max-w-xs text-zinc-600">{lead.message ?? "—"}</td>
                <td className="text-zinc-500">
                  {new Date(lead.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}
