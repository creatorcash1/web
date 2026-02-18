// ─── PaymentsSection ─────────────────────────────────────────────────────────
// Transaction history table with invoice download.
// ─────────────────────────────────────────────────────────────────────────────
import { CreditCardIcon } from "@heroicons/react/24/outline";
import PaymentRow from "@/components/dashboard/PaymentRow";
import EmptyState from "@/components/dashboard/EmptyState";
import type { Payment } from "@/types/dashboard";

interface Props {
  payments: Payment[];
}

export default function PaymentsSection({ payments }: Props) {
  if (payments.length === 0) {
    return (
      <EmptyState
        icon={<CreditCardIcon className="w-8 h-8" />}
        title="No transactions yet"
        description="Your payment history will appear here once you enrol in a course or purchase a digital product."
        ctaLabel="Browse Courses"
        ctaHref="/courses"
      />
    );
  }

  return (
    <div>
      <h2 className="font-bold text-[#0D1B2A] text-xl mb-5">Payment History</h2>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#E5E5E5] shadow-sm overflow-hidden">
        {/* Header — desktop only */}
        <div className="hidden sm:flex items-center py-3 px-5 border-b border-[#E5E5E5] text-xs text-gray-400 uppercase tracking-widest font-semibold">
          <span className="w-28">Date</span>
          <span className="flex-1">Item</span>
          <span className="w-24 text-right">Amount</span>
          <span className="w-24 text-right">Status</span>
          <span className="w-20 text-right">Invoice</span>
        </div>

        {payments.map((p) => (
          <PaymentRow key={p.id} payment={p} />
        ))}
      </div>
    </div>
  );
}
