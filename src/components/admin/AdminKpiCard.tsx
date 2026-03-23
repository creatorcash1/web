// ─── Admin KPI Card ─────────────────────────────────────────────────────────
// Stat card with icon, value, label, and trend indicator. Deep navy base
// with gold values for a premium admin look.
// ─────────────────────────────────────────────────────────────────────────────

import {
  CurrencyDollarIcon,
  UsersIcon,
  AcademicCapIcon,
  CalendarDaysIcon,
  DocumentArrowDownIcon,
  ShoppingCartIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from "@heroicons/react/24/outline";
import type { KpiCard as KpiCardType } from "@/types/admin";

const ICON_MAP: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  CurrencyDollarIcon,
  UsersIcon,
  AcademicCapIcon,
  CalendarDaysIcon,
  DocumentArrowDownIcon,
  ShoppingCartIcon,
};

export default function AdminKpiCard({ kpi }: { kpi: KpiCardType }) {
  const Icon = ICON_MAP[kpi.icon] ?? CurrencyDollarIcon;
  const isUp = kpi.trend === "up";

  return (
    <div className="bg-[#0D1B2A] rounded-xl border border-white/5 p-5 hover:border-[#FFC857]/20 transition-all duration-300 group">
      <div className="flex items-start justify-between">
        {/* Icon */}
        <div className="w-10 h-10 rounded-lg bg-[#FFC857]/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-[#FFC857]" />
        </div>

        {/* Trend */}
        <div
          className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
            isUp
              ? "bg-emerald-500/10 text-emerald-400"
              : kpi.trend === "down"
              ? "bg-red-500/10 text-red-400"
              : "bg-white/5 text-white/40"
          }`}
        >
          {isUp ? (
            <ArrowTrendingUpIcon className="w-3.5 h-3.5" />
          ) : (
            <ArrowTrendingDownIcon className="w-3.5 h-3.5" />
          )}
          {Math.abs(kpi.change)}%
        </div>
      </div>

      {/* Value */}
      <p className="mt-4 text-2xl font-bold text-[#FFC857] font-(family-name:--font-montserrat) group-hover:text-[#1CE7D0] transition-colors">
        {kpi.value}
      </p>

      {/* Label */}
      <p className="mt-1 text-sm text-white/50">{kpi.label}</p>
    </div>
  );
}
