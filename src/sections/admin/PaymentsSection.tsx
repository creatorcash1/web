"use client";
// ─── Admin Payments Section ─────────────────────────────────────────────────
// Full transaction table with filters, summary stats, and CSV-style export.
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";
import AdminTable, { type Column } from "@/components/admin/AdminTable";
import StatusBadge from "@/components/admin/StatusBadge";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import type { AdminPayment, PaymentStatus } from "@/types/admin";

export default function AdminPaymentsSection({ payments }: { payments: AdminPayment[] }) {
  const [statusFilter, setStatusFilter] = useState<"all" | PaymentStatus>("all");
  const [typeFilter, setTypeFilter] = useState<"all" | "course" | "pdf" | "mentorship" | "bundle">(
    "all"
  );

  const filtered = payments.filter((p) => {
    if (statusFilter !== "all" && p.status !== statusFilter) return false;
    if (typeFilter !== "all" && p.item_type !== typeFilter) return false;
    return true;
  });

  const totalSuccess = payments
    .filter((p) => p.status === "success")
    .reduce((s, p) => s + p.amount, 0);
  const totalPending = payments
    .filter((p) => p.status === "pending")
    .reduce((s, p) => s + p.amount, 0);

  const columns: Column<AdminPayment>[] = [
    {
      key: "date",
      header: "Date",
      width: "w-28",
      render: (p) => (
        <span className="text-xs text-white/50">
          {new Date(p.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      key: "user",
      header: "Customer",
      render: (p) => (
        <div>
          <p className="text-sm text-white/90">{p.user_name}</p>
          <p className="text-xs text-white/30">{p.user_email}</p>
        </div>
      ),
    },
    {
      key: "item",
      header: "Item",
      render: (p) => (
        <div className="flex items-center gap-2">
          <span className="text-sm text-white/70">{p.item}</span>
          <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-white/5 text-white/30">
            {p.item_type}
          </span>
        </div>
      ),
    },
    {
      key: "amount",
      header: "Amount",
      width: "w-24",
      render: (p) => <span className="text-[#FFC857] font-medium">${p.amount}</span>,
    },
    {
      key: "method",
      header: "Method",
      width: "w-24",
      render: (p) => <span className="text-xs text-white/50 capitalize">{p.method}</span>,
    },
    {
      key: "status",
      header: "Status",
      width: "w-28",
      render: (p) => <StatusBadge status={p.status} />,
    },
    {
      key: "invoice",
      header: "Invoice",
      width: "w-20",
      render: (p) =>
        p.invoice_url ? (
          <a
            href={p.invoice_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#1CE7D0] hover:underline flex items-center gap-1"
          >
            <ArrowDownTrayIcon className="w-3.5 h-3.5" />
            PDF
          </a>
        ) : (
          <span className="text-xs text-white/20">—</span>
        ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white font-[family-name:var(--font-montserrat)]">
            Payments
          </h2>
          <p className="text-sm text-white/40">{payments.length} total transactions</p>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-[#0D1B2A] rounded-lg border border-white/5 p-4">
          <p className="text-xs text-white/40">Collected</p>
          <p className="text-xl font-bold text-emerald-400 mt-1">${totalSuccess.toLocaleString()}</p>
        </div>
        <div className="bg-[#0D1B2A] rounded-lg border border-white/5 p-4">
          <p className="text-xs text-white/40">Pending</p>
          <p className="text-xl font-bold text-amber-400 mt-1">${totalPending.toLocaleString()}</p>
        </div>
        <div className="bg-[#0D1B2A] rounded-lg border border-white/5 p-4">
          <p className="text-xs text-white/40">Failed</p>
          <p className="text-xl font-bold text-red-400 mt-1">
            ${payments
              .filter((p) => p.status === "failed")
              .reduce((s, p) => s + p.amount, 0)
              .toLocaleString()}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {/* Status filter */}
        <div className="flex gap-1">
          {(["all", "success", "pending", "failed"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors capitalize ${
                statusFilter === f
                  ? "bg-[#FFC857]/10 text-[#FFC857] border border-[#FFC857]/20"
                  : "text-white/40 hover:text-white/60 hover:bg-white/5"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="w-px h-8 bg-white/10" />
        {/* Type filter */}
        <div className="flex gap-1">
          {(["all", "course", "pdf", "mentorship"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setTypeFilter(f)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors capitalize ${
                typeFilter === f
                  ? "bg-[#1CE7D0]/10 text-[#1CE7D0] border border-[#1CE7D0]/20"
                  : "text-white/40 hover:text-white/60 hover:bg-white/5"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#0D1B2A] rounded-xl border border-white/5 p-1">
        <AdminTable
          columns={columns}
          data={filtered}
          keyExtractor={(p) => p.id}
          emptyMessage="No payments match your filters."
        />
      </div>
    </div>
  );
}
