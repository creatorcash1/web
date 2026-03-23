import type { TikTokGroup, TikTokRequest, TikTokRequestStatus, TikTokScheduleMember } from "@/types/tiktok";

export interface CompleteTikTokRequestResponse {
  success: boolean;
  groupId: string;
  position: number;
  groupName?: string;
  inviteUrl?: string | null;
  notified?: boolean;
}

export async function fetchTikTokRequests(status?: TikTokRequestStatus): Promise<TikTokRequest[]> {
  const search = status ? `?status=${status}` : "";
  const res = await fetch(`/api/tiktok/requests${search}`);
  if (!res.ok) {
    throw new Error("Failed to load TikTok requests");
  }
  const data = await res.json();
  return (data.requests || []) as TikTokRequest[];
}

export async function completeTikTokRequest(requestId: string) {
  const res = await fetch("/api/tiktok/requests/complete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ requestId }),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Failed to complete request");
  }
  return res.json() as Promise<CompleteTikTokRequestResponse>;
}

export async function fetchTikTokGroups(): Promise<TikTokGroup[]> {
  const res = await fetch("/api/tiktok/groups");
  if (!res.ok) {
    throw new Error("Failed to fetch groups");
  }
  const data = await res.json();
  return (data.groups || []) as TikTokGroup[];
}

export async function updateTikTokGroupInviteUrl(groupId: string, inviteUrl: string) {
  const res = await fetch("/api/tiktok/groups", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ groupId, inviteUrl }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Failed to update invite URL");
  }

  return res.json() as Promise<{ success: boolean; groupId: string; inviteUrl: string | null }>;
}

export async function fetchGroupSchedule(groupId: string): Promise<TikTokScheduleMember[]> {
  const res = await fetch("/api/tiktok/groups/schedule", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ groupId }),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Failed to load schedule");
  }
  const data = await res.json();
  return (data.members || []) as TikTokScheduleMember[];
}
