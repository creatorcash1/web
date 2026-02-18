// ─── PaymentRow ──────────────────────────────────────────────────────────────
// Single transaction row for the payments table: date, item, amount, status, invoice.
// ─────────────────────────────────────────────────────────────────────────────
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import type { Payment, PaymentStatus } from "@/types/dashboard";

interface Props {
  payment: Payment;
}

const statusColors: Record<PaymentStatus, string> = {
  success: "text-[#1CE7D0]",
  pending: "text-[#FFC857]",
  failed:  "text-red-400",
};

export default function PaymentRow({ payment }: Props) {
  const date = new Date(payment.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div
      className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-0 py-4 px-5
                 border-b border-[#E5E5E5] last:border-0 hover:bg-[#E5E5E5]/40 transition-colors duration-150"
    >
      {/* Date */}
      <span className="text-xs text-gray-400 sm:w-28 flex-shrink-0">{date}</span>

      {/* Item */}
      <span className="text-sm font-medium text-[#0D1B2A] flex-1">{payment.item}</span>

      {/* Amount */}
      <span className="text-sm font-bold text-[#0D1B2A] sm:w-24 text-right tabular-nums">
        ${payment.amount.toFixed(2)}
      </span>

      {/* Status */}
      <span className={`text-xs font-bold uppercase tracking-wider sm:w-24 text-right ${statusColors[payment.status]}`}>
        {payment.status}
      </span>

      {/* Invoice */}
      <div className="sm:w-20 flex justify-end">
        {payment.invoice_url ? (
          <a
            href={payment.invoice_url}
            aria-label={`Download invoice for ${payment.item}`}
            className="text-white/80 bg-[#0D1B2A] rounded-full p-2 hover:bg-[#1CE7D0] hover:text-[#0D1B2A] transition-colors duration-200"
          >
            <ArrowDownTrayIcon className="w-3.5 h-3.5" />
          </a>
        ) : (
          <span className="text-xs text-gray-300">—</span>
        )}
      </div>
    </div>
  );
}
