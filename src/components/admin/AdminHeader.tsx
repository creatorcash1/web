"use client";
// ─── Admin Header ───────────────────────────────────────────────────────────
// Top bar with mobile hamburger, search, and admin profile avatar.
// ─────────────────────────────────────────────────────────────────────────────

import { Bars3Icon, MagnifyingGlassIcon, BellIcon } from "@heroicons/react/24/outline";
import { useAdminStore } from "@/stores/adminStore";

export default function AdminHeader() {
  const toggleSidebar = useAdminStore((s) => s.toggleSidebar);
  const searchQuery = useAdminStore((s) => s.searchQuery);
  const setSearchQuery = useAdminStore((s) => s.setSearchQuery);

  return (
    <header className="sticky top-0 z-30 bg-[#0a1524]/80 backdrop-blur-xl border-b border-white/5 px-4 sm:px-6 py-3">
      <div className="flex items-center gap-4">
        {/* Mobile hamburger */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden text-white/60 hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-colors"
        >
          <Bars3Icon className="w-6 h-6" />
        </button>

        {/* Search */}
        <div className="flex-1 max-w-md relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            placeholder="Search users, courses, orders…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#FFC857]/40 focus:ring-1 focus:ring-[#FFC857]/20 transition-all"
          />
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3 ml-auto">
          {/* Notifications */}
          <button className="relative text-white/50 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors">
            <BellIcon className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FFC857]" />
          </button>

          {/* Admin avatar */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-linear-to-br from-[#FFC857] to-[#1CE7D0] flex items-center justify-center text-[#0D1B2A] text-xs font-bold">
              CC
            </div>
            <span className="hidden sm:block text-sm text-white/70 font-medium">CC Mendel</span>
          </div>
        </div>
      </div>
    </header>
  );
}
