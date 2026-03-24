// ─── Navbar ────────────────────────────────────────────────────────────────
// Responsive navigation bar: Deep Navy bg, gold CTA, hamburger menu on mobile,
// smooth scroll links, and active section highlight.
// ───────────────────────────────────────────────────────────────────────────
"use client";

import { useState, useEffect } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import Button from "./Button";
import { isFreeCourseOfferActive } from "@/lib/freeOffer";

const navLinks = [
  { label: "Home",       href: "/" },
  { label: "Dashboard",  href: "/dashboard" },
  { label: "FAQ",        href: "/#faq" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isFree = isFreeCourseOfferActive();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-[#0D1B2A]/95 backdrop-blur shadow-lg" : "bg-[#0D1B2A]"
      }`}
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* ── Logo ──────────────────────────────────── */}
          <Link
            href="/"
            aria-label="CreatorCashCow home"
            className="flex items-center gap-2"
          >
            {/* Placeholder logo mark */}
            <span className="w-8 h-8 rounded-full bg-[#FFC857] flex items-center justify-center">
              <span className="text-[#0D1B2A] font-black text-sm">CC</span>
            </span>
            <span className="text-white font-headline text-lg leading-tight">
              Creator<span className="text-[#FFC857]">Cash</span>Cow
            </span>
          </Link>

          {/* ── Desktop nav links ─────────────────────── */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
            {navLinks.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="text-sm text-white/80 hover:text-[#1CE7D0] transition-colors duration-150 font-medium"
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* ── CTA (desktop) ─────────────────────────── */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm text-white/70 hover:text-white transition-colors"
            >
              Log In
            </Link>
            <Button variant="primary" size="sm" href="/register?redirect=checkout">
              {isFree ? "Start Now — FREE" : "Start Now — $57.99"}
            </Button>
          </div>

          {/* ── hamburger (mobile) ────────────────────── */}
          <button
            className="md:hidden text-white p-2 rounded-md hover:bg-white/10 transition"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <XMarkIcon className="w-6 h-6" />
            ) : (
              <Bars3Icon className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* ── Mobile drawer ─────────────────────────────── */}
      {menuOpen && (
        <nav
          className="md:hidden bg-[#0D1B2A] border-t border-white/10 px-4 py-4 flex flex-col gap-4"
          aria-label="Mobile navigation"
        >
          {navLinks.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="text-white/80 hover:text-[#1CE7D0] font-medium transition-colors py-1"
            >
              {l.label}
            </a>
          ))}
          <Button variant="primary" size="md" href="#offer" fullWidth>
            Get Full Access
          </Button>
        </nav>
      )}
    </header>
  );
}
