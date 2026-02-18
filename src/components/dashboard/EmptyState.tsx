// ─── EmptyState ──────────────────────────────────────────────────────────────
// Elegant empty-state card with motivational tone and CTA.
// ─────────────────────────────────────────────────────────────────────────────

interface Props {
  icon: React.ReactNode;
  title: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export default function EmptyState({ icon, title, description, ctaLabel, ctaHref }: Props) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <div className="w-16 h-16 rounded-2xl bg-[#E5E5E5] flex items-center justify-center text-[#1CE7D0] mb-5">
        {icon}
      </div>
      <h3 className="font-bold text-[#0D1B2A] text-lg mb-2">{title}</h3>
      <p className="text-sm text-gray-500 max-w-sm leading-relaxed mb-6">{description}</p>
      {ctaLabel && ctaHref && (
        <a
          href={ctaHref}
          className="inline-flex items-center justify-center bg-[#FFC857] text-[#0D1B2A] text-sm
                     font-bold uppercase tracking-wider rounded-full px-6 py-3
                     hover:bg-[#f5b732] hover:scale-[1.03] transition-all duration-200 shadow-sm"
        >
          {ctaLabel}
        </a>
      )}
    </div>
  );
}
