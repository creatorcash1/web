// ─── LiveSessionsSection ─────────────────────────────────────────────────────
// Upcoming and replay live sessions with countdown timer per spec.
// ─────────────────────────────────────────────────────────────────────────────
import { VideoCameraIcon, PlayIcon } from "@heroicons/react/24/outline";
import DashboardCountdown from "@/components/dashboard/DashboardCountdown";
import EmptyState from "@/components/dashboard/EmptyState";
import type { LiveSession } from "@/types/dashboard";

interface Props {
  sessions: LiveSession[];
}

export default function LiveSessionsSection({ sessions }: Props) {
  if (sessions.length === 0) {
    return (
      <EmptyState
        icon={<VideoCameraIcon className="w-8 h-8" />}
        title="No live sessions scheduled"
        description="Stay tuned — CC Mendel hosts live workshops & Q&As regularly. Check back soon!"
      />
    );
  }

  const upcoming = sessions.filter((s) => !s.is_replay_available);
  const replays  = sessions.filter((s) => s.is_replay_available);

  return (
    <div className="flex flex-col gap-8">
      <h2 className="font-bold text-[#0D1B2A] text-xl">Live Sessions</h2>

      {/* ── Upcoming ──────────────────────────────────── */}
      {upcoming.length > 0 && (
        <div className="flex flex-col gap-4">
          <h3 className="text-sm uppercase tracking-widest font-bold text-gray-400">Upcoming</h3>
          {upcoming.map((s) => {
            const isPast = new Date(s.scheduled_date).getTime() < Date.now();
            return (
              <div
                key={s.id}
                className="bg-white rounded-2xl border border-[#E5E5E5] p-6 shadow-sm
                           hover:shadow-lg transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-[#0D1B2A] text-base">{s.title}</h4>
                    <p className="text-sm text-gray-500 mt-1">{s.description}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(s.scheduled_date).toLocaleString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <DashboardCountdown targetDate={s.scheduled_date} />
                    <a
                      href={isPast ? undefined : `/live/${s.id}`}
                      aria-disabled={isPast}
                      className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider
                        rounded-full px-5 py-2.5 transition-all duration-200
                        ${
                          isPast
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : "bg-[#FFC857] text-[#0D1B2A] hover:bg-[#f5b732] hover:scale-[1.03] shadow-sm"
                        }`}
                      aria-label={isPast ? "Session not yet active" : "Join live session"}
                    >
                      <VideoCameraIcon className="w-4 h-4" aria-hidden="true" />
                      {isPast ? "Waiting…" : "Join Now"}
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Replays ───────────────────────────────────── */}
      {replays.length > 0 && (
        <div className="flex flex-col gap-4">
          <h3 className="text-sm uppercase tracking-widest font-bold text-gray-400">Replays</h3>
          {replays.map((s) => (
            <div
              key={s.id}
              className="bg-white rounded-2xl border border-[#E5E5E5] p-6 shadow-sm
                         hover:shadow-lg transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <h4 className="font-bold text-[#0D1B2A] text-base">{s.title}</h4>
                <p className="text-sm text-gray-500 mt-1">{s.description}</p>
              </div>
              <a
                href={s.replay_url ?? `/live/${s.id}`}
                className="inline-flex items-center gap-1.5 bg-[#0D1B2A] text-white text-xs
                           font-bold uppercase tracking-wider rounded-full px-5 py-2.5
                           hover:bg-[#1CE7D0] hover:text-[#0D1B2A] transition-all duration-200 flex-shrink-0"
              >
                <PlayIcon className="w-4 h-4" aria-hidden="true" />
                Watch Replay
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
