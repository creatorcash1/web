// ─── Top Products Table ─────────────────────────────────────────────────────
// Ranked list of highest-revenue products with type badge.
// ─────────────────────────────────────────────────────────────────────────────

import type { TopProduct } from "@/types/admin";
import StatusBadge from "./StatusBadge";

export default function TopProductsTable({ products }: { products: TopProduct[] }) {
  return (
    <div className="bg-[#0D1B2A] rounded-xl border border-white/5 p-5">
      <h3 className="text-sm font-semibold text-white/70 mb-4">Top Products by Revenue</h3>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[400px]">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left text-xs font-medium text-white/40 uppercase tracking-wider py-2 px-3">
                #
              </th>
              <th className="text-left text-xs font-medium text-white/40 uppercase tracking-wider py-2 px-3">
                Product
              </th>
              <th className="text-left text-xs font-medium text-white/40 uppercase tracking-wider py-2 px-3">
                Type
              </th>
              <th className="text-right text-xs font-medium text-white/40 uppercase tracking-wider py-2 px-3">
                Revenue
              </th>
              <th className="text-right text-xs font-medium text-white/40 uppercase tracking-wider py-2 px-3">
                Sold
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((p, i) => (
              <tr key={p.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                <td className="py-2.5 px-3 text-sm text-white/30 font-mono">{i + 1}</td>
                <td className="py-2.5 px-3 text-sm text-white/80 font-medium">{p.title}</td>
                <td className="py-2.5 px-3">
                  <StatusBadge status={p.type} />
                </td>
                <td className="py-2.5 px-3 text-sm text-[#FFC857] text-right font-medium">
                  ${p.revenue.toLocaleString()}
                </td>
                <td className="py-2.5 px-3 text-sm text-white/50 text-right">
                  {p.units_sold}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
