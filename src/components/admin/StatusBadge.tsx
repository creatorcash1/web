// ─── Status Badge ───────────────────────────────────────────────────────────
// Reusable pill badge for statuses like "active", "completed", "pending", etc.
// ─────────────────────────────────────────────────────────────────────────────

const STYLE_MAP: Record<string, string> = {
  // User statuses
  active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  suspended: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  banned: "bg-red-500/10 text-red-400 border-red-500/20",
  // Payment statuses
  success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  failed: "bg-red-500/10 text-red-400 border-red-500/20",
  // Booking statuses
  confirmed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  completed: "bg-sky-500/10 text-sky-400 border-sky-500/20",
  cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
  // Product statuses
  published: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  draft: "bg-white/5 text-white/40 border-white/10",
  // Session statuses
  upcoming: "bg-[#FFC857]/10 text-[#FFC857] border-[#FFC857]/20",
  live: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function StatusBadge({ status }: { status: string }) {
  const style = STYLE_MAP[status] ?? "bg-white/5 text-white/50 border-white/10";

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${style}`}
    >
      {status}
    </span>
  );
}
