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
            See how students are transforming their knowledge into consistent income streams.
          </p>
        </div>

        {/* ── Carousel ─────────────────────────────────── */}
        <TestimonialCarousel />

        {/* ── Trust strip ──────────────────────────────── */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { stat: "200+", label: "Students Enrolled" },
            { stat: "97 min",    label: "Training Content" },
            { stat: "4.9★", label: "Average Rating" },
            { stat: "30 days", label: "Money-Back Guarantee" },
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
