// ─── TikTok Ops Types ─────────────────────────────────────────────────────-
// Used by the admin TikTok operations dashboard for handling requests,
// groups, and daily posting schedules.
// ─────────────────────────────────────────────────────────────────────────────

export type TikTokRequestStatus = "pending" | "completed";

export interface TikTokRequest {
  id: string;
  user_id: string;
  course_id: string;
  full_name: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  email: string;
  phone: string;
  desired_password: string;
  status: TikTokRequestStatus;
  group_id: string | null;
  created_at: string;
  completed_at?: string | null;
  users?: {
    full_name: string;
    email: string;
  };
}

export interface TikTokGroup {
  id: string;
  name: string;
  order_index: number;
  max_members: number;
  invite_url: string | null;
  member_count: number;
}

export interface TikTokScheduleMember {
  position: number;
  name: string;
  phone: string;
}
