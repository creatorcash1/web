// ─── Footer ───────────────────────────────────────────────────────────────────
// Deep Navy background, white text, teal social icon hover, copyright.
// ─────────────────────────────────────────────────────────────────────────────
"use client";

const footerLinks = [
  { label: "Home",       href: "/" },
  { label: "Courses",    href: "/courses" },
  { label: "Mentorship", href: "/mentorship/mentorship-2hr" },
  { label: "Dashboard",  href: "/dashboard" },
  { label: "Contact",    href: "/contact" },
];

// Simple social icon SVGs (inline, no external font)
function IconTikTok() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.83a8.17 8.17 0 0 0 4.79 1.54V6.93a4.85 4.85 0 0 1-1.02-.24z" />
    </svg>
  );
}

function IconInstagram() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconYouTube() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
      <path d="M23 7s-.3-2-1.2-2.8c-1.1-1.2-2.4-1.2-3-1.3C16.4 2.8 12 2.8 12 2.8s-4.4 0-6.8.2c-.6.1-1.9.1-3 1.3C1.3 5 1 7 1 7S.7 9.2.7 11.5v2.1c0 2.3.3 4.5.3 4.5s.3 2 1.2 2.8c1.1 1.2 2.6 1.1 3.3 1.2C7.3 22.2 12 22.2 12 22.2s4.4 0 6.8-.2c.6-.1 1.9-.1 3-1.3.9-.8 1.2-2.8 1.2-2.8s.3-2.2.3-4.5v-2.1C23.3 9.2 23 7 23 7zm-13.4 8V9l7.9 3-7.9 3z" />
    </svg>
  );
}

function IconTwitterX() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const socials = [
  { label: "TikTok",    href: "https://tiktok.com/@creatorcashcow",    Icon: IconTikTok },
  { label: "Instagram", href: "https://instagram.com/creatorcashcow",  Icon: IconInstagram },
  { label: "YouTube",   href: "https://youtube.com/@creatorcashcow",   Icon: IconYouTube },
  { label: "X/Twitter", href: "https://x.com/creatorcashcow",          Icon: IconTwitterX },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#0D1B2A] text-white" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* ── Brand column ─────────────────────────── */}
          <div className="flex flex-col gap-4">
            <a href="/" aria-label="CreatorCashCow home" className="flex items-center gap-2 w-fit">
              <span className="w-9 h-9 rounded-full bg-[#FFC857] flex items-center justify-center">
                <span className="text-[#0D1B2A] font-black text-sm">CC</span>
              </span>
              <span className="font-headline text-xl">
                Creator<span className="text-[#FFC857]">Cash</span>Cow
              </span>
            </a>
            <p className="text-white/60 text-sm leading-relaxed max-w-xs">
              Empowering creators to build digital assets, monetize social media,
              and achieve financial freedom — guided by CC Mendel.
            </p>
          </div>

          {/* ── Quick links ──────────────────────────── */}
          <nav aria-label="Footer navigation" className="flex flex-col gap-3">
            <h4 className="text-[#FFC857] text-sm font-bold uppercase tracking-widest mb-1">
              Quick Links
            </h4>
            {footerLinks.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="text-white/70 hover:text-[#1CE7D0] text-sm transition-colors duration-150"
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* ── Social / CTA ─────────────────────────── */}
          <div className="flex flex-col gap-4">
            <h4 className="text-[#FFC857] text-sm font-bold uppercase tracking-widest mb-1">
              Follow the Journey
            </h4>
            <div className="flex gap-4">
              {socials.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center
                             text-white/70 hover:text-[#1CE7D0] hover:border-[#1CE7D0] transition-all duration-200"
                >
                  <Icon />
                </a>
              ))}
            </div>
            {/* Newsletter placeholder */}
            <div className="mt-2">
              <p className="text-white/60 text-xs mb-2">Get free creator tips:</p>
              <form
                onSubmit={(e) => e.preventDefault()}
                className="flex gap-2"
                aria-label="Newsletter sign-up"
              >
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#1CE7D0]"
                  aria-label="Email address"
                />
                <button
                  type="submit"
                  className="bg-[#FFC857] text-[#0D1B2A] font-bold rounded-full px-4 py-2 text-sm hover:bg-[#f5b732] transition-colors"
                >
                  Join
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ─────────────────────────────── */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-xs">
            © {year} CreatorCashCow.com · All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href="/privacy" className="text-white/40 hover:text-white/70 text-xs transition-colors">Privacy Policy</a>
            <a href="/terms" className="text-white/40 hover:text-white/70 text-xs transition-colors">Terms of Service</a>
            <a href="/contact" className="text-white/40 hover:text-white/70 text-xs transition-colors">Support</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
