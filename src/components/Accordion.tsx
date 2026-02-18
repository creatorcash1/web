// ─── Accordion ───────────────────────────────────────────────────────────────
// Smooth expand/collapse FAQ accordion. Only one item open at a time.
// Teal/gold hover indicators per spec.
// ─────────────────────────────────────────────────────────────────────────────
"use client";

import { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "What's included in the full access bundle?",
    answer:
      "You get lifetime access to all 5 premium courses (UGC, Dropshipping, TikTok Shop, Digital Platform Building, and PDF Creation), all downloadable resources & templates, progress tracking, bonus materials — plus a FREE 2-hour 1:1 mentorship session with CC Mendel when you're among the first 5 buyers.",
  },
  {
    question: "Do I need any experience to get started?",
    answer:
      "Absolutely not. The courses are designed for complete beginners. Every module starts from the fundamentals and builds up with practical, step-by-step video lessons. As long as you have Wi-Fi and motivation, you're ready.",
  },
  {
    question: "How does the 1:1 mentorship session work?",
    answer:
      "After purchasing the first-5-buyers bundle, you'll receive a calendar link to book your 2-hour session directly with CC Mendel. Sessions are conducted via Zoom. You'll leave with a working digital asset and a personalised action plan.",
  },
  {
    question: "What payment methods are accepted?",
    answer:
      "We accept all major credit/debit cards via Stripe and PayPal. Transactions are fully encrypted and secure. After payment you receive instant dashboard access.",
  },
  {
    question: "Is there a refund policy?",
    answer:
      "Yes. We offer a 7-day satisfaction guarantee. If you go through the first module and honestly feel it's not for you, reach out to our support team and we'll process a full refund — no questions asked.",
  },
];

export default function Accordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <div className="flex flex-col gap-3" role="list" aria-label="Frequently asked questions">
      {faqs.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div
            key={i}
            role="listitem"
            className={`rounded-xl border transition-all duration-200
              ${isOpen
                ? "border-[#1CE7D0] shadow-md shadow-[#1CE7D0]/10"
                : "border-[#E5E5E5] hover:border-[#FFC857]/50"
              }`}
          >
            {/* Question row */}
            <button
              onClick={() => toggle(i)}
              aria-expanded={isOpen}
              aria-controls={`faq-answer-${i}`}
              id={`faq-question-${i}`}
              className={`w-full flex items-center justify-between px-6 py-5 text-left transition-colors duration-200
                ${isOpen ? "text-[#1CE7D0]" : "text-[#0D1B2A] hover:text-[#FFC857]"}`}
            >
              <span className="font-bold text-base pr-4">{item.question}</span>
              <ChevronDownIcon
                className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${
                  isOpen ? "rotate-180 text-[#1CE7D0]" : "text-gray-400"
                }`}
              />
            </button>

            {/* Answer */}
            <div
              id={`faq-answer-${i}`}
              role="region"
              aria-labelledby={`faq-question-${i}`}
              className="accordion-content"
              style={{
                maxHeight: isOpen ? "500px" : "0px",
                opacity: isOpen ? 1 : 0,
              }}
            >
              <p className="px-6 pb-5 text-gray-600 text-sm leading-relaxed">
                {item.answer}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
