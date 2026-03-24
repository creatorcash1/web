// ─── Sidebar ─────────────────────────────────────────────────────────────────
// Premium Gen Z dashboard sidebar with gradient accents and smooth animations.
// ─────────────────────────────────────────────────────────────────────────────
"use client";

import Link from "next/link";
import {
  HomeIcon,
  AcademicCapIcon,
  VideoCameraIcon,
  DocumentTextIcon,
  UserGroupIcon,
  CreditCardIcon,
  Cog6ToothIcon,
  XMarkIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import {
  useDashboardStore,
  type DashboardSection,
} from "@/stores/dashboardStore";

interface NavItem {
  key: DashboardSection;
  label: string;
  href: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  emoji?: string;
}

const navItems: NavItem[] = [
  { key: "overview",    label: "Dashboard",     href: "/dashboard",             Icon: HomeIcon, emoji: "🏠" },
  { key: "courses",     label: "My Courses",    href: "/dashboard/courses",     Icon: AcademicCapIcon, emoji: "📚" },
  { key: "live",        label: "Live Sessions", href: "/dashboard/live",        Icon: VideoCameraIcon, emoji: "🎬" },
  { key: "pdfs",        label: "My PDFs",       href: "/dashboard/pdfs",        Icon: DocumentTextIcon, emoji: "📄" },
  { key: "mentorship",  label: "Mentorship",    href: "/dashboard/mentorship",  Icon: UserGroupIcon, emoji: "🧠" },
  { key: "payments",    label: "Payments",      href: "/dashboard/payments",    Icon: CreditCardIcon, emoji: "💳" },
  { key: "settings",    label: "Settings",      href: "/dashboard/settings",    Icon: Cog6ToothIcon, emoji: "⚙️" },
];

export default function Sidebar() {
  const activeSection   = useDashboardStore((s) => s.activeSection);
  const setActive       = useDashboardStore((s) => s.setActiveSection);
  const sidebarOpen     = useDashboardStore((s) => s.sidebarOpen);
  const setSidebarOpen  = useDashboardStore((s) => s.setSidebarOpen);

  return (
    <>
      {/* ── Mobile overlay ────────────────────────────── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar panel ─────────────────────────────── */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-72 flex flex-col
          bg-gradient-to-b from-[#0D1B2A] via-[#0D1B2A] to-[#0a1520]
          transition-transform duration-300 ease-out
          lg:translate-x-0 lg:static lg:z-auto
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        aria-label="Dashboard sidebar"
      >
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#1CE7D0]/10 to-transparent rounded-full blur-2xl" />
        <div className="absolute bottom-20 left-0 w-24 h-24 bg-gradient-to-tr from-[#FFC857]/10 to-transparent rounded-full blur-2xl" />

        {/* ── Header ──────────────────────────────────── */}
        <div className="relative flex items-center justify-between px-5 py-6 border-b border-white/5">
          <Link href="/" className="flex items-center gap-3 group">
            {/* Logo */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#FFC857] to-[#F59E0B] rounded-xl blur opacity-40 group-hover:opacity-70 transition-opacity duration-300" />
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFC857] to-[#F59E0B] flex items-center justify-center shadow-lg shadow-amber-500/20">
                <span className="text-[#0D1B2A] font-black text-sm">CC</span>
              </div>
            </div>
            <div>
              <span className="text-white font-bold text-base tracking-tight block">
                Creator<span className="text-[#FFC857]">Cash</span>
              </span>
              <span className="text-white/40 text-xs">Dashboard</span>
            </div>
          </Link>
          <button
            className="lg:hidden text-white/40 hover:text-white p-2 rounded-xl hover:bg-white/5 transition-all"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* ── Nav items ───────────────────────────────── */}
        <nav className="relative flex-1 overflow-y-auto py-6 px-3 flex flex-col gap-1 custom-scrollbar" aria-label="Dashboard navigation">
          <p className="px-4 mb-2 text-[10px] uppercase tracking-widest text-white/30 font-semibold">Menu</p>
          {navItems.map(({ key, label, href, Icon, emoji }) => {
            const active = activeSection === key;
            return (
              <Link
                key={key}
                href={href}
                onClick={() => setActive(key)}
                className={`
                  group relative flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-medium transition-all duration-300
                  ${
                    active
                      ? "text-[#0D1B2A]"
                      : "text-white/50 hover:text-white hover:bg-white/5"
                  }
                `}
                aria-current={active ? "page" : undefined}
              >
                {/* Active background */}
                {active && (
                  <div className="absolute inset-0 bg-gradient-to-r from-[#FFC857] to-[#F59E0B] rounded-2xl shadow-lg shadow-amber-500/30" />
                )}
                
                {/* Icon */}
                <span className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-xl transition-all duration-300 ${
                  active 
                    ? "bg-[#0D1B2A]/10" 
                    : "bg-white/5 group-hover:bg-white/10"
                }`}>
                  <Icon
                    className={`w-4 h-4 transition-colors duration-200 ${
                      active ? "text-[#0D1B2A]" : "text-white/60 group-hover:text-white"
                    }`}
                    aria-hidden="true"
                  />
                </span>
                
                {/* Label */}
                <span className="relative z-10 flex-1">{label}</span>
                
                {/* Emoji indicator for active */}
                {active && emoji && (
                  <span className="relative z-10 text-sm">{emoji}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* ── Pro badge / upsell ──────────────────────── */}
        <div className="relative px-4 pb-4">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1CE7D0]/10 to-[#FFC857]/10 border border-white/5 p-4">
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-[#1CE7D0]/20 to-transparent rounded-full blur-xl" />
            <div className="relative flex items-center gap-3 mb-3">
              <SparklesIcon className="w-5 h-5 text-[#FFC857]" />
              <span className="text-white text-sm font-bold">Level Up</span>
            </div>
            <p className="text-white/50 text-xs mb-3 leading-relaxed">
              Unlock premium courses and 1-on-1 mentorship sessions.
            </p>
            <Link
              href="/courses"
              className="block w-full text-center py-2.5 rounded-xl bg-white/10 text-white text-xs font-semibold hover:bg-white/15 transition-all duration-300"
            >
              Browse Courses →
            </Link>
          </div>
        </div>

        {/* ── Bottom user badge ───────────────────────── */}
        <div className="relative px-4 py-4 border-t border-white/5">
          <div className="flex items-center gap-3 p-2 rounded-2xl hover:bg-white/5 transition-all duration-300 cursor-pointer">
            {/* Avatar with gradient border */}
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#1CE7D0] to-[#FFC857] rounded-full opacity-70" />
              <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-[#1CE7D0] to-[#0D1B2A] flex items-center justify-center text-white text-sm font-bold">
                👤
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-semibold truncate">Your Profile</p>
              <p className="text-white/40 text-xs truncate">Creator Member</p>
            </div>
            <Cog6ToothIcon className="w-4 h-4 text-white/30" />
          </div>
        </div>
      </aside>
    </>
  );
}
