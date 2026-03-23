// ─── Dashboard Types ─────────────────────────────────────────────────────────
// Fully-typed interfaces matching the APIBACKEND.md schema.
// Used across the dashboard service layer, components, and pages.
// ─────────────────────────────────────────────────────────────────────────────

export type UserRole = "user" | "admin";
export type PaymentStatus = "pending" | "success" | "failed";
export type PaymentMethod = "stripe" | "paypal";
export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";

/** Authenticated user profile */
export interface User {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  avatar_url: string;
  created_at: string;
}

/** Course as enrolled by user */
export interface EnrolledCourse {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  progress: number; // 0-100
  enrolled_at: string;
  completed_at: string | null;
  access_source?: "purchase" | "promo" | "admin_grant";
}

/** Upcoming or past live session */
export interface LiveSession {
  id: string;
  title: string;
  description: string;
  scheduled_date: string; // ISO
  is_replay_available: boolean;
  replay_url: string | null;
}

/** Purchased PDF / digital product */
export interface OwnedPDF {
  id: string;
  title: string;
  description: string;
  cover_url: string;
  download_url: string;
  purchased_at: string;
}

/** Mentorship booking */
export interface MentorshipBooking {
  id: string;
  mentor_name: string;
  scheduled_date: string; // ISO
  duration_minutes: number;
  status: BookingStatus;
  payment_status: PaymentStatus;
  meeting_url: string | null;
}

/** Payment / transaction record */
export interface Payment {
  id: string;
  date: string;
  item: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method: PaymentMethod;
  invoice_url: string | null;
}

/** Aggregated stats for the overview cards */
export interface DashboardStats {
  enrolled_courses: number;
  avg_progress: number;
  active_bookings: number;
  digital_assets: number;
}

/** Complete dashboard API response */
export interface DashboardData {
  user: User;
  stats: DashboardStats;
  courses: EnrolledCourse[];
  live_sessions: LiveSession[];
  pdfs: OwnedPDF[];
  bookings: MentorshipBooking[];
  payments: Payment[];
}
