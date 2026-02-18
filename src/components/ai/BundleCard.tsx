"use client";
// ─── BundleCard ─────────────────────────────────────────────────────────────
// Shows a suggested revenue bundle from the Revenue Optimizer.
// ─────────────────────────────────────────────────────────────────────────────

import type { SuggestedBundle } from "@/types/aiBrain";

interface Props {
  bundle: SuggestedBundle;
}

export default function BundleCard({ bundle }: Props) {
  const likelihood = Math.round(bundle.conversionLikelihood * 100);

  return (
    <div className="bg-gradient-to-br from-[#0D1B2A] to-[#132438] border border-white/10 rounded-xl p-5 hover:border-[#1CE7D0]/20 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-bold text-white/40 uppercase tracking-wider">Bundle</p>
        <span className="text-[10px] font-bold text-[#1CE7D0] bg-[#1CE7D0]/10 px-2 py-0.5 rounded-full">
          {bundle.savingsPercent}% off
        </span>
      </div>

      {/* Pricing */}
      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-2xl font-bold text-white font-[family-name:var(--font-montserrat)]">
          ${bundle.bundlePrice}
        </span>
        <span className="text-sm text-white/30 line-through">${bundle.originalTotal}</span>
      </div>

      {/* Details */}
      <p className="text-xs text-white/50 mb-3">{bundle.targetAudience}</p>

      {/* Conversion bar */}
      <div className="mb-1.5">
        <div className="flex items-center justify-between text-[10px] text-white/30 mb-1">
          <span>Conversion Likelihood</span>
          <span>{likelihood}%</span>
        </div>
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#1CE7D0] rounded-full transition-all duration-500"
            style={{ width: `${likelihood}%` }}
          />
        </div>
      </div>

      {/* Products count */}
      <p className="text-[10px] text-white/20 mt-2">
        {bundle.products.length} product{bundle.products.length > 1 ? "s" : ""} included
      </p>
    </div>
  );
}
