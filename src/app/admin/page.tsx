"use client";
// ─── Admin Dashboard Page ───────────────────────────────────────────────────
// Protected admin route. Fetches all admin data via React Query, renders
// sidebar + header + section-routed main content.
// ─────────────────────────────────────────────────────────────────────────────

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAdminStore } from "@/stores/adminStore";
import { fetchAdminDashboard } from "@/services/admin";

import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

import AdminOverviewSection from "@/sections/admin/OverviewSection";
import AdminUsersSection from "@/sections/admin/UsersSection";
import AdminProductsSection from "@/sections/admin/ProductsSection";
import AdminLiveSessionsSection from "@/sections/admin/LiveSessionsSection";
import AdminMentorshipSection from "@/sections/admin/MentorshipSection";
import AdminPaymentsSection from "@/sections/admin/PaymentsSection";
import AdminAnalyticsSection from "@/sections/admin/AnalyticsSection";
import AdminContentSection from "@/sections/admin/ContentSection";
import AdminSettingsSection from "@/sections/admin/SettingsSection";
import AIBrainSection from "@/sections/admin/AIBrainSection";
import TikTokOpsSection from "@/sections/admin/TikTokOpsSection";
import type { User } from "@/types/dashboard";

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const activeSection = useAdminStore((s) => s.activeSection);

  // Check real authentication
  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch("/api/auth/me");
        const data = await response.json();
        if (data.user && data.user.role === "admin") {
          setUser(data.user);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setCheckingAuth(false);
      }
    }
    checkAuth();
  }, []);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: fetchAdminDashboard,
    staleTime: 5 * 60 * 1000,
    enabled: !!user && user.role === "admin",
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  // ─── Auth guard ────────────────────────────────────────────────────────────
  if (checkingAuth || isLoading) {
    return (
      <div className="min-h-screen bg-[#0a1524] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-[#FFC857] border-t-transparent rounded-full animate-spin" />
          <p className="text-white/50 text-sm">Loading admin panel…</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-[#0a1524] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-red-500/10 flex items-center justify-center">
            <span className="text-2xl">🔒</span>
          </div>
          <h1 className="text-xl font-bold text-white font-(family-name:--font-montserrat)">
            Access Denied
          </h1>
          <p className="text-white/40 text-sm max-w-sm">
            You don&apos;t have admin privileges. Contact CC Mendel to request access.
          </p>
          <Link
            href="/"
            className="inline-block mt-4 px-6 py-2.5 bg-[#FFC857] text-[#0D1B2A] font-semibold text-sm rounded-lg hover:bg-[#FFC857]/90 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // ─── Error ─────────────────────────────────────────────────────────────────
  if (isError || !data) {
    return (
      <div className="min-h-screen bg-[#0a1524] flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-red-400 text-sm">Failed to load admin data.</p>
          <button
            onClick={() => refetch()}
            className="px-5 py-2 bg-[#FFC857] text-[#0D1B2A] text-sm font-semibold rounded-lg hover:bg-[#FFC857]/90 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // ─── Section router ────────────────────────────────────────────────────────
  const d = data;

  const renderSection = () => {
    switch (activeSection) {
      case "overview":
        return <AdminOverviewSection data={d} />;
      case "users":
        return <AdminUsersSection users={d.users} />;
      case "products":
        return <AdminProductsSection courses={d.courses} pdfs={d.pdfs} />;
      case "live-sessions":
        return <AdminLiveSessionsSection sessions={d.live_sessions} />;
      case "mentorship":
        return <AdminMentorshipSection bookings={d.bookings} />;
      case "payments":
        return <AdminPaymentsSection payments={d.payments} />;
      case "analytics":
        return <AdminAnalyticsSection analytics={d.analytics} />;
      case "content":
        return <AdminContentSection contentBlocks={d.content_blocks} />;
      case "tiktok-ops":
        return <TikTokOpsSection />;
      case "ai-brain":
        return <AIBrainSection />;
      case "settings":
        return <AdminSettingsSection settings={d.settings} />;
      default:
        return <AdminOverviewSection data={d} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a1524] flex">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {renderSection()}
        </main>
      </div>
    </div>
  );
}
