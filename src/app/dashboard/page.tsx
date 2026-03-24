// ─── Dashboard Page ──────────────────────────────────────────────────────────
// Protected route: /dashboard
// Left sidebar (desktop) + mobile drawer + main content area.
// Uses React Query for server state and Zustand for active section.
// ─────────────────────────────────────────────────────────────────────────────
"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Bars3Icon, BellIcon } from "@heroicons/react/24/outline";
import { useDashboardStore } from "@/stores/dashboardStore";
import { useAIBrainStore } from "@/stores/aiBrainStore";
import { fetchDashboardData } from "@/services/dashboard";
import { fetchAIBrainForUser } from "@/services/aiBrain";
import Sidebar from "@/components/dashboard/Sidebar";
import AINotificationPanel from "@/components/ai/AINotificationPanel";
import OverviewSection from "@/sections/dashboard/OverviewSection";
import CoursesSection from "@/sections/dashboard/CoursesSection";
import LiveSessionsSection from "@/sections/dashboard/LiveSessionsSection";
import PDFsSection from "@/sections/dashboard/PDFsSection";
import MentorshipSection from "@/sections/dashboard/MentorshipSection";
import PaymentsSection from "@/sections/dashboard/PaymentsSection";
import SettingsSection from "@/sections/dashboard/SettingsSection";
import type { User } from "@/types/dashboard";

