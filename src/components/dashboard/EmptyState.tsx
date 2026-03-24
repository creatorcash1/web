// ─── EmptyState ──────────────────────────────────────────────────────────────
// Premium empty state with gradient visuals and engaging copy.
// ─────────────────────────────────────────────────────────────────────────────
"use client";

import { SparklesIcon } from "@heroicons/react/24/solid";

interface Props {
  icon: React.ReactNode;
  title: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export default function EmptyState({ icon, title, description, ctaLabel, ctaHref }: Props) {
  return (
    <div className="relative flex flex-col items-center justify-center text-center py-20 px-6 overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-[#1CE7D0]/20 to-transparent rounded-full blur-3xl animate-glow-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-br from-[#FFC857]/20 to-transparent rounded-full blur-3xl animate-glow-pulse" style={{ animationDelay: "1s" }} />

      {/* Icon container with gradient border */}
      <div className="relative mb-8">
        <div className="absolute -inset-1 bg-gradient-to-r from-[#1CE7D0] via-[#FFC857] to-[#F472B6] rounded-3xl blur-lg opacity-50 animate-glow-pulse" />
        <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-[#0D1B2A] to-[#12263A] flex items-center justify-center text-[#1CE7D0] border border-white/10">
          <div className="animate-float-subtle">
            {icon}
          </div>
        </div>
      </div>

      {/* Title */}
      <h3 className="relative font-black text-[#0D1B2A] text-2xl md:text-3xl mb-3 tracking-tight">
        {title}
      </h3>

      {/* Description */}
      <p className="relative text-sm md:text-base text-[#0D1B2A]/60 max-w-md leading-relaxed mb-8">
        {description}
      </p>

      {/* CTA Button */}
      {ctaLabel && ctaHref && (
        <a
          href={ctaHref}
          className="group relative inline-flex items-center gap-2 overflow-hidden"
        >
          {/* Button glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-[#FFC857] to-[#F59E0B] rounded-2xl blur-md opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Button */}
          <span className="relative flex items-center gap-2 bg-gradient-to-r from-[#FFC857] to-[#F59E0B] text-[#0D1B2A] text-sm font-bold uppercase tracking-wide rounded-2xl px-8 py-4 shadow-xl shadow-amber-500/25 group-hover:shadow-amber-500/40 transition-all duration-300">
            <SparklesIcon className="w-4 h-4" />
            {ctaLabel}
            <span className="transform group-hover:translate-x-1 transition-transform duration-200">→</span>
          </span>
        </a>
      )}

      {/* Bottom decoration */}
      <div className="absolute bottom-8 flex items-center gap-2 text-[#0D1B2A]/30 text-xs">
        <span className="w-8 h-px bg-[#0D1B2A]/20" />
        <span>Your journey awaits</span>
        <span className="w-8 h-px bg-[#0D1B2A]/20" />
      </div>
    </div>
  );
}
