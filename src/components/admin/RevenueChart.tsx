"use client";
// ─── Revenue Chart ──────────────────────────────────────────────────────────
// Stacked area chart showing revenue by category over time using Recharts.
// ─────────────────────────────────────────────────────────────────────────────

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { RevenueDataPoint } from "@/types/admin";

export default function RevenueChart({ data }: { data: RevenueDataPoint[] }) {
  return (
    <div className="bg-[#0D1B2A] rounded-xl border border-white/5 p-5">
      <h3 className="text-sm font-semibold text-white/70 mb-4">Revenue Over Time</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="colorCourses" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FFC857" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#FFC857" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorPdfs" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1CE7D0" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#1CE7D0" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorMentorship" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#818CF8" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#818CF8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis
              dataKey="month"
              tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }}
              axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0D1B2A",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                color: "#fff",
                fontSize: "12px",
              }}
              formatter={(value: number | undefined) => value != null ? [`$${value.toLocaleString()}`] : []}
            />
            <Legend
              wrapperStyle={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}
            />
            <Area
              type="monotone"
              dataKey="courses"
              name="Courses"
              stroke="#FFC857"
              fillOpacity={1}
              fill="url(#colorCourses)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="pdfs"
              name="PDFs"
              stroke="#1CE7D0"
              fillOpacity={1}
              fill="url(#colorPdfs)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="mentorship"
              name="Mentorship"
              stroke="#818CF8"
              fillOpacity={1}
              fill="url(#colorMentorship)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
