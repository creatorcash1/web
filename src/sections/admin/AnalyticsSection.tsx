// ─── Admin Analytics Section ────────────────────────────────────────────────
// Full analytics page: MRR/ARR cards, revenue chart, user growth, funnel,
// and top products. All powered by Recharts.
// ─────────────────────────────────────────────────────────────────────────────

import RevenueChart from "@/components/admin/RevenueChart";
import UserGrowthChart from "@/components/admin/UserGrowthChart";
import ConversionFunnel from "@/components/admin/ConversionFunnel";
import TopProductsTable from "@/components/admin/TopProductsTable";
import type { AnalyticsData } from "@/types/admin";

export default function AdminAnalyticsSection({ analytics }: { analytics: AnalyticsData }) {
  const metricCards = [
    { label: "MRR", value: `$${analytics.mrr.toLocaleString()}`, color: "text-[#FFC857]" },
    { label: "ARR", value: `$${analytics.arr.toLocaleString()}`, color: "text-[#1CE7D0]" },
    { label: "Churn Rate", value: `${analytics.churn_rate}%`, color: "text-red-400" },
    { label: "Avg Order Value", value: `$${analytics.avg_order_value}`, color: "text-[#FFC857]" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white font-[family-name:var(--font-montserrat)]">
          Analytics
        </h2>
        <p className="text-sm text-white/40 mt-1">
          Deep-dive into revenue, growth, and conversion metrics.
        </p>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {metricCards.map((m) => (
          <div key={m.label} className="bg-[#0D1B2A] rounded-xl border border-white/5 p-5">
            <p className="text-xs text-white/40 uppercase tracking-wider">{m.label}</p>
            <p className={`text-2xl font-bold mt-2 font-[family-name:var(--font-montserrat)] ${m.color}`}>
              {m.value}
            </p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart data={analytics.revenue_over_time} />
        <UserGrowthChart data={analytics.user_growth} />
      </div>

      {/* Funnel + Top products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ConversionFunnel data={analytics.conversion_funnel} />
        <TopProductsTable products={analytics.top_products} />
      </div>
    </div>
  );
}
