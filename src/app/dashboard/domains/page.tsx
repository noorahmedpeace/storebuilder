import { revalidatePath } from "next/cache";
import { BadgeCheck, Clock, ExternalLink } from "lucide-react";
import { EmptyState, Panel } from "@/components/app-shell";
import {
  PLATFORM_CNAME_TARGET,
  PLATFORM_IP,
  addDomain,
  listDomains,
  removeDomain,
  setPrimaryDomain,
  verifyDomain,
} from "@/lib/repositories/domains";
import { getSessionContext, requireStorePermission } from "@/lib/session";
import { DomainSearch } from "./domain-search";

async function addDomainAction(formData: FormData) {
  "use server";
  const storeId = await requireStorePermission("store:write");
  await addDomain(storeId, String(formData.get("host") ?? ""));
  revalidatePath("/dashboard/domains");
}

async function verifyDomainAction(formData: FormData) {
  "use server";
  const storeId = await requireStorePermission("store:write");
  await verifyDomain(storeId, String(formData.get("id") ?? ""));
  revalidatePath("/dashboard/domains");
}

async function setPrimaryAction(formData: FormData) {
  "use server";
  const storeId = await requireStorePermission("store:write");
  await setPrimaryDomain(storeId, String(formData.get("id") ?? ""));
  revalidatePath("/dashboard/domains");
}

async function removeDomainAction(formData: FormData) {
  "use server";
  const storeId = await requireStorePermission("store:write");
  await removeDomain(storeId, String(formData.get("id") ?? ""));
  revalidatePath("/dashboard/domains");
}

export default async function DomainsPage() {
  const { storeId } = await getSessionContext();
  const domains = storeId ? await listDomains(storeId) : [];

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Buy a domain">
          <p className="mb-3 text-sm text-zinc-500">
            Don&apos;t have a domain yet? Search availability and register it on
            Namecheap, then connect it below.
          </p>
          <DomainSearch />
        </Panel>

        <Panel title="Connect a domain you own">
          <form action={addDomainAction} className="flex gap-2">
            <input
              name="host"
              required
              placeholder="myshop.com"
              className="h-10 flex-1 rounded-lg border border-zinc-300 bg-white px-3 outline-none focus:border-zinc-900"
            />
            <button
              type="submit"
              className="h-10 rounded-lg bg-[#143c3a] px-4 text-sm font-semibold text-white transition hover:bg-[#0f2c2a]"
            >
              Connect
            </button>
          </form>
          <p className="mt-2 text-xs text-zinc-500">
            Add the bare domain (e.g. <span className="font-mono">myshop.com</span>).
          </p>
        </Panel>
      </div>

      <Panel title="Your domains" action={`${domains.length}`}>
        {domains.length === 0 ? (
          <EmptyState
            title="No domains connected"
            description="Connect a domain above to make your store public on your own web address."
          />
        ) : (
          <div className="space-y-3">
            {domains.map((d) => (
              <div
                key={d.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-zinc-200 p-4"
              >
                <div className="flex items-center gap-3">
                  {d.verified ? (
                    <BadgeCheck className="text-emerald-600" size={18} />
                  ) : (
                    <Clock className="text-amber-500" size={18} />
                  )}
                  <div>
                    <a
                      href={`https://${d.host}`}
                      target="_blank"
                      className="font-semibold hover:underline"
                    >
                      {d.host} <ExternalLink size={12} className="inline" />
                    </a>
                    <p className="text-xs text-zinc-500">
                      {d.verified ? "Verified & live" : "Pending DNS verification"}
                      {d.primary ? " · Primary" : ""}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!d.verified ? (
                    <form action={verifyDomainAction}>
                      <input type="hidden" name="id" value={d.id} />
                      <button className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-semibold transition hover:border-[#143c3a]">
                        Verify
                      </button>
                    </form>
                  ) : null}
                  {d.verified && !d.primary ? (
                    <form action={setPrimaryAction}>
                      <input type="hidden" name="id" value={d.id} />
                      <button className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-semibold transition hover:border-[#143c3a]">
                        Make primary
                      </button>
                    </form>
                  ) : null}
                  <form action={removeDomainAction}>
                    <input type="hidden" name="id" value={d.id} />
                    <button className="rounded-lg border border-[#a23b3b]/40 px-3 py-1.5 text-xs font-semibold text-[#a23b3b] transition hover:bg-[#fbeaea]">
                      Remove
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </Panel>

      <Panel title="DNS setup">
        <p className="text-sm text-zinc-600">
          At your domain registrar (Namecheap, GoDaddy, etc.), add these records,
          then click <span className="font-semibold">Verify</span>:
        </p>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead className="border-b border-zinc-200 text-xs uppercase tracking-wider text-zinc-500">
              <tr>
                <th className="py-2">Type</th>
                <th>Host</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody className="font-mono">
              <tr className="border-b border-zinc-100">
                <td className="py-2">A</td>
                <td>@</td>
                <td>{PLATFORM_IP}</td>
              </tr>
              <tr>
                <td className="py-2">CNAME</td>
                <td>www</td>
                <td>{PLATFORM_CNAME_TARGET}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-zinc-500">
          DNS changes can take a few minutes to a few hours to propagate. On
          Vercel deployments, also add the domain to the project once.
        </p>
      </Panel>
    </div>
  );
}
