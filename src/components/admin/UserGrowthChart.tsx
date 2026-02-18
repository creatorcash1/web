"use client";
// ─── User Growth Chart ──────────────────────────────────────────────────────
// Bar + line combo chart showing new users per month and cumulative total.
// ─────────────────────────────────────────────────────────────────────────────

import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { UserGrowthDataPoint } from "@/types/admin";

export default function UserGrowthChart({ data }: { data: UserGrowthDataPoint[] }) {
  return (
    <div className="bg-[#0D1B2A] rounded-xl border border-white/5 p-5">
      <h3 className="text-sm font-semibold text-white/70 mb-4">User Growth</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis
              dataKey="month"
              tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }}
              axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
              tickLine={false}
            />
            <YAxis
              yAxisId="left"
              tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0D1B2A",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                color: "#fff",
                fontSize: "12px",
              }}
            />
            <Legend wrapperStyle={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }} />
            <Bar
              yAxisId="left"
              dataKey="new_users"
              name="New Users"
              fill="#1CE7D0"
              radius={[4, 4, 0, 0]}
              opacity={0.7}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="total_users"
              name="Total Users"
              stroke="#FFC857"
              strokeWidth={2}
              dot={{ fill: "#FFC857", r: 3 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
