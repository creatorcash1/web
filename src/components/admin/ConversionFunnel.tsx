// ─── Conversion Funnel ──────────────────────────────────────────────────────
// Horizontal bar-style funnel visualization showing conversion at each stage.
// ─────────────────────────────────────────────────────────────────────────────

import type { ConversionFunnelStep } from "@/types/admin";

export default function ConversionFunnel({ data }: { data: ConversionFunnelStep[] }) {
  const maxCount = data[0]?.count ?? 1;

  return (
    <div className="bg-[#0D1B2A] rounded-xl border border-white/5 p-5">
      <h3 className="text-sm font-semibold text-white/70 mb-5">Conversion Funnel</h3>
      <div className="space-y-4">
        {data.map((step, i) => {
          const widthPercent = (step.count / maxCount) * 100;
          // Gradient from gold → teal as funnel narrows
          const color = i < 2 ? "#FFC857" : i < 4 ? "#1CE7D0" : "#818CF8";
          return (
            <div key={step.stage}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm text-white/60">{step.stage}</span>
                <span className="text-sm font-medium text-white/80">
                  {step.count.toLocaleString()}{" "}
                  <span className="text-white/30">({step.rate}%)</span>
                </span>
              </div>
              <div className="h-3 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${widthPercent}%`, backgroundColor: color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
