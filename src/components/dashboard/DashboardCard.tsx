// ─── DashboardCard ───────────────────────────────────────────────────────────
// Stat card for the overview grid: gold number, navy accent border, shadow.
// ─────────────────────────────────────────────────────────────────────────────

interface DashboardCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  suffix?: string;
}

export default function DashboardCard({
  icon,
  label,
  value,
  suffix,
}: DashboardCardProps) {
  return (
    <div
      className="bg-white rounded-2xl border border-[#E5E5E5] p-5 shadow-sm
                 hover:shadow-lg hover:border-[#0D1B2A]/20 hover:-translate-y-0.5
                 transition-all duration-300 flex items-start gap-4"
    >
      {/* Icon circle */}
      <div className="w-12 h-12 rounded-xl bg-[#0D1B2A] flex items-center justify-center text-[#FFC857] shrink-0">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-1">
          {label}
        </p>
        <p className="text-3xl font-black text-[#FFC857] leading-none">
          {value}
          {suffix && (
            <span className="text-lg text-gray-400 font-medium ml-0.5">{suffix}</span>
          )}
        </p>
      </div>
    </div>
  );
}
