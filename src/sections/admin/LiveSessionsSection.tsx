// ─── Admin Live Sessions Section ────────────────────────────────────────────
// Lists upcoming and past live sessions with attendee counts and replay status.
// ─────────────────────────────────────────────────────────────────────────────

import StatusBadge from "@/components/admin/StatusBadge";
import {
  VideoCameraIcon,
  UsersIcon,
  PlayCircleIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import type { AdminLiveSession } from "@/types/admin";

export default function AdminLiveSessionsSection({
  sessions,
}: {
  sessions: AdminLiveSession[];
}) {
  const upcoming = sessions.filter((s) => s.status === "upcoming" || s.status === "live");
  const past = sessions.filter((s) => s.status === "completed" || s.status === "cancelled");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white font-(family-name:--font-montserrat)">
          Live Sessions
        </h2>
        <p className="text-sm text-white/40 mt-1">
          {sessions.length} sessions · {upcoming.length} upcoming
        </p>
      </div>

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-3">
            Upcoming
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcoming.map((s) => (
              <div
                key={s.id}
                className="bg-[#0D1B2A] rounded-xl border border-[#FFC857]/10 p-5 hover:border-[#FFC857]/30 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <VideoCameraIcon className="w-5 h-5 text-[#FFC857]" />
                    <StatusBadge status={s.status} />
                  </div>
                  <span className="text-xs text-white/30">{s.duration_minutes} min</span>
                </div>
                <h4 className="text-white font-semibold mt-3">{s.title}</h4>
                <p className="text-xs text-white/40 mt-1 line-clamp-2">{s.description}</p>
                <div className="flex items-center gap-4 mt-4 text-xs text-white/50">
                  <span className="flex items-center gap-1">
                    <CalendarIcon className="w-3.5 h-3.5" />
                    {new Date(s.scheduled_date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    <UsersIcon className="w-3.5 h-3.5" />
                    {s.attendees}/{s.max_capacity} registered
                  </span>
                </div>
                {/* Capacity bar */}
                <div className="mt-3 h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#FFC857] transition-all"
                    style={{ width: `${(s.attendees / s.max_capacity) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Past */}
      {past.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-3">
            Past Sessions
          </h3>
          <div className="space-y-3">
            {past.map((s) => (
              <div
                key={s.id}
                className="bg-[#0D1B2A] rounded-xl border border-white/5 p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                    <VideoCameraIcon className="w-5 h-5 text-white/30" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white/80">{s.title}</p>
                    <p className="text-xs text-white/40">
                      {new Date(s.scheduled_date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}{" "}
                      · {s.attendees} attendees
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={s.status} />
                  {s.is_replay_available && (
                    <a href={`/live/${s.id}`} className="flex items-center gap-1 text-xs text-[#1CE7D0] hover:underline">
                      <PlayCircleIcon className="w-4 h-4" />
                      Replay
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
