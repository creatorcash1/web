// ─── HeroSection ─────────────────────────────────────────────────────────────
// Deep Navy → Teal gradient background, headline, subtitle, dual CTA buttons,
// and animated floating gold spark accents for visual energy.
// ─────────────────────────────────────────────────────────────────────────────
import Button from "@/components/Button";
import FreeOfferCountdown from "@/components/FreeOfferCountdown";
import {
  SparklesIcon,
  PlayCircleIcon,
} from "@heroicons/react/24/solid";
import { FREE_COURSE_OFFER_END_AT, isFreeCourseOfferActive } from "@/lib/freeOffer";

// Floating spark shapes around the hero background
const sparks = [
  { size: 18, top: "12%",  left: "8%",  duration: "5s",  delay: "0s"   },
  { size: 10, top: "20%",  left: "88%", duration: "4s",  delay: "1s"   },
  { size: 14, top: "72%",  left: "5%",  duration: "6s",  delay: "0.5s" },
  { size: 8,  top: "80%",  left: "90%", duration: "4.5s",delay: "1.5s" },
  { size: 20, top: "45%",  left: "92%", duration: "5.5s",delay: "0.8s" },
  { size: 12, top: "58%",  left: "3%",  duration: "4.2s",delay: "2s"   },
];

export default function HeroSection() {
  const isFree = isFreeCourseOfferActive();

  return (
    <section
      id="hero"
      className="hero-gradient relative min-h-screen flex items-center overflow-hidden pt-16"
      aria-label="Hero – Build Your Creator Empire"
    >
      {/* ── Decorative blurs ────────────────────────── */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#1CE7D0]/10 blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-0 right-0 w-150 h-100 rounded-full bg-[#FFC857]/5 blur-3xl pointer-events-none" aria-hidden="true" />

      {/* ── Floating sparks ─────────────────────────── */}
      {sparks.map((s, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="spark absolute pointer-events-none select-none text-[#FFC857]"
          style={{
            width:  s.size,
            height: s.size,
            top:    s.top,
            left:   s.left,
            "--duration": s.duration,
            "--delay":    s.delay,
          } as React.CSSProperties}
        >
          {/* Alternating shapes */}
          {i % 2 === 0 ? (
            <SparklesIcon style={{ width: s.size, height: s.size }} />
          ) : (
            <span
              style={{ width: s.size, height: s.size, display: "block" }}
              className="rounded-full bg-[#1CE7D0]/50"
            />
          )}
        </span>
      ))}

      {/* ── Main content ────────────────────────────── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left — copy */}
          <div>
            {/* Live badge */}
            <div className="inline-flex items-center gap-2 bg-[#FFC857]/10 border border-[#FFC857]/30 rounded-full px-4 py-1.5 mb-6">
              <span className="relative flex h-2.5 w-2.5">
                <span className="pulse-ring absolute inline-flex h-full w-full rounded-full bg-[#FFC857]" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#FFC857]" />
              </span>
              <span className="text-xs font-bold text-[#FFC857] uppercase tracking-wider">
                Limited Time Launch Offer
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-headline text-4xl sm:text-5xl lg:text-6xl text-white leading-tight mb-6">
              Turn What You Know Into{" "}
              <span className="gold-shimmer">$10k Monthly</span>
              <br className="hidden sm:block" />
              Starting{" "}
              <span className="text-[#1CE7D0]">Today</span>
            </h1>

            {/* Subtitle */}
            <p className="text-white/75 text-lg md:text-xl leading-relaxed mb-8 max-w-xl">
              The complete system to transform your knowledge and skills into consistent $10,000+ monthly income. 2 video trainings + 1 implementation ebook.
            </p>

            {/* CTA row */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="primary" size="lg" href="/register?redirect=checkout">
                {isFree ? "Get Started — FREE" : "Get Started — $57.99"}
              </Button>
              <Button variant="secondary" size="lg" href="#what-you-get">
                <PlayCircleIcon className="w-5 h-5 mr-2" aria-hidden="true" />
                See What&apos;s Inside
              </Button>
            </div>

            {/* Social proof strip */}
            <div className="flex items-center gap-4 mt-8">
              {/* Placeholder avatar stack */}
              <div className="flex -space-x-2">
                {[47, 12, 32, 68].map((n) => (
                  <img
                    key={n}
                    src={`https://i.pravatar.cc/40?img=${n}`}
                    alt="Student success story"
                    width={36}
                    height={36}
                    className="w-9 h-9 rounded-full border-2 border-[#0D1B2A] object-cover"
                  />
                ))}
              </div>
              <p className="text-white/60 text-sm">
                <span className="text-[#FFC857] font-bold">Join hundreds</span> building their income
              </p>
            </div>
          </div>

          {/* Right — hero visual placeholder */}
          <div className="relative flex items-center justify-center">
            {/* Glow ring */}
            <div className="absolute w-80 h-80 rounded-full bg-[#1CE7D0]/10 blur-2xl" aria-hidden="true" />

            {/* Hero image placeholder */}
            <div
              className="relative w-full max-w-md aspect-4/5 rounded-3xl overflow-hidden
                         border border-white/10 shadow-2xl shadow-black/50"
              aria-label="Hero illustration placeholder — creator working on laptop"
            >
              <img
                src="https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&auto=format&fit=crop&q=80"
                alt="Creator working on laptop, building their digital empire"
                className="w-full h-full object-cover"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-linear-to-t from-[#0D1B2A]/60 to-transparent" aria-hidden="true" />

              {/* Floating stats card */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-4">
                <p className="text-xs text-white/60 uppercase tracking-wider mb-1">Complete Course</p>
                <div className="flex items-end gap-2">
                  {isFree ? (
                    <>
                      <span className="text-lg font-bold text-white/50 line-through">$57.99</span>
                      <span className="text-2xl font-black text-[#FFC857]">$0</span>
                    </>
                  ) : (
                    <span className="text-2xl font-black text-[#FFC857]">$57.99</span>
                  )}
                  <span className="ml-auto text-xs bg-[#1CE7D0]/20 text-[#1CE7D0] border border-[#1CE7D0]/30 rounded-full px-2 py-0.5 font-semibold">
                    2 Videos + Ebook
                  </span>
                </div>
                {isFree && (
                  <div className="mt-2">
                    <p className="text-[10px] text-white/60 uppercase tracking-wider mb-1">Free offer ends in</p>
                    <FreeOfferCountdown targetDate={FREE_COURSE_OFFER_END_AT} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave divider */}
      <div className="absolute bottom-0 inset-x-0 pointer-events-none" aria-hidden="true">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0 60L1440 60L1440 20C1200 55 720 0 0 40V60Z" fill="#ffffff" />
        </svg>
      </div>
    </section>
  );
}
