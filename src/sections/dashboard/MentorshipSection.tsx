// ─── MentorshipSection ───────────────────────────────────────────────────────
// Shows booked mentorship sessions or a CTA to book one.
// ─────────────────────────────────────────────────────────────────────────────
import Link from "next/link";
import { UserGroupIcon, SparklesIcon } from "@heroicons/react/24/outline";
import BookingCard from "@/components/dashboard/BookingCard";
import EmptyState from "@/components/dashboard/EmptyState";
import type { MentorshipBooking } from "@/types/dashboard";

interface Props {
  bookings: MentorshipBooking[];
}

export default function MentorshipSection({ bookings }: Props) {
  if (bookings.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <EmptyState
          icon={<UserGroupIcon className="w-8 h-8" />}
          title="No mentorship booked"
          description="Take your progress to the next level with a personal 2-hour strategy session with CC Mendel."
          ctaLabel="Book Mentorship"
          ctaHref="/dashboard/mentorship"
        />

        {/* Extra CTA card */}
        <div className="bg-linear-to-r from-[#0D1B2A] to-[#0d2e3a] rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
          <div className="flex items-start gap-4">
            <SparklesIcon className="w-8 h-8 text-[#FFC857] shrink-0" aria-hidden="true" />
            <div>
              <h3 className="text-white font-bold text-lg">Book Your 2-Hour 1:1 Mentorship</h3>
              <p className="text-white/60 text-sm mt-1">
                Walk away with a working digital asset, a personalised action plan, and direct guidance from CC Mendel.
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/mentorship"
            className="inline-flex items-center justify-center bg-[#FFC857] text-[#0D1B2A] text-sm
                       font-bold uppercase tracking-wider rounded-full px-6 py-3
                       hover:bg-[#f5b732] hover:scale-[1.03] transition-all duration-200 shadow-sm shrink-0"
          >
            Book Now — $950
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-bold text-[#0D1B2A] text-xl mb-5">My Mentorship Sessions</h2>
      <div className="flex flex-col gap-4">
        {bookings.map((b) => (
          <BookingCard key={b.id} booking={b} />
        ))}
      </div>
    </div>
  );
}
