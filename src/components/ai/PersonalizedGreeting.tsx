"use client";
// ─── PersonalizedGreeting ───────────────────────────────────────────────────
// AI-generated personalized greeting banner for user dashboard.
// Brand tone: premium, confident, authority.
// ─────────────────────────────────────────────────────────────────────────────

interface Props {
  greeting: string;
  streak?: number;
}

export default function PersonalizedGreeting({ greeting, streak }: Props) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0D1B2A] via-[#0D1B2A] to-[#1CE7D0]/10 border border-white/5 p-6">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFC857]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#1CE7D0]/5 rounded-full blur-2xl" />

      <div className="relative flex items-center gap-4">
        {/* AI Brain icon */}
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FFC857]/20 to-[#1CE7D0]/20 flex items-center justify-center flex-shrink-0 shadow-[0_0_20px_rgba(255,200,87,0.1)]">
          <span className="text-xl">🧠</span>
        </div>

        <div className="flex-1">
          <p className="text-sm md:text-base text-white/90 font-medium leading-relaxed">
            {greeting}
          </p>
          {streak !== undefined && streak > 0 && (
            <p className="text-xs text-[#FFC857] mt-1.5 font-semibold">
              🔥 {streak}-day streak — keep it going!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
