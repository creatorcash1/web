// ─── TestimonialsSection ──────────────────────────────────────────────────────
// White background section wrapping the testimonials carousel component.
// ─────────────────────────────────────────────────────────────────────────────
import TestimonialCarousel from "@/components/TestimonialCarousel";

export default function TestimonialsSection() {
  return (
    <section
      id="testimonials"
      className="bg-white py-20 lg:py-28"
      aria-labelledby="testimonials-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Heading ─────────────────────────────────── */}
        <div className="text-center mb-14">
          <span className="inline-block bg-[#1CE7D0]/10 text-[#1CE7D0] border border-[#1CE7D0]/30 rounded-full text-xs font-bold uppercase tracking-widest px-4 py-1.5 mb-4">
            Real Results
          </span>
          <h2
            id="testimonials-heading"
            className="font-headline text-3xl sm:text-4xl lg:text-5xl text-[#0D1B2A] mb-4"
          >
            Creators Who{" "}
            <span className="text-[#FFC857]">Took Action</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Don&rsquo;t take our word for it — hear from the community building
            their empires right now.
          </p>
        </div>

        {/* ── Carousel ─────────────────────────────────── */}
        <TestimonialCarousel />

        {/* ── Trust strip ──────────────────────────────── */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { stat: "500+", label: "Active Creators" },
            { stat: "5",    label: "Premium Courses" },
            { stat: "$1M+", label: "Creator Revenue Generated" },
            { stat: "4.9★", label: "Average Rating" },
          ].map(({ stat, label }) => (
            <div key={label} className="flex flex-col gap-1">
              <span className="font-headline text-3xl text-[#0D1B2A]">{stat}</span>
              <span className="text-sm text-gray-500">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
