// ─── TestimonialCarousel ─────────────────────────────────────────────────────
// Auto-scrolling carousel with manual prev/next controls and dot pagination.
// Uses CSS transitions for smooth sliding.
// ─────────────────────────────────────────────────────────────────────────────
"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  quote: string;
  highlight: string;
  avatar: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Jasmine Roberts",
    role: "UGC Creator & Entrepreneur",
    quote:
      "CC Mendel completely changed the way I see digital income. I went from zero brand deals to consistently earning through UGC within 60 days of joining the platform.",
    highlight: "60 days to consistent UGC income",
    avatar: "https://i.pravatar.cc/80?img=47",
  },
  {
    id: 2,
    name: "Marcus Thompson",
    role: "TikTok Shop Seller",
    quote:
      "The TikTok Shop course broke everything down step by step. I made my first sale within a week. The mentorship session alone was worth 10x the price.",
    highlight: "First TikTok Shop sale in one week",
    avatar: "https://i.pravatar.cc/80?img=12",
  },
  {
    id: 3,
    name: "Priya Nair",
    role: "Digital Product Creator",
    quote:
      "I never thought I could sell PDFs online. After the PDF creation course I launched my first eBook and made $1,200 in my first month. Mind-blowing.",
    highlight: "$1,200 first month selling PDFs",
    avatar: "https://i.pravatar.cc/80?img=32",
  },
  {
    id: 4,
    name: "DeShawn Williams",
    role: "Dropshipping Entrepreneur",
    quote:
      "Every question I had was answered during the 2-hour 1:1 with CC. He helped me set up my Shopify store live. I walked away ready to go.",
    highlight: "Full store setup in one mentorship session",
    avatar: "https://i.pravatar.cc/80?img=68",
  },
  {
    id: 5,
    name: "Alicia Moreno",
    role: "Platform Builder",
    quote:
      "The 'Build Your Own Platform' module was a game-changer. I now have my own branded site, email list, and three income streams. This community is the real deal.",
    highlight: "3 income streams from scratch",
    avatar: "https://i.pravatar.cc/80?img=56",
  },
];

export default function TestimonialCarousel() {
  const [active, setActive] = useState(0);

  const prev = useCallback(
    () => setActive((a) => (a === 0 ? testimonials.length - 1 : a - 1)),
    []
  );
  const next = useCallback(
    () => setActive((a) => (a === testimonials.length - 1 ? 0 : a + 1)),
    []
  );

  // Auto-scroll every 5 seconds
  useEffect(() => {
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [next]);

  const t = testimonials[active];

  return (
    <div className="relative max-w-3xl mx-auto" aria-label="Testimonials carousel">
      {/* Card */}
      <div
        key={t.id}
        className="bg-white rounded-2xl shadow-xl border border-[#E5E5E5] p-8 md:p-12
                   transition-all duration-500"
      >
        {/* Quote mark */}
        <div className="text-6xl text-[#FFC857] font-black leading-none mb-4 select-none" aria-hidden="true">
          "
        </div>

        <p className="text-[#0D1B2A] text-lg md:text-xl leading-relaxed mb-6 italic">
          {t.quote}
        </p>

        {/* Highlight badge */}
        <div className="inline-flex items-center gap-2 bg-[#1CE7D0]/10 border border-[#1CE7D0]/30 rounded-full px-4 py-1.5 mb-6">
          <span className="w-2 h-2 rounded-full bg-[#1CE7D0] inline-block" />
          <span className="text-sm font-semibold text-[#1CE7D0]">{t.highlight}</span>
        </div>

        {/* Author */}
        <div className="flex items-center gap-4 mt-4">
          {/* Avatar placeholder */}
          <img
            src={t.avatar}
            alt={`Portrait of ${t.name}`}
            width={56}
            height={56}
            className="w-14 h-14 rounded-full object-cover border-2 border-[#FFC857]"
          />
          <div>
            <p className="font-bold text-[#0D1B2A]">{t.name}</p>
            <p className="text-sm text-gray-500">{t.role}</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mt-6">
        {/* Prev */}
        <button
          onClick={prev}
          aria-label="Previous testimonial"
          className="w-10 h-10 rounded-full border-2 border-[#1CE7D0]/40 text-[#1CE7D0]
                     hover:bg-[#1CE7D0] hover:text-[#0D1B2A] transition-all flex items-center justify-center"
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </button>

        {/* Dots */}
        <div className="flex gap-2" role="tablist" aria-label="Testimonial navigation dots">
          {testimonials.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === active}
              aria-label={`Go to testimonial ${i + 1}`}
              onClick={() => setActive(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === active
                  ? "w-6 bg-[#FFC857]"
                  : "w-2 bg-[#E5E5E5] hover:bg-[#1CE7D0]"
              }`}
            />
          ))}
        </div>

        {/* Next */}
        <button
          onClick={next}
          aria-label="Next testimonial"
          className="w-10 h-10 rounded-full border-2 border-[#1CE7D0]/40 text-[#1CE7D0]
                     hover:bg-[#1CE7D0] hover:text-[#0D1B2A] transition-all flex items-center justify-center"
        >
          <ChevronRightIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