export default function DashboardPage() {
  // ── Real Auth guard ────────────────────────────────────────────────────────
  const [user, setUser] = useState<User | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch("/api/auth/me");
        const data = await response.json();
        if (data.user) {
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

  const activeSection   = useDashboardStore((s) => s.activeSection);
  const setActiveSection = useDashboardStore((s) => s.setActiveSection);
  const toggleSidebar   = useDashboardStore((s) => s.toggleSidebar);
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/dashboard" || pathname === "/dashboard/") {
      setActiveSection("overview");
      return;
    }

    if (pathname.startsWith("/dashboard/courses")) setActiveSection("courses");
    else if (pathname.startsWith("/dashboard/live")) setActiveSection("live");
    else if (pathname.startsWith("/dashboard/pdfs")) setActiveSection("pdfs");
    else if (pathname.startsWith("/dashboard/mentorship")) setActiveSection("mentorship");
    else if (pathname.startsWith("/dashboard/payments")) setActiveSection("payments");
    else if (pathname.startsWith("/dashboard/settings")) setActiveSection("settings");
  }, [pathname, setActiveSection]);

  // AI Brain notification state
  const notificationPanelOpen = useAIBrainStore((s) => s.notificationPanelOpen);
  const toggleNotificationPanel = useAIBrainStore((s) => s.toggleNotificationPanel);
  const setNotificationPanelOpen = useAIBrainStore((s) => s.setNotificationPanelOpen);

  // ── Data fetching via React Query ──────────────────
  const { data, status } = useQuery({
    queryKey: ["dashboard-data", user?.id],
    queryFn: () => fetchDashboardData(),
    enabled: !!user?.id,
  });

  // ── AI Brain data for this user ────────────────────
  const { data: aiData } = useQuery({
    queryKey: ["ai-brain-user", user?.id],
    queryFn: () => fetchAIBrainForUser(user?.id ?? ""),
    staleTime: 5 * 60 * 1000,
    enabled: !!user?.id,
  });

  const aiMessages = aiData?.content.messages ?? [];

  // Redirect if not authenticated
  if (checkingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F7F8FA]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-[#FFC857] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400 font-medium">Checking authentication…</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <h1 className="font-(family-name:--font-montserrat) font-extrabold text-2xl text-[#0D1B2A] mb-3">
            Please Log In
          </h1>
          <p className="text-gray-500 text-sm mb-6">You need to be logged in to access your dashboard.</p>
          <Link
            href="/login"
            className="inline-flex items-center justify-center bg-[#FFC857] text-[#0D1B2A] text-sm
                       font-bold uppercase tracking-wider rounded-full px-6 py-3
                       hover:bg-[#f5b732] transition-all"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  // ── Loading state ──────────────────────────────────
  if (status === "pending") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F7F8FA]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-[#FFC857] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400 font-medium">Loading your dashboard…</p>
        </div>
      </div>
    );
  }

  // ── Error state ────────────────────────────────────
  if (status === "error" || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F7F8FA]">
        <div className="text-center">
          <h2 className="font-bold text-[#0D1B2A] text-xl mb-2">Oops — something went wrong</h2>
          <p className="text-gray-500 text-sm mb-4">We couldn&rsquo;t load your dashboard. Please try again.</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#FFC857] text-[#0D1B2A] text-sm font-bold uppercase tracking-wider rounded-full px-6 py-3
                       hover:bg-[#f5b732] transition-all"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // ── Section router ─────────────────────────────────
  // `data` is guaranteed non-null after the early-return guards above.
  const d = data!;

  function renderSection() {
    switch (activeSection) {
      case "overview":
        return <OverviewSection data={d} />;
      case "courses":
        return <CoursesSection courses={d.courses} />;
      case "live":
        return <LiveSessionsSection sessions={d.live_sessions} />;
      case "pdfs":
        return <PDFsSection pdfs={d.pdfs} />;
      case "mentorship":
        return <MentorshipSection bookings={d.bookings} />;
      case "payments":
        return <PaymentsSection payments={d.payments} />;
      case "settings":
        return <SettingsSection user={d.user} />;
      default:
        return <OverviewSection data={d} />;
    }
  }

  // ── Section title map ──────────────────────────────
  const titles: Record<string, string> = {
    overview:   "Hey there 👋",
    courses:    "Your Courses",
    live:       "Live Sessions",
    pdfs:       "Your PDFs",
    mentorship: "Mentorship",
    payments:   "Payments",
    settings:   "Settings",
  };

  const subtitles: Record<string, string> = {
    overview:   "Let's crush it today",
    courses:    "Keep learning, keep growing",
    live:       "Join live & level up",
    pdfs:       "Your digital vault",
    mentorship: "1-on-1 guidance",
    payments:   "Your transactions",
    settings:   "Customize your experience",
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#F8FAFC] via-[#F1F5F9] to-[#E2E8F0]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* ── Top bar ─────────────────────────────────── */}
        <header className="sticky top-0 z-30 bg-white/70 backdrop-blur-xl border-b border-[#0D1B2A]/5 px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            {/* Mobile hamburger */}
            <button
              className="lg:hidden text-[#0D1B2A] p-2.5 -ml-2 rounded-2xl hover:bg-[#0D1B2A]/5 transition-all duration-200"
              onClick={toggleSidebar}
              aria-label="Open menu"
            >
              <Bars3Icon className="w-5 h-5" />
            </button>

            {/* Title and subtitle */}
            <div className="flex-1">
              <h1 className="font-black text-xl text-[#0D1B2A] tracking-tight">
                {titles[activeSection] ?? "Dashboard"}
              </h1>
              <p className="text-[#0D1B2A]/50 text-sm hidden sm:block">
                {subtitles[activeSection] ?? "Your creator hub"}
              </p>
            </div>

            {/* Right side — notification bell + avatar */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleNotificationPanel}
                className="relative p-2.5 rounded-2xl text-[#0D1B2A]/60 hover:bg-[#0D1B2A]/5 transition-all duration-200"
                aria-label="AI Notifications"
              >
                <BellIcon className="w-5 h-5" />
                {aiMessages.length > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-gradient-to-r from-[#FFC857] to-[#F59E0B] shadow-lg shadow-amber-500/50" />
                )}
              </button>
              <div className="relative group cursor-pointer">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#1CE7D0] to-[#FFC857] rounded-full opacity-0 group-hover:opacity-70 transition-opacity duration-300 blur-sm" />
                <img
                  src={d.user.avatar_url}
                  alt={d.user.full_name}
                  className="relative w-10 h-10 rounded-full border-2 border-white object-cover shadow-lg"
                />
              </div>
            </div>
          </div>
        </header>

        {/* ── AI Notification Panel ───────────────────── */}
        <AINotificationPanel
          messages={aiMessages}
          isOpen={notificationPanelOpen}
          onClose={() => setNotificationPanelOpen(false)}
        />

        {/* ── Content area ────────────────────────────── */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {renderSection()}
        </main>
      </div>
    </div>
  );
}
