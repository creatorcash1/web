// ─── Dashboard Page ──────────────────────────────────────────────────────────
// Protected route: /dashboard
// Left sidebar (desktop) + mobile drawer + main content area.
// Uses React Query for server state and Zustand for active section.
// ─────────────────────────────────────────────────────────────────────────────
"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
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

export default function DashboardPage() {
  // ── Real Auth guard ────────────────────────────────────────────────────────
  const [user, setUser] = useState<any>(null);
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
          <h1 className="font-[family-name:var(--font-montserrat)] font-extrabold text-2xl text-[#0D1B2A] mb-3">
            Please Log In
          </h1>
          <p className="text-gray-500 text-sm mb-6">You need to be logged in to access your dashboard.</p>
          <a
            href="/login"
            className="inline-flex items-center justify-center bg-[#FFC857] text-[#0D1B2A] text-sm
                       font-bold uppercase tracking-wider rounded-full px-6 py-3
                       hover:bg-[#f5b732] transition-all"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  // ── Data fetching via React Query ──────────────────
  const { data, status } = useQuery({
    queryKey: ["dashboard-data", user.id],
    queryFn: () => fetchDashboardData(user.id),
    enabled: !!user?.id,
  });

  // ── AI Brain data for this user ────────────────────
  const { data: aiData } = useQuery({
    queryKey: ["ai-brain-user", user.id],
    queryFn: () => fetchAIBrainForUser(user.id),
    staleTime: 5 * 60 * 1000,
    enabled: !!user?.id,
  });

  const aiMessages = aiData?.content.messages ?? [];

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
    overview:   "My Creator Dashboard",
    courses:    "My Courses",
    live:       "Live Sessions",
    pdfs:       "My PDFs",
    mentorship: "Mentorship",
    payments:   "Payments",
    settings:   "Settings",
  };

  return (
    <div className="flex min-h-screen bg-[#F7F8FA]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* ── Top bar ─────────────────────────────────── */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-[#E5E5E5] px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          {/* Mobile hamburger */}
          <button
            className="lg:hidden text-[#0D1B2A] p-2 -ml-2 rounded-lg hover:bg-[#E5E5E5]/60 transition"
            onClick={toggleSidebar}
            aria-label="Open menu"
          >
            <Bars3Icon className="w-5 h-5" />
          </button>

          <h1 className="font-[family-name:var(--font-montserrat)] font-extrabold text-lg text-[#0D1B2A] tracking-tight">
            {titles[activeSection] ?? "Dashboard"}
          </h1>

          {/* Right side — notification bell + avatar */}
          <div className="ml-auto flex items-center gap-3">
            <button
              onClick={toggleNotificationPanel}
              className="relative p-2 rounded-lg text-[#0D1B2A]/60 hover:bg-[#E5E5E5]/60 transition"
              aria-label="AI Notifications"
            >
              <BellIcon className="w-5 h-5" />
              {aiMessages.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FFC857]" />
              )}
            </button>
            <img
              src={d.user.avatar_url}
              alt={d.user.full_name}
              className="w-9 h-9 rounded-full border-2 border-[#FFC857] object-cover"
            />
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
