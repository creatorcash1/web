// ─── DashboardCard ───────────────────────────────────────────────────────────
// Premium stat card with gradient accents and smooth animations.
// ─────────────────────────────────────────────────────────────────────────────
"use client";

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
    <div className="group relative overflow-hidden rounded-3xl transition-all duration-500 hover:-translate-y-1">
      {/* Glow effect on hover */}
      <div className="absolute -inset-1 bg-gradient-to-r from-[#1CE7D0]/20 to-[#FFC857]/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Card */}
      <div className="relative bg-white rounded-3xl border border-[#0D1B2A]/5 p-6 shadow-sm group-hover:shadow-xl group-hover:border-[#1CE7D0]/20 transition-all duration-500">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#1CE7D0]/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="relative flex items-start gap-4">
          {/* Icon with gradient background */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-br from-[#1CE7D0] to-[#0D1B2A] rounded-2xl blur-md opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
            <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0D1B2A] to-[#12263A] flex items-center justify-center text-[#1CE7D0] shrink-0 shadow-lg">
              {icon}
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[10px] text-[#0D1B2A]/40 uppercase tracking-widest font-bold mb-2">
              {label}
            </p>
            <div className="flex items-baseline gap-1">
              <p className="text-4xl font-black bg-gradient-to-r from-[#0D1B2A] to-[#1CE7D0] bg-clip-text text-transparent leading-none">
                {value}
              </p>
              {suffix && (
                <span className="text-xl text-[#0D1B2A]/30 font-bold">{suffix}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
