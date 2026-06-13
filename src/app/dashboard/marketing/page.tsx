import { EmptyState, Panel } from "@/components/app-shell";
import { listCoupons } from "@/lib/repositories";
import { getSessionContext } from "@/lib/session";

export default async function MarketingPage() {
  const { storeId } = await getSessionContext();
  const result = storeId ? await listCoupons(storeId) : null;

  if (!result || result.source !== "database") {
    return (
      <Panel title="Marketing">
        <EmptyState
          title="No coupons yet"
          description="Create coupons, bundles, flash sales, and free-shipping rules. (Coupon CRUD ships with the Marketing vertical.)"
        />
      </Panel>
    );
  }

  return (
    <Panel title="Coupons" action={`${result.data.length} active`}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[480px] text-left text-sm">
          <thead className="border-b border-black/10 text-xs uppercase tracking-[0.14em] text-[#6b6f69]">
            <tr>
              <th className="py-3">Code</th>
              <th>Type</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {result.data.map((coupon) => (
              <tr key={coupon.id} className="border-b border-black/5">
                <td className="py-4 font-mono font-bold">{coupon.code}</td>
                <td>{coupon.type}</td>
                <td className="font-mono">{Number(coupon.value).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}
