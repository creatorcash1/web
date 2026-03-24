"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { ArrowLeftOnRectangleIcon } from "@heroicons/react/24/outline";

interface Props {
  children: ReactNode;
}

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/courses", label: "Courses" },
  { href: "/pdfs", label: "PDFs" },
  { href: "/mentorship/mentorship-2hr", label: "Mentorship" },
];

export default function UserAppShell({ children }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    if (isLoggingOut) return;
    try {
      setIsLoggingOut(true);
      await fetch("/api/auth/signout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-[#E5E5E5]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-4">
          <Link href="/dashboard" className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FFC857] to-[#F59E0B] flex items-center justify-center text-[#0D1B2A] font-black text-sm">
              CC
            </div>
            <div>
              <p className="text-[#0D1B2A] text-sm font-black leading-none">CreatorCashCow</p>
              <p className="text-[#0D1B2A]/50 text-[10px]">Student App</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1 ml-4">
            {navItems.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                    active
                      ? "bg-[#0D1B2A] text-white"
                      : "text-[#0D1B2A]/60 hover:text-[#0D1B2A] hover:bg-[#0D1B2A]/5"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="ml-auto inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-[#0D1B2A]/15 text-[#0D1B2A]/70 text-xs font-semibold hover:bg-[#0D1B2A]/5 transition-colors disabled:opacity-60"
          >
            <ArrowLeftOnRectangleIcon className="w-4 h-4" />
            {isLoggingOut ? "Logging out..." : "Log Out"}
          </button>
        </div>
      </header>

      <div className="px-4 sm:px-6 lg:px-8 py-8">{children}</div>
    </div>
  );
}
