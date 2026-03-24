"use client";
// ─── Admin Users Section ────────────────────────────────────────────────────
// Searchable/filterable user table with role badges, status, and actions.
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import AdminTable, { type Column } from "@/components/admin/AdminTable";
import StatusBadge from "@/components/admin/StatusBadge";
import { deleteUserByAdmin, setUserSuspended } from "@/services/admin";
import type { AdminUser } from "@/types/admin";

export default function AdminUsersSection({ users }: { users: AdminUser[] }) {
  const [filter, setFilter] = useState<"all" | "active" | "suspended" | "banned">("all");
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();

  const suspendMutation = useMutation({
    mutationFn: ({ userId, suspended }: { userId: string; suspended: boolean }) =>
      setUserSuspended(userId, suspended),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (userId: string) => deleteUserByAdmin(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
    },
  });

  const filtered = users.filter((u) => {
    if (filter !== "all" && u.status !== filter) return false;
    if (search && !u.full_name.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const columns: Column<AdminUser>[] = [
    {
      key: "user",
      header: "User",
      render: (u) => (
        <div className="flex items-center gap-3">
          <img
            src={u.avatar_url}
            alt={u.full_name}
            className="w-8 h-8 rounded-full object-cover"
          />
          <div>
            <p className="text-sm font-medium text-white/90">{u.full_name}</p>
            <p className="text-xs text-white/40">{u.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      width: "w-24",
      render: (u) => (
        <span
          className={`text-xs font-semibold uppercase ${
            u.role === "admin" ? "text-[#FFC857]" : "text-white/50"
          }`}
        >
          {u.role}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      width: "w-28",
      render: (u) => <StatusBadge status={u.status} />,
    },
    {
      key: "courses",
      header: "Courses",
      width: "w-24",
      render: (u) => <span>{u.enrolled_courses}</span>,
    },
    {
      key: "spent",
      header: "Total Spent",
      width: "w-28",
      render: (u) => (
        <span className="text-[#FFC857] font-medium">${u.total_spent.toLocaleString()}</span>
      ),
    },
    {
      key: "joined",
      header: "Joined",
      width: "w-28",
      render: (u) => (
        <span className="text-white/40 text-xs">
          {new Date(u.created_at).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      width: "w-52",
      render: (u) => {
        const isSuspended = u.status === "suspended";
        const isBusy = suspendMutation.isPending || deleteMutation.isPending;

        return (
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isBusy}
              onClick={() => suspendMutation.mutate({ userId: u.id, suspended: !isSuspended })}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold border transition-colors disabled:opacity-50 ${
                isSuspended
                  ? "border-emerald-400/30 text-emerald-300 hover:bg-emerald-500/10"
                  : "border-amber-400/30 text-amber-300 hover:bg-amber-500/10"
              }`}
            >
              {isSuspended ? "Unsuspend" : "Suspend"}
            </button>

            <button
              type="button"
              disabled={isBusy}
              onClick={() => {
                const ok = window.confirm(`Delete ${u.full_name}? This will remove their login access.`);
                if (ok) {
                  deleteMutation.mutate(u.id);
                }
              }}
              className="px-2.5 py-1 rounded-md text-xs font-semibold border border-red-400/30 text-red-300 hover:bg-red-500/10 disabled:opacity-50"
            >
              Delete
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white font-(family-name:--font-montserrat)">
            Users
          </h2>
          <p className="text-sm text-white/40">{users.length} total users</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <input
            type="text"
            placeholder="Search users…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#FFC857]/40 w-48"
          />

          {/* Filter pills */}
          <div className="flex gap-1">
            {(["all", "active", "suspended", "banned"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors capitalize ${
                  filter === f
                    ? "bg-[#FFC857]/10 text-[#FFC857] border border-[#FFC857]/20"
                    : "text-white/40 hover:text-white/60 hover:bg-white/5"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#0D1B2A] rounded-xl border border-white/5 p-1">
        <AdminTable columns={columns} data={filtered} keyExtractor={(u) => u.id} emptyMessage="No users match your filters." />
      </div>
    </div>
  );
}
