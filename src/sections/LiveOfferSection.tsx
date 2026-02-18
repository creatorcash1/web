// ─── LiveOfferSection ────────────────────────────────────────────────────────
// Scarcity section: first-5-buyers price, countdown timer, free mentorship
// badge, and gold CTA button.
// ─────────────────────────────────────────────────────────────────────────────
import CountdownTimer from "@/components/CountdownTimer";
import Button from "@/components/Button";
import {
  CheckBadgeIcon,
  ClockIcon,
  UserGroupIcon,
  GiftIcon,
} from "@heroicons/react/24/solid";

// Target: first day of next month at midnight
const TARGET_DATE = "2026-03-01T23:59:59";

const perks = [
  { Icon: CheckBadgeIcon, text: "All 5 premium courses (lifetime access)" },
  { Icon: GiftIcon,       text: "FREE 2-hour 1:1 mentorship with CC Mendel ($950 value)" },
  { Icon: CheckBadgeIcon, text: "All downloadable templates & resources" },
  { Icon: CheckBadgeIcon, text: "Access to private creator community" },
  { Icon: CheckBadgeIcon, text: "7-day satisfaction guarantee" },
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
              Claim Your Spot —
              <br />
              <span className="text-[#FFC857]">First 5 Buyers</span> Get Everything
            </h2>

            <p className="text-gray-600 text-lg mb-8">
              Right now, the full platform access is dropping to{" "}
              <strong className="text-[#0D1B2A]">$399</strong> (was $550) — and the
              first five people who grab it also get a{" "}
              <strong className="text-[#0D1B2A]">FREE 2-hour 1:1 mentorship</strong>{" "}
              session with CC Mendel. This price goes back up when the timer hits zero.
            </p>

            {/* Perk list */}
            <ul className="flex flex-col gap-3 mb-10" aria-label="Bundle inclusions">
              {perks.map(({ Icon, text }, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Icon className="w-5 h-5 text-[#1CE7D0] flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="text-sm text-gray-700">{text}</span>
                </li>
              ))}
            </ul>

            {/* Seats remaining */}
            <div className="flex items-center gap-2 mb-6">
              <UserGroupIcon className="w-5 h-5 text-[#FFC857]" aria-hidden="true" />
              <p className="text-sm font-semibold text-[#0D1B2A]">
                Only <span className="text-[#FFC857]">3 spots remaining</span> at this price
              </p>
            </div>
          </div>

          {/* ── Right: Pricing card ──────────────────── */}
          <div>
            <div className="bg-[#0D1B2A] rounded-3xl p-8 md:p-10 shadow-2xl border border-[#FFC857]/20">
              {/* Section label */}
              <p className="text-[#1CE7D0] text-xs font-bold uppercase tracking-widest mb-4">
                Full Access Bundle
              </p>

              {/* Price */}
              <div className="flex items-end gap-3 mb-2">
                <span className="text-5xl font-black text-[#FFC857]">$399</span>
                <span className="text-white/40 text-2xl line-through mb-1">$550</span>
              </div>
              <p className="text-white/60 text-sm mb-6">One-time payment · Lifetime access</p>

              {/* Countdown */}
              <div className="bg-white/5 rounded-2xl p-4 mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <ClockIcon className="w-4 h-4 text-[#FFC857]" aria-hidden="true" />
                  <p className="text-white/60 text-xs font-semibold uppercase tracking-wider">
                    Offer expires in
                  </p>
                </div>
                <CountdownTimer targetDate={TARGET_DATE} />
              </div>

              {/* CTA */}
              <Button variant="primary" size="lg" href="/checkout/mentorship-2hr" fullWidth>
                Claim Your Spot Now
              </Button>

              <p className="text-center text-white/40 text-xs mt-4">
                🔒 Secure checkout · Stripe & PayPal accepted
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
