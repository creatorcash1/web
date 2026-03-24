// ─── CoursesSection ──────────────────────────────────────────────────────────
// "What You Get" – detailed breakdown of the course content
// White background with gold / teal accents.
// ─────────────────────────────────────────────────────────────────────────────
import {
  VideoCameraIcon,
  DocumentTextIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import FreeOfferCountdown from "@/components/FreeOfferCountdown";
import { FREE_COURSE_OFFER_END_AT, isFreeCourseOfferActive } from "@/lib/freeOffer";

const courseContent = [
  {
    icon: <VideoCameraIcon className="w-8 h-8" />,
    title: "Video 1: Foundation – Building Your $10k System",
    duration: "45 minutes",
    description:
      "Discover the exact framework to identify your most valuable knowledge, package it into an irresistible offer, and position yourself as the go-to authority in your niche.",
    highlights: [
      "Find your profitable knowledge sweet spot",
      "Create your signature offer structure",
      "Price for profit (not poverty)",
      "Position yourself as an authority"
    ],
  },
  {
    icon: <VideoCameraIcon className="w-8 h-8" />,
    title: "Video 2: Execution – Scaling to Consistent Revenue",
    duration: "52 minutes",
    description:
      "Learn the proven systems to attract your ideal buyers, convert them into paying customers, and scale your income to $10k+ per month consistently.",
    highlights: [
      "Attract your ideal buyers daily",
      "Convert with simple selling systems",
      "Scale from $0 to $10k+ monthly",
      "Build sustainable income streams"
    ],
  },
  {
    icon: <DocumentTextIcon className="w-8 h-8" />,
    title: "Bonus: Complete Implementation Ebook",
    duration: "Your action plan",
    description:
      "Your step-by-step roadmap with templates, checklists, and worksheets to implement everything you learn. No guesswork — just follow the plan.",
    highlights: [
      "Step-by-step implementation checklist",
      "Ready-to-use templates & worksheets",
      "Troubleshooting guide for obstacles",
      "Resources and tools recommendations"
    ],
  },
];

export default function CoursesSection() {
  const isFree = isFreeCourseOfferActive();

  return (
    <section
      id="what-you-get"
      className="bg-white py-20 lg:py-28"
      aria-labelledby="courses-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Heading ─────────────────────────────────── */}
        <div className="text-center mb-14">
          <span className="inline-block bg-[#FFC857]/10 text-[#FFC857] border border-[#FFC857]/30 rounded-full text-xs font-bold uppercase tracking-widest px-4 py-1.5 mb-4">
            Complete Training System
          </span>
          <h2
            id="courses-heading"
            className="font-headline text-3xl sm:text-4xl lg:text-5xl text-[#0D1B2A] mb-4"
          >
            What You Get{" "}
            <span className="text-[#1CE7D0]">Inside</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            2 comprehensive video trainings and 1 implementation ebook — everything you need to turn your knowledge into $10k+ monthly income.
          </p>
        </div>

        {/* ── Course content breakdown ────────────────────────── */}
        <div className="space-y-8 max-w-4xl mx-auto">
          {courseContent.map((item, i) => (
            <div
              key={i}
              className="bg-linear-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-6">
                <div className="shrink-0 w-14 h-14 rounded-xl bg-[#1CE7D0]/10 text-[#1CE7D0] flex items-center justify-center">
                  {item.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h3 className="font-headline text-xl text-[#0D1B2A]">
                      {item.title}
                    </h3>
                    <span className="text-sm text-[#FFC857] font-semibold whitespace-nowrap">
                      {item.duration}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{item.description}</p>
                  <ul className="grid sm:grid-cols-2 gap-3">
                    {item.highlights.map((highlight, j) => (
                      <li key={j} className="flex items-start gap-2">
                        <CheckCircleIcon className="w-5 h-5 text-[#1CE7D0] shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── CTA Section ────────────────────────── */}
        <div className="mt-14 text-center">
          <div className="inline-block bg-linear-to-r from-[#0D1B2A] to-[#0a3d3a] rounded-2xl p-8 max-w-2xl">
            <div className="mb-4">
              <span className="text-xs text-[#FFC857] font-bold uppercase tracking-widest">
                Complete Package
              </span>
              <h3 className="text-white font-headline text-2xl mt-2 mb-3">
                Get Instant Access to Everything
              </h3>
              <p className="text-white/65 text-sm">
                2 video trainings + implementation ebook + lifetime access
              </p>
            </div>
            <div className="flex items-center justify-center gap-4 mb-6">
              {isFree ? (
                <>
                  <span className="text-3xl font-bold text-white/50 line-through">$57.99</span>
                  <span className="text-5xl font-black text-[#FFC857]">$0</span>
                </>
              ) : (
                <span className="text-5xl font-black text-[#FFC857]">$57.99</span>
              )}
            </div>
            {isFree && (
              <div className="mb-4 text-center">
                <p className="text-white/70 text-xs uppercase tracking-widest mb-1">Free offer ends in</p>
                <FreeOfferCountdown targetDate={FREE_COURSE_OFFER_END_AT} />
              </div>
            )}
            <a
              href="/register?redirect=checkout"
              className="inline-block bg-[#FFC857] hover:bg-[#FFB627] text-[#0D1B2A] font-bold px-8 py-4 rounded-xl transition-colors"
            >
              {isFree ? "Get Free Access →" : "Start Learning Now →"}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
