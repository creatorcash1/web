// ─── Authentication Utilities ────────────────────────────────────────────────
// Real authentication functions replacing mock auth
// ─────────────────────────────────────────────────────────────────────────────

import { createClient } from "@/lib/supabase/client";
import { createServerSupabaseClient } from "@/lib/supabase/server";

// ═══ Client-side Auth Functions ═══════════════════════════════════════════

/**
 * Sign up a new user
 */
export async function signUp(email: string, password: string, fullName: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) throw error;
  return data;
}

/**
 * Sign in existing user
 */
export async function signIn(email: string, password: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

/**
 * Sign out current user
 */
export async function signOut() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

/**
 * Get current user session (client-side)
 */
export async function getSession() {
  const supabase = createClient();
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw error;
  return session;
}

/**
 * Get current user (client-side)
 */
export async function getCurrentUser() {
  const supabase = createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
}

/**
 * Password reset request
 */
export async function resetPassword(email: string) {
  const supabase = createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
  });
  if (error) throw error;
}

/**
 * Update password
 */
export async function updatePassword(newPassword: string) {
  const supabase = createClient();
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });
  if (error) throw error;
}

// ═══ Server-side Auth Functions ════════════════════════════════════════════

/**
 * Get current user from server components
 */
export async function getServerUser() {
  const supabase = await createServerSupabaseClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) return null;
  return user;
}

/**
 * Get user profile with role from database
 */
export async function getUserProfile(userId: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();
  
  if (error) return null;
  return data;
}

/**
 * Check if user is admin
 */
export async function isAdmin(userId: string): Promise<boolean> {
  const profile = await getUserProfile(userId);
  return profile?.role === "admin";
}

/**
 * Check if user is suspended
 */
export async function isSuspended(userId: string): Promise<boolean> {
  const profile = await getUserProfile(userId);
  return profile?.is_suspended === true;
}

/**
 * Get full user context (for CTA system)
 */
export async function getUserContext(userId: string) {
  const supabase = await createServerSupabaseClient();
  
  // Get enrolled courses
  const { data: enrollments } = await supabase
    .from("user_enrollments")
    .select("course_id")
    .eq("user_id", userId);
  
  // Get purchased PDFs
  const { data: pdfPurchases } = await supabase
    .from("user_pdf_purchases")
    .select("pdf_id")
    .eq("user_id", userId);
  
  // Get mentorship bookings
  const { data: bookings } = await supabase
    .from("mentorship_bookings")
    .select("mentorship_product_id")
    .eq("user_id", userId);
  
  return {
    enrolledCourseIds: enrollments?.map((e) => e.course_id) ?? [],
    purchasedPdfIds: pdfPurchases?.map((p) => p.pdf_id) ?? [],
    mentorshipProductIds: bookings?.map((b) => b.mentorship_product_id) ?? [],
  };
}
