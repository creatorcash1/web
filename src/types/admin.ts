// ─── Admin Dashboard Types ───────────────────────────────────────────────────
// Fully-typed interfaces for the admin panel. Extends the core schema from
// APIBACKEND.md with admin-specific analytics, content management, and
// system configuration models.
// ─────────────────────────────────────────────────────────────────────────────

import type {
  UserRole,
  PaymentStatus,
  PaymentMethod,
  BookingStatus,
} from "./dashboard";

export type { UserRole, PaymentStatus, PaymentMethod, BookingStatus };

// ─── Admin User (extended) ───────────────────────────────────────────────────

export interface AdminUser {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  avatar_url: string;
  created_at: string;
  last_login: string | null;
  enrolled_courses: number;
  total_spent: number;
  status: "active" | "suspended" | "banned";
}

// ─── Courses & Modules ──────────────────────────────────────────────────────

export interface AdminModule {
  id: string;
  title: string;
  description: string;
  video_url: string;
  order: number;
}

export interface AdminCourse {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  thumbnail_url: string;
  modules: AdminModule[];
  enrollments: number;
  revenue: number;
  created_at: string;
  updated_at: string;
  status: "published" | "draft";
}

// ─── PDFs / Digital Products ────────────────────────────────────────────────

export interface AdminPDF {
  id: string;
  title: string;
  description: string;
  file_url: string;
  cover_url: string;
  price: number;
  currency: string;
  downloads: number;
  revenue: number;
  created_at: string;
  status: "published" | "draft";
}

// ─── Live Sessions ──────────────────────────────────────────────────────────

export interface AdminLiveSession {
  id: string;
  title: string;
  description: string;
  scheduled_date: string;
  duration_minutes: number;
  attendees: number;
  max_capacity: number;
  is_replay_available: boolean;
  replay_url: string | null;
  status: "upcoming" | "live" | "completed" | "cancelled";
}

// ─── Mentorship Bookings ────────────────────────────────────────────────────

export interface AdminBooking {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  scheduled_date: string;
  duration_minutes: number;
  status: BookingStatus;
  payment_status: PaymentStatus;
  amount: number;
  meeting_url: string | null;
  created_at: string;
}

// ─── Payments ───────────────────────────────────────────────────────────────

export interface AdminPayment {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  date: string;
  item: string;
  item_type: "course" | "pdf" | "mentorship" | "bundle";
  amount: number;
  currency: string;
  status: PaymentStatus;
  method: PaymentMethod;
  transaction_id: string;
  invoice_url: string | null;
}

// ─── KPI & Analytics ────────────────────────────────────────────────────────

export interface KpiCard {
  label: string;
  value: string;
  change: number; // percentage change from last period
  trend: "up" | "down" | "flat";
  icon: string; // heroicon name identifier
}

export interface RevenueDataPoint {
  month: string;
  courses: number;
  pdfs: number;
  mentorship: number;
  total: number;
}

export interface UserGrowthDataPoint {
  month: string;
  new_users: number;
  total_users: number;
}

export interface ConversionFunnelStep {
  stage: string;
  count: number;
  rate: number; // percentage
}

export interface TopProduct {
  id: string;
  title: string;
  type: "course" | "pdf" | "mentorship";
  revenue: number;
  units_sold: number;
}

export interface AnalyticsData {
  revenue_over_time: RevenueDataPoint[];
  user_growth: UserGrowthDataPoint[];
  conversion_funnel: ConversionFunnelStep[];
  top_products: TopProduct[];
  mrr: number;
  arr: number;
  churn_rate: number;
  avg_order_value: number;
}

// ─── Content Manager ────────────────────────────────────────────────────────

export interface ContentBlock {
  id: string;
  page: "landing" | "course" | "mentorship" | "link-in-bio";
  section: string;
  title: string;
  body: string;
  updated_at: string;
  published: boolean;
}

// ─── System Settings ────────────────────────────────────────────────────────

export interface SystemSettings {
  site_name: string;
  tagline: string;
  support_email: string;
  stripe_mode: "test" | "live";
  maintenance_mode: boolean;
  signup_enabled: boolean;
  mentorship_enabled: boolean;
  mentorship_price: number;
  default_currency: string;
}

// ─── Complete Admin Dashboard Response ──────────────────────────────────────

export interface AdminDashboardData {
  kpis: KpiCard[];
  users: AdminUser[];
  courses: AdminCourse[];
  pdfs: AdminPDF[];
  live_sessions: AdminLiveSession[];
  bookings: AdminBooking[];
  payments: AdminPayment[];
  analytics: AnalyticsData;
  content_blocks: ContentBlock[];
  settings: SystemSettings;
}
