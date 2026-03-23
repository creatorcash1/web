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
    question: "What exactly do I get with this course?",
    answer:
      "You get lifetime access to 2 comprehensive video trainings (97 minutes total) plus a complete implementation ebook with templates, worksheets, and checklists. Everything you need to turn your knowledge into $10k+ monthly income.",
  },
  {
    question: "Do I need any experience to get started?",
    answer:
      "No experience required! This course is designed for anyone with knowledge or skills they want to monetize — whether you're just starting out or already have an audience. If you know something valuable, this system will help you package and sell it.",
  },
  {
    question: "How long do I have access to the course?",
    answer:
      "Lifetime access! Once you purchase, you can watch the videos and download the materials whenever you want, as many times as you need. Learn at your own pace.",
  },
  {
    question: "What payment methods are accepted?",
    answer:
      "We accept all major credit/debit cards via Stripe. Transactions are fully encrypted and secure. After payment you receive instant access to your course dashboard.",
  },
  {
    question: "Is there a refund policy?",
    answer:
      "Yes! We offer a 30-day money-back guarantee. If you watch the training and honestly feel it's not for you, reach out to hello@creatorcashcow.com and we'll process a full refund — no questions asked.",
  },
  {
    question: "How long does it take to see results?",
    answer:
      "That depends on your implementation speed. Some students see their first sales within weeks, while others take a few months to build their system. The course gives you the complete roadmap — your results depend on how quickly you take action.",
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
                className={`w-5 h-5 shrink-0 transition-transform duration-300 ${
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
