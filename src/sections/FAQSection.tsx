// ─── FAQSection ──────────────────────────────────────────────────────────────
// Cool Gray background section wrapping the Accordion component + a CTA strip.
// ─────────────────────────────────────────────────────────────────────────────
import Accordion from "@/components/Accordion";
import Button from "@/components/Button";

export default function FAQSection() {
  return (
    <section
      id="faq"
      className="bg-[#E5E5E5] py-20 lg:py-28"
      aria-labelledby="faq-heading"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-12">
          <span className="inline-block bg-[#FFC857]/10 text-[#FFC857] border border-[#FFC857]/30 rounded-full text-xs font-bold uppercase tracking-widest px-4 py-1.5 mb-4">
            Got Questions?
          </span>
          <h2
            id="faq-heading"
            className="font-headline text-3xl sm:text-4xl text-[#0D1B2A] mb-3"
          >
            Frequently Asked{" "}
            <span className="text-[#1CE7D0]">Questions</span>
          </h2>
          <p className="text-gray-500 text-base max-w-lg mx-auto">
            Everything you need to know before getting started. Can&rsquo;t
            find your answer? Email us at{" "}
            <a
              href="mailto:hello@creatorcashcow.com"
              className="text-[#1CE7D0] hover:underline"
            >
              hello@creatorcashcow.com
            </a>
            .
          </p>
        </div>

        {/* Accordion */}
        <Accordion />

        {/* Bottom CTA strip */}
        <div className="mt-14 bg-[#0D1B2A] rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-white font-headline text-xl mb-1">
              Ready to build your $10k system?
            </h3>
            <p className="text-white/60 text-sm">
              Get instant access to the complete training for $57.99
            </p>
          </div>
          <Button variant="primary" size="lg" href="/register?redirect=checkout">
            Get Started Now
          </Button>
        </div>
      </div>
    </section>
  );
}
