"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  completeTikTokRequest,
  fetchGroupSchedule,
  fetchTikTokGroups,
  fetchTikTokRequests,
  updateTikTokGroup,
  initTikTokGroups,
} from "@/services/tiktokOps";
import type { TikTokGroup, TikTokRequestStatus, TikTokScheduleMember } from "@/types/tiktok";
import {
  CheckCircleIcon,
  ClockIcon,
  PaperAirplaneIcon,
  UsersIcon,
  ArrowPathIcon,
  PlusCircleIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";

export default function TikTokOpsSection() {
  const [statusFilter, setStatusFilter] = useState<TikTokRequestStatus | "all">("pending");
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [editDraftByGroup, setEditDraftByGroup] = useState<Record<string, { name: string; inviteUrl: string }>>({});
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);

  const requestsQuery = useQuery({
    queryKey: ["tiktok-requests", statusFilter],
    queryFn: () => fetchTikTokRequests(statusFilter === "all" ? undefined : statusFilter as TikTokRequestStatus),
    staleTime: 30_000,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const groupsQuery = useQuery({
    queryKey: ["tiktok-groups"],
    queryFn: fetchTikTokGroups,
    staleTime: 30_000,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const scheduleQuery = useQuery({
    queryKey: ["tiktok-schedule", selectedGroupId],
    queryFn: () => fetchGroupSchedule(selectedGroupId as string),
    enabled: Boolean(selectedGroupId),
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const completeMutation = useMutation({
    mutationFn: completeTikTokRequest,
    onSuccess: (data) => {
      requestsQuery.refetch();
      groupsQuery.refetch();
      setActionMessage(
        `Assigned to ${data.groupName ?? "Group"} at position #${data.position}` +
          (data.inviteUrl ? ` — invite: ${data.inviteUrl}` : "") +
          (data.notified === false ? " — webhook not sent" : ""),
      );
    },
    onError: (err: any) => {
      setActionMessage(err?.message || "Failed to complete request");
    },
  });

  const updateGroupMutation = useMutation({
    mutationFn: ({ groupId, name, inviteUrl }: { groupId: string; name?: string; inviteUrl?: string }) =>
      updateTikTokGroup(groupId, { name, inviteUrl }),
    onSuccess: () => {
      groupsQuery.refetch();
      setEditingGroupId(null);
      setActionMessage("Group updated successfully");
    },
    onError: (err: any) => {
      setActionMessage(err?.message || "Failed to update group");
    },
  });

  const initGroupsMutation = useMutation({
    mutationFn: initTikTokGroups,
    onSuccess: (data) => {
      groupsQuery.refetch();
      setActionMessage(data.message);
    },
    onError: (err: any) => {
      setActionMessage(err?.message || "Failed to initialize groups");
    },
  });

  const pendingCount = useMemo(
    () => (requestsQuery.data || []).filter((r) => r.status === "pending").length,
    [requestsQuery.data],
  );
  const completedCount = useMemo(
    () => (requestsQuery.data || []).filter((r) => r.status === "completed").length,
    [requestsQuery.data],
  );
  const totalSeats = useMemo(() => {
    const groups = groupsQuery.data || [];
    const capacity = groups.reduce((sum, g) => sum + (g.max_members || 0), 0);
    const filled = groups.reduce((sum, g) => sum + (g.member_count || 0), 0);
    return { capacity, filled };
  }, [groupsQuery.data]);

  const currentSchedule: TikTokScheduleMember[] = scheduleQuery.data || [];
  const groups: TikTokGroup[] = groupsQuery.data || [];

  return (
    <div className="space-y-6">
      <div className="bg-linear-to-r from-[#FFC857]/10 via-[#1CE7D0]/5 to-transparent rounded-xl border border-[#FFC857]/10 p-6">
        <h1 className="text-2xl font-bold text-white font-(family-name:--font-montserrat)">TikTok Ops</h1>
        <p className="text-white/60 text-sm mt-1">Manage promo student account requests, group assignments, and daily posting schedule.</p>
        {actionMessage && <p className="text-xs text-[#1CE7D0] mt-2">{actionMessage}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Pending requests" value={pendingCount} Icon={ClockIcon} accent="#FFC857" />
        <StatCard label="Completed" value={completedCount} Icon={CheckCircleIcon} accent="#1CE7D0" />
        <StatCard
          label="Seats filled"
          value={`${totalSeats.filled}/${totalSeats.capacity || 12500}`}
          Icon={UsersIcon}
          accent="#60a5fa"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-[#0D1B2A] border border-white/5 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white text-lg font-semibold">TikTok account requests</h3>
              <p className="text-white/50 text-sm">Approve promo students and auto-assign to a group.</p>
            </div>
            <div className="flex items-center gap-2">
              {(["all", "pending", "completed"] as const).map((option) => (
                <button
                  key={option}
                  onClick={() => setStatusFilter(option)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-colors ${
                    statusFilter === option
                      ? "bg-[#FFC857]/20 border-[#FFC857]/40 text-[#FFC857]"
                      : "border-white/10 text-white/60 hover:text-white"
                  }`}
                >
                  {option}
                </button>
              ))}
              <button
                onClick={() => requestsQuery.refetch()}
                className="p-2 rounded-lg border border-white/10 text-white/60 hover:text-white"
                title="Refresh"
              >
                <ArrowPathIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {requestsQuery.isError && <p className="text-red-300 text-sm">Failed to load requests. Try refreshing.</p>}
            {requestsQuery.isLoading && (
              <p className="text-white/50 text-sm">Loading requests…</p>
            )}
            {!requestsQuery.isLoading && requestsQuery.data?.length === 0 && (
              <p className="text-white/50 text-sm">No requests found.</p>
            )}

            {(requestsQuery.data || []).map((req) => (
              <div
                key={req.id}
                className="border border-white/5 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center gap-4"
              >
                <div className="flex-1">
                  <p className="text-white font-semibold">{req.full_name}</p>
                  <p className="text-white/60 text-sm">{req.email} · {req.phone}</p>
                  {req.tiktok_groups?.name && (
                    <p className="text-[#1CE7D0] text-xs mt-1">Group: {req.tiktok_groups.name}</p>
                  )}
                  <p className="text-white/40 text-xs mt-1">Requested on {new Date(req.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-1 rounded-md text-xs font-semibold ${
                      req.status === "pending"
                        ? "bg-yellow-500/10 text-[#FFC857] border border-[#FFC857]/30"
                        : "bg-emerald-500/10 text-emerald-300 border border-emerald-400/30"
                    }`}
                  >
                    {req.status}
                  </span>
                  <button
                    disabled={req.status !== "pending" || completeMutation.isPending}
                    onClick={() => completeMutation.mutate(req.id)}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#1CE7D0] text-[#0D1B2A] text-xs font-bold uppercase disabled:opacity-50"
                  >
                    <PaperAirplaneIcon className="w-4 h-4" />
                    {completeMutation.isPending ? "Assigning…" : "Complete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-[#0D1B2A] border border-white/5 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-white text-lg font-semibold">Groups</h3>
                <p className="text-white/50 text-sm">
                  {groups.length} groups • Capacity: 250 each
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => initGroupsMutation.mutate()}
                  disabled={initGroupsMutation.isPending || groups.length >= 50}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1CE7D0] text-[#0D1B2A] text-xs font-bold uppercase disabled:opacity-50"
                  title="Initialize 50 groups"
                >
                  <PlusCircleIcon className="w-4 h-4" />
                  {initGroupsMutation.isPending ? "Creating…" : "Init Groups"}
                </button>
                <button
                  onClick={() => groupsQuery.refetch()}
                  className="p-2 rounded-lg border border-white/10 text-white/60 hover:text-white"
                  title="Refresh"
                >
                  <ArrowPathIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {groups.length === 0 && !groupsQuery.isLoading && (
              <div className="text-center py-8">
                <p className="text-white/50 text-sm mb-3">No groups yet.</p>
                <button
                  onClick={() => initGroupsMutation.mutate()}
                  disabled={initGroupsMutation.isPending}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FFC857] text-[#0D1B2A] text-sm font-bold"
                >
                  <PlusCircleIcon className="w-5 h-5" />
                  Create 50 Groups
                </button>
              </div>
            )}
            
            <div className="space-y-2 max-h-[400px] overflow-auto pr-1">
              {groups.map((g) => {
                const isEditing = editingGroupId === g.id;
                const draft = editDraftByGroup[g.id] || { name: g.name, inviteUrl: g.invite_url || "" };
                
                return (
                  <div
                    key={g.id}
                    className={`border rounded-lg px-3 py-2 transition-colors ${
                      isEditing ? "border-[#FFC857]/40 bg-white/5" : "border-white/5"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        {isEditing ? (
                          <input
                            value={draft.name}
                            onChange={(e) =>
                              setEditDraftByGroup((prev) => ({
                                ...prev,
                                [g.id]: { ...draft, name: e.target.value },
                              }))
                            }
                            placeholder="Group name"
                            className="w-full rounded-lg border border-white/20 bg-transparent px-3 py-1.5 text-sm text-white font-semibold placeholder:text-white/30"
                          />
                        ) : (
                          <p className="text-white text-sm font-semibold">{g.name}</p>
                        )}
                        <p className="text-white/50 text-xs mt-0.5">
                          {g.member_count} / {g.max_members} members
                          {g.invite_url && <span className="text-[#1CE7D0] ml-2">✓ Link set</span>}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            if (isEditing) {
                              setEditingGroupId(null);
                            } else {
                              setEditDraftByGroup((prev) => ({
                                ...prev,
                                [g.id]: { name: g.name, inviteUrl: g.invite_url || "" },
                              }));
                              setEditingGroupId(g.id);
                            }
                          }}
                          className={`p-1.5 rounded-lg text-xs font-semibold border ${
                            isEditing
                              ? "border-red-400/40 text-red-400 hover:bg-red-500/10"
                              : "border-white/10 text-white/70 hover:text-white"
                          }`}
                          title={isEditing ? "Cancel" : "Edit"}
                        >
                          {isEditing ? "✕" : <PencilIcon className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => setSelectedGroupId(g.id)}
                          className={`px-2 py-1 rounded-lg text-xs font-semibold border ${
                            selectedGroupId === g.id
                              ? "border-[#FFC857]/60 text-[#FFC857]"
                              : "border-white/10 text-white/70 hover:text-white"
                          }`}
                        >
                          View
                        </button>
                      </div>
                    </div>
                    
                    {isEditing && (
                      <div className="mt-3 space-y-2">
                        <input
                          value={draft.inviteUrl}
                          onChange={(e) =>
                            setEditDraftByGroup((prev) => ({
                              ...prev,
                              [g.id]: { ...draft, inviteUrl: e.target.value },
                            }))
                          }
                          placeholder="https://chat.whatsapp.com/..."
                          className="w-full rounded-lg border border-white/10 bg-transparent px-3 py-1.5 text-xs text-white placeholder:text-white/30"
                        />
                        <button
                          onClick={() =>
                            updateGroupMutation.mutate({
                              groupId: g.id,
                              name: draft.name,
                              inviteUrl: draft.inviteUrl,
                            })
                          }
                          disabled={updateGroupMutation.isPending}
                          className="w-full px-3 py-2 rounded-lg bg-[#FFC857] text-[#0D1B2A] text-xs font-bold uppercase disabled:opacity-50"
                        >
                          {updateGroupMutation.isPending ? "Saving…" : "Save Changes"}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
              {groupsQuery.isError && (
                <p className="text-red-300 text-sm">
                  Failed to load groups. {(groupsQuery.error as Error | null)?.message ?? "Please refresh."}
                </p>
              )}
              {groupsQuery.isLoading && <p className="text-white/50 text-sm">Loading groups…</p>}
            </div>
          </div>

          <div className="bg-[#0D1B2A] border border-white/5 rounded-xl p-5">
            <h3 className="text-white text-lg font-semibold">Who posts today</h3>
            <p className="text-white/50 text-sm mb-3">Daily rotation of 25 members per group.</p>
            {!selectedGroupId && <p className="text-white/50 text-sm">Select a group to view today&apos;s roster.</p>}
            {scheduleQuery.isError && <p className="text-red-300 text-sm">Failed to load schedule.</p>}
            {selectedGroupId && scheduleQuery.isLoading && (
              <p className="text-white/50 text-sm">Loading schedule…</p>
            )}
            {selectedGroupId && !scheduleQuery.isLoading && currentSchedule.length === 0 && (
              <p className="text-white/50 text-sm">No members yet in this group.</p>
            )}
            {currentSchedule.length > 0 && (
              <div className="space-y-2 max-h-[220px] overflow-auto pr-1">
                {currentSchedule.map((m) => (
                  <div
                    key={`${m.position}-${m.phone}`}
                    className="flex items-center justify-between border border-white/5 rounded-lg px-3 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full bg-white/5 text-white/70 flex items-center justify-center text-xs font-semibold">
                        #{m.position}
                      </span>
                      <div>
                        <p className="text-white text-sm font-semibold">{m.name}</p>
                        <p className="text-white/50 text-xs">{m.phone}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, Icon, accent }: { label: string; value: string | number; Icon: any; accent: string }) {
  return (
    <div className="bg-[#0D1B2A] border border-white/5 rounded-xl p-4 flex items-center gap-3">
      <div className="w-10 h-10 rounded-full" style={{ backgroundColor: `${accent}1a` }}>
        <Icon className="w-10 h-10 p-2" style={{ color: accent }} />
      </div>
      <div>
        <p className="text-white/60 text-sm">{label}</p>
        <p className="text-white text-xl font-bold">{value}</p>
      </div>
    </div>
  );
}
