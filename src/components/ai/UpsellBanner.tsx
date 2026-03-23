"use client";
// ─── UpsellBanner ───────────────────────────────────────────────────────────
// User-facing banner shown on the user dashboard when AI has a recommendation.
// Max 1 recommendation per session (master prompt rule).
// Dismissible with X button; AI-branded with gold CTA.
// ─────────────────────────────────────────────────────────────────────────────

import type { RecommendedProduct } from "@/types/aiBrain";
import { XMarkIcon, SparklesIcon } from "@heroicons/react/24/outline";

interface Props {
  product: RecommendedProduct;
  onDismiss: () => void;
  onView?: () => void;
}

export default function UpsellBanner({ product, onDismiss, onView }: Props) {
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
    <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-[#0D1B2A] via-[#132d47] to-[#0d2e3a] border border-[#FFC857]/20 p-5 md:p-6 shadow-lg">
      {/* Glow decoration */}
      <div className="absolute -right-12 -top-12 w-40 h-40 bg-[#FFC857]/5 rounded-full blur-3xl" />
      <div className="absolute -left-8 -bottom-8 w-32 h-32 bg-[#1CE7D0]/5 rounded-full blur-2xl" />

      {/* Content */}
      <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* AI badge */}
        <div className="flex items-center gap-2 bg-[#FFC857]/10 rounded-lg px-3 py-2 shrink-0">
          <SparklesIcon className="w-5 h-5 text-[#FFC857]" />
          <span className="text-xs font-bold text-[#FFC857] uppercase tracking-wider">
            AI Pick
          </span>
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-bold text-sm md:text-base font-(family-name:--font-montserrat)">
            {product.title}
          </h3>
          <p className="text-white/50 text-xs mt-1 line-clamp-1">{product.reason}</p>
        </div>

        {/* Pricing + CTA */}
        <div className="flex items-center gap-3 shrink-0">
          {hasDiscount ? (
            <div className="text-right">
              <span className="text-[#FFC857] font-bold text-lg">${product.discountedPrice}</span>
              <span className="text-white/30 text-xs line-through ml-1.5">${product.price}</span>
            </div>
          ) : (
            <span className="text-white font-bold text-lg">${product.price}</span>
          )}
          <button
            onClick={() => {
              if (onView) {
                onView();
                return;
              }
              window.location.href = fallbackRoute;
            }}
            className="px-5 py-2.5 rounded-lg bg-[#FFC857] text-[#0D1B2A] text-xs font-bold uppercase tracking-wider hover:bg-[#f5b732] transition-colors shadow-md"
          >
            View Now
          </button>
        </div>
      </div>

      {/* Dismiss */}
      <button
        onClick={onDismiss}
        className="absolute top-3 right-3 text-white/20 hover:text-white/60 transition-colors"
        aria-label="Dismiss recommendation"
      >
        <XMarkIcon className="w-5 h-5" />
      </button>
    </div>
  );
}
