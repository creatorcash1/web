// ─── Admin Overview Section ──────────────────────────────────────────────────
// KPI grid + mini revenue chart + recent payments snapshot.
// ─────────────────────────────────────────────────────────────────────────────

import AdminKpiCard from "@/components/admin/AdminKpiCard";
import RevenueChart from "@/components/admin/RevenueChart";
import TopProductsTable from "@/components/admin/TopProductsTable";
import type { AdminDashboardData } from "@/types/admin";

export default function AdminOverviewSection({ data }: { data: AdminDashboardData }) {
  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="bg-linear-to-r from-[#FFC857]/10 via-[#1CE7D0]/5 to-transparent rounded-xl border border-[#FFC857]/10 p-6">
        <h1 className="text-2xl font-bold text-white font-(family-name:--font-montserrat)">
          Welcome back, CC
        </h1>
        <p className="text-white/50 mt-1 text-sm">
          Here&apos;s what&apos;s happening with CreatorCashCow today.
        </p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.kpis.map((kpi) => (
          <AdminKpiCard key={kpi.label} kpi={kpi} />
        ))}
      </div>

      {/* Revenue Chart + Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart data={data.analytics.revenue_over_time} />
        <TopProductsTable products={data.analytics.top_products.slice(0, 5)} />
      </div>

      {/* Recent Payments */}
      <div className="bg-[#0D1B2A] rounded-xl border border-white/5 p-5">
        <h3 className="text-sm font-semibold text-white/70 mb-4">Recent Transactions</h3>
        <div className="space-y-3">
          {data.payments.slice(0, 5).map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between py-2 border-b border-white/5 last:border-0"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-xs font-bold text-white/50">
                  {p.user_name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <p className="text-sm text-white/80">{p.user_name}</p>
                  <p className="text-xs text-white/40">{p.item}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-[#FFC857]">${p.amount}</p>
                <p className="text-xs text-white/30">
                  {new Date(p.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
