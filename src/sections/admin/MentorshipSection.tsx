// ─── Admin Mentorship Section ────────────────────────────────────────────────
// Booking management table with status management, meeting links, user details.
// ─────────────────────────────────────────────────────────────────────────────

import AdminTable, { type Column } from "@/components/admin/AdminTable";
import StatusBadge from "@/components/admin/StatusBadge";
import { CalendarDaysIcon, LinkIcon, CurrencyDollarIcon } from "@heroicons/react/24/outline";
import type { AdminBooking } from "@/types/admin";

export default function AdminMentorshipSection({ bookings }: { bookings: AdminBooking[] }) {
  const confirmed = bookings.filter((b) => b.status === "confirmed").length;
  const pending = bookings.filter((b) => b.status === "pending").length;
  const totalRevenue = bookings
    .filter((b) => b.payment_status === "success")
    .reduce((s, b) => s + b.amount, 0);

  const columns: Column<AdminBooking>[] = [
    {
      key: "user",
      header: "Client",
      render: (b) => (
        <div>
          <p className="text-sm font-medium text-white/90">{b.user_name}</p>
          <p className="text-xs text-white/40">{b.user_email}</p>
        </div>
      ),
    },
    {
      key: "date",
      header: "Scheduled",
      width: "w-36",
      render: (b) => (
        <span className="text-sm text-white/60">
          {new Date(b.scheduled_date).toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          })}{" "}
          <span className="text-white/30">
            {new Date(b.scheduled_date).toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
            })}
          </span>
        </span>
      ),
    },
    {
      key: "duration",
      header: "Duration",
      width: "w-24",
      render: (b) => <span>{b.duration_minutes} min</span>,
    },
    {
      key: "status",
      header: "Status",
      width: "w-28",
      render: (b) => <StatusBadge status={b.status} />,
    },
    {
      key: "payment",
      header: "Payment",
      width: "w-28",
      render: (b) => <StatusBadge status={b.payment_status} />,
    },
    {
      key: "amount",
      header: "Amount",
      width: "w-24",
      render: (b) => <span className="text-[#FFC857] font-medium">${b.amount}</span>,
    },
    {
      key: "meeting",
      header: "Meeting",
      width: "w-24",
      render: (b) =>
        b.meeting_url ? (
          <a
            href={b.meeting_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-[#1CE7D0] hover:underline"
          >
            <LinkIcon className="w-3.5 h-3.5" />
            Join
          </a>
        ) : (
          <span className="text-xs text-white/20">—</span>
        ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white font-[family-name:var(--font-montserrat)]">
          Mentorship Bookings
        </h2>
        <p className="text-sm text-white/40 mt-1">{bookings.length} total bookings</p>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#0D1B2A] rounded-lg border border-white/5 p-4 flex items-center gap-3">
          <CalendarDaysIcon className="w-5 h-5 text-emerald-400" />
          <div>
            <p className="text-xs text-white/40">Confirmed</p>
            <p className="text-lg font-bold text-white">{confirmed}</p>
          </div>
        </div>
        <div className="bg-[#0D1B2A] rounded-lg border border-white/5 p-4 flex items-center gap-3">
          <CalendarDaysIcon className="w-5 h-5 text-amber-400" />
          <div>
            <p className="text-xs text-white/40">Pending</p>
            <p className="text-lg font-bold text-white">{pending}</p>
          </div>
        </div>
        <div className="bg-[#0D1B2A] rounded-lg border border-white/5 p-4 flex items-center gap-3">
          <CurrencyDollarIcon className="w-5 h-5 text-[#FFC857]" />
          <div>
            <p className="text-xs text-white/40">Revenue</p>
            <p className="text-lg font-bold text-[#FFC857]">${totalRevenue.toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-[#0D1B2A] rounded-lg border border-white/5 p-4 flex items-center gap-3">
          <CalendarDaysIcon className="w-5 h-5 text-sky-400" />
          <div>
            <p className="text-xs text-white/40">Completed</p>
            <p className="text-lg font-bold text-white">
              {bookings.filter((b) => b.status === "completed").length}
            </p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#0D1B2A] rounded-xl border border-white/5 p-1">
        <AdminTable
          columns={columns}
          data={bookings}
          keyExtractor={(b) => b.id}
          emptyMessage="No bookings yet."
        />
      </div>
    </div>
  );
}
