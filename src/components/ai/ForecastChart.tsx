"use client";
// ─── ForecastChart ──────────────────────────────────────────────────────────
// Revenue forecast chart (30/60/90 day) using Recharts.
// Brand colors: Gold #FFC857, Teal #1CE7D0, Navy #0D1B2A.
// ─────────────────────────────────────────────────────────────────────────────

import type { RevenueForecast } from "@/types/aiBrain";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";

interface Props {
  forecast: RevenueForecast;
  compact?: boolean;
}

const COLORS = ["#FFC857", "#1CE7D0", "#FFC857"];

export default function ForecastChart({ forecast, compact = false }: Props) {
  const data = forecast.periods.map((p) => ({
    name: p.label,
    revenue: p.projectedRevenue,
    users: p.projectedNewUsers,
    conversions: p.projectedConversions,
    growth: p.growthRate,
  }));

  return (
    <div className={compact ? "" : "space-y-4"}>
      {!compact && (
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-white">Revenue Forecast</h4>
            <p className="text-xs text-white/40 mt-0.5">
              Total projected: ${forecast.totalProjected.toLocaleString()} ·{" "}
              {Math.round(forecast.confidence * 100)}% confidence
            </p>
          </div>
          <div className="text-right">
            {forecast.assumptions.slice(0, 2).map((a, i) => (
              <p key={i} className="text-[10px] text-white/30 leading-tight">{a}</p>
            ))}
          </div>
        </div>
      )}

      <div className={compact ? "h-40" : "h-64"}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis
              dataKey="name"
              tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }}
              axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
            />
            <YAxis
              tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }}
              axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
              tickFormatter={(v: number) => `$${v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}`}
            />
            <Tooltip
              contentStyle={{
                background: "#0D1B2A",
                border: "1px solid rgba(255,200,87,0.2)",
                borderRadius: 8,
                color: "#fff",
                fontSize: 12,
              }}
              formatter={(value?: number, name?: string) => [
                name === "revenue" ? `$${(value ?? 0).toLocaleString()}` : (value ?? 0),
                name === "revenue" ? "Projected Revenue" : name === "users" ? "New Users" : "Conversions",
              ]}
            />
            {!compact && <Legend wrapperStyle={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }} />}
            <Bar dataKey="revenue" name="Revenue" radius={[6, 6, 0, 0]}>
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} fillOpacity={0.85} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {!compact && (
        <div className="grid grid-cols-3 gap-3">
          {forecast.periods.map((p) => (
            <div key={p.label} className="bg-white/[0.03] rounded-lg p-3 border border-white/5">
              <p className="text-xs font-semibold text-white/60">{p.label}</p>
              <p className="text-lg font-bold text-white">${p.projectedRevenue.toLocaleString()}</p>
              <p className="text-[10px] text-[#1CE7D0] mt-1">
                +{p.growthRate}% · {p.projectedNewUsers} new users
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
