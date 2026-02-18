"use client";
// ─── ProductPerformanceTable ────────────────────────────────────────────────
// Admin table showing top/bottom performing products with revenue, sales,
// conversion rate, rating, and trend indicators.
// ─────────────────────────────────────────────────────────────────────────────

import type { ProductPerformance } from "@/types/aiBrain";

interface Props {
  products: ProductPerformance[];
}

function TrendBadge({ trend }: { trend: "up" | "down" | "flat" }) {
  if (trend === "up") return <span className="text-[#1CE7D0] text-xs">↑</span>;
  if (trend === "down") return <span className="text-red-400 text-xs">↓</span>;
  return <span className="text-white/30 text-xs">→</span>;
}

function TypeBadge({ type }: { type: string }) {
  const colors: Record<string, string> = {
    course: "text-[#FFC857] bg-[#FFC857]/10",
    pdf: "text-[#1CE7D0] bg-[#1CE7D0]/10",
    mentorship: "text-purple-400 bg-purple-400/10",
    bundle: "text-white/80 bg-white/10",
  };
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${colors[type] ?? "text-white/40 bg-white/5"}`}>
      {type}
    </span>
  );
}

export default function ProductPerformanceTable({ products }: Props) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-base">📈</span>
        <h4 className="text-sm font-bold text-white">Product Performance</h4>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-white/40 border-b border-white/5">
              <th className="text-left py-2 pr-4 font-medium">#</th>
              <th className="text-left py-2 pr-4 font-medium">Product</th>
              <th className="text-left py-2 pr-4 font-medium">Type</th>
              <th className="text-right py-2 pr-4 font-medium">Revenue</th>
              <th className="text-right py-2 pr-4 font-medium">Sales</th>
              <th className="text-right py-2 pr-4 font-medium">Conv.</th>
              <th className="text-right py-2 pr-4 font-medium">Rating</th>
              <th className="text-right py-2 font-medium">Trend</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr
                key={p.productId}
                className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
              >
                <td className="py-2.5 pr-4">
                  <span className={`w-5 h-5 inline-flex items-center justify-center rounded-full text-[10px] font-bold ${
                    p.rank <= 3 ? "bg-[#FFC857]/10 text-[#FFC857]" : "bg-white/5 text-white/30"
                  }`}>
                    {p.rank}
                  </span>
                </td>
                <td className="py-2.5 pr-4 text-white font-semibold">{p.title}</td>
                <td className="py-2.5 pr-4"><TypeBadge type={p.type} /></td>
                <td className="py-2.5 pr-4 text-right text-white">${p.totalRevenue.toLocaleString()}</td>
                <td className="py-2.5 pr-4 text-right text-white/60">{p.totalSales}</td>
                <td className="py-2.5 pr-4 text-right text-white/60">{p.conversionRate}%</td>
                <td className="py-2.5 pr-4 text-right text-[#FFC857]">{p.avgRating}★</td>
                <td className="py-2.5 text-right"><TrendBadge trend={p.trend} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
