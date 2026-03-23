// ─── BookingCard ─────────────────────────────────────────────────────────────
// Mentorship booking card: mentor name, date, status badge, join button.
// ─────────────────────────────────────────────────────────────────────────────
import { CalendarDaysIcon, VideoCameraIcon } from "@heroicons/react/24/outline";
import type { MentorshipBooking, BookingStatus } from "@/types/dashboard";

interface Props {
  booking: MentorshipBooking;
}

const statusStyles: Record<BookingStatus, string> = {
  pending:   "bg-[#FFC857]/15 text-[#FFC857] border-[#FFC857]/30",
  confirmed: "bg-[#1CE7D0]/15 text-[#1CE7D0] border-[#1CE7D0]/30",
  completed: "bg-gray-100 text-gray-500 border-gray-200",
  cancelled: "bg-red-50 text-red-400 border-red-200",
};

export default function BookingCard({ booking }: Props) {
  const date = new Date(booking.scheduled_date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const time = new Date(booking.scheduled_date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className="bg-white rounded-2xl border border-[#E5E5E5] p-6 shadow-sm
                 hover:shadow-lg transition-all duration-300"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left */}
        <div className="flex items-start gap-4">
          {/* Mentor avatar placeholder */}
          <div className="w-12 h-12 rounded-full bg-[#0D1B2A] flex items-center justify-center text-[#FFC857] font-bold text-sm shrink-0">
            CC
          </div>
          <div>
            <h3 className="font-bold text-[#0D1B2A] text-sm">
              1:1 Mentorship · {booking.mentor_name}
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
              <CalendarDaysIcon className="w-3.5 h-3.5" aria-hidden="true" />
              {date} · {time} · {booking.duration_minutes} min
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3 ml-auto">
          {/* Status badge */}
          <span
            className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${statusStyles[booking.status]}`}
          >
            {booking.status}
          </span>

          {booking.status === "confirmed" && booking.meeting_url && (
            <a
              href={booking.meeting_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-[#1CE7D0] text-[#0D1B2A] text-xs font-bold
                         uppercase tracking-wider rounded-full px-4 py-2
                         hover:bg-[#16c9b5] transition-colors duration-200"
            >
              <VideoCameraIcon className="w-4 h-4" aria-hidden="true" />
              Join Session
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
