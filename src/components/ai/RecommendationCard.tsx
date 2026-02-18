"use client";
// ─── RecommendationCard ─────────────────────────────────────────────────────
// Shows a product recommendation from the Upsell Strategist.
// ─────────────────────────────────────────────────────────────────────────────

import type { RecommendedProduct } from "@/types/aiBrain";

interface Props {
  product: RecommendedProduct;
  onDismiss?: () => void;
  onView?: () => void;
}

const TYPE_LABELS: Record<string, string> = {
  course: "🎓 Course",
  pdf: "📄 PDF",
  mentorship: "🎯 Mentorship",
  bundle: "📦 Bundle",
};

export default function RecommendationCard({ product, onDismiss, onView }: Props) {
  const hasDiscount = product.discountedPrice !== null && product.discountedPrice < product.price;

  const fallbackRoute =
    product.productType === "course"
      ? `/courses/${product.productId}`
      : product.productType === "pdf"
      ? `/pdfs/${product.productId}`
      : product.productType === "mentorship"
      ? `/mentorship/${product.productId}`
      : `/checkout/${product.productId}`;

  return (
    <div className="group relative bg-gradient-to-br from-[#0D1B2A] to-[#162d44] border border-white/10 rounded-xl p-5 hover:border-[#FFC857]/30 transition-all duration-300">
      {/* Top row */}
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs text-white/40 font-medium">
          {TYPE_LABELS[product.productType] ?? product.productType}
        </span>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-white/20 hover:text-white/60 text-lg leading-none"
            aria-label="Dismiss"
          >
            ×
          </button>
        )}
      </div>

      {/* Title */}
      <h4 className="text-white font-bold text-sm mb-1.5 font-[family-name:var(--font-montserrat)]">
        {product.title}
      </h4>

      {/* Reason */}
      <p className="text-white/50 text-xs mb-4 leading-relaxed">
        {product.reason}
      </p>

      {/* Price + CTA */}
      <div className="flex items-center justify-between">
        <div className="flex items-baseline gap-2">
          {hasDiscount ? (
            <>
              <span className="text-[#FFC857] font-bold text-lg">${product.discountedPrice}</span>
              <span className="text-white/30 text-sm line-through">${product.price}</span>
            </>
          ) : (
            <span className="text-white font-bold text-lg">${product.price}</span>
          )}
        </div>
        <button
          onClick={() => {
            if (onView) {
              onView();
              return;
            }
            window.location.href = fallbackRoute;
          }}
          className="px-4 py-2 rounded-lg bg-[#FFC857] text-[#0D1B2A] text-xs font-bold uppercase tracking-wider hover:bg-[#f5b732] transition-colors"
        >
          View
        </button>
      </div>

      {/* Priority indicator */}
      {product.priority <= 2 && (
        <div className="absolute top-3 right-3">
          <span className="text-[10px] font-bold text-[#1CE7D0] bg-[#1CE7D0]/10 px-2 py-0.5 rounded-full">
            ★ Top Pick
          </span>
        </div>
      )}
    </div>
  );
}
