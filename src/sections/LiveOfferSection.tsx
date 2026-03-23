// ─── LiveOfferSection ────────────────────────────────────────────────────────
// Scarcity section: first-5-buyers price, countdown timer, free mentorship
// badge, and gold CTA button.
// ─────────────────────────────────────────────────────────────────────────────
import Button from "@/components/Button";
import {
  CheckBadgeIcon,
  UserGroupIcon,
  GiftIcon,
} from "@heroicons/react/24/solid";

const perks = [
  { Icon: CheckBadgeIcon, text: "2 complete video trainings (97 minutes total)" },
  { Icon: CheckBadgeIcon, text: "Complete implementation ebook with templates" },
  { Icon: CheckBadgeIcon, text: "Lifetime access to all course materials" },
  { Icon: CheckBadgeIcon, text: "Action checklist and worksheets" },
  { Icon: GiftIcon,       text: "30-day money-back guarantee" },
];

export default function LiveOfferSection() {
  return (
    <section
      id="offer"
      className="bg-[#E5E5E5] py-20 lg:py-28 relative overflow-hidden"
      aria-labelledby="offer-heading"
    >
      {/* Decorative blobs */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#1CE7D0]/10 blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-[#FFC857]/10 blur-3xl pointer-events-none" aria-hidden="true" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* ── Left: Offer details ─────────────────── */}
          <div>
            {/* Live badge */}
            <div className="inline-flex items-center gap-2 bg-[#0D1B2A] rounded-full px-4 py-1.5 mb-6">
              <span className="relative flex h-2.5 w-2.5">
                <span className="pulse-ring absolute inline-flex h-full w-full rounded-full bg-[#FFC857]" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#FFC857]" />
              </span>
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Live Offer Active
              </span>
            </div>

            <h2
              id="offer-heading"
              className="font-headline text-3xl sm:text-4xl lg:text-5xl text-[#0D1B2A] mb-4"
            >
              Get Started Today —
              <br />
              <span className="text-[#FFC857]">$10k System</span> for Just $57.99
            </h2>

            <p className="text-gray-600 text-lg mb-8">
              This complete training system gives you everything you need to turn your knowledge into consistent $10,000+ monthly income.{" "}
              <strong className="text-[#0D1B2A]">2 video trainings + implementation ebook</strong>{" "}
              with lifetime access and a 30-day money-back guarantee.
            </p>

            {/* Perk list */}
            <ul className="flex flex-col gap-3 mb-10" aria-label="Bundle inclusions">
              {perks.map(({ Icon, text }, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Icon className="w-5 h-5 text-[#1CE7D0] shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="text-sm text-gray-700">{text}</span>
                </li>
              ))}
            </ul>

            {/* Seats info */}
            <div className="flex items-center gap-2 mb-6">
              <UserGroupIcon className="w-5 h-5 text-[#FFC857]" aria-hidden="true" />
              <p className="text-sm font-semibold text-[#0D1B2A]">
                <span className="text-[#FFC857]">Instant access</span> — start learning in 2 minutes
              </p>
            </div>
          </div>

          {/* ── Right: Pricing card ──────────────────── */}
          <div>
            <div className="bg-[#0D1B2A] rounded-3xl p-8 md:p-10 shadow-2xl border border-[#FFC857]/20">
              {/* Section label */}
              <p className="text-[#1CE7D0] text-xs font-bold uppercase tracking-widest mb-4">
                Complete Course
              </p>

              {/* Price */}
              <div className="flex items-end gap-3 mb-2">
                <span className="text-5xl font-black text-[#FFC857]">$57.99</span>
              </div>
              <p className="text-white/60 text-sm mb-6">One-time payment · Lifetime access</p>

              {/* What's included */}
              <div className="bg-white/5 rounded-2xl p-4 mb-8">
                <ul className="space-y-2 text-left text-white/80 text-sm">
                  <li>✓ Video 1: Foundation (45 min)</li>
                  <li>✓ Video 2: Execution (52 min)</li>
                  <li>✓ Implementation ebook</li>
                  <li>✓ Templates & worksheets</li>
                </ul>
              </div>

              {/* CTA */}
              <Button variant="primary" size="lg" href="/register?redirect=checkout" fullWidth>
                Start Learning Now
              </Button>

              <p className="text-center text-white/40 text-xs mt-4">
                🔒 Secure checkout · 30-day money-back guarantee
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
