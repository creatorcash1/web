// ─── Video Demo Section (Placeholder) ────────────────────────────────────────
// Simple navy section with a placeholder video embed for "Watch Live Demo" CTA.
// ─────────────────────────────────────────────────────────────────────────────
import Button from "@/components/Button";
import { PlayCircleIcon } from "@heroicons/react/24/solid";

export default function DemoSection() {
  return (
    <section
      id="demo"
      className="bg-[#0D1B2A] py-20 lg:py-28"
      aria-labelledby="demo-heading"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="inline-block bg-[#1CE7D0]/10 text-[#1CE7D0] border border-[#1CE7D0]/30 rounded-full text-xs font-bold uppercase tracking-widest px-4 py-1.5 mb-6">
          See It In Action
        </span>
        <h2
          id="demo-heading"
          className="font-headline text-3xl sm:text-4xl lg:text-5xl text-white mb-6"
        >
          How to Turn What You Know Into{" "}
          <span className="text-[#FFC857]">$10k Monthly</span>
        </h2>
        <p className="text-white/60 text-lg mb-10 max-w-2xl mx-auto">
          Watch this free preview where CC Mendel reveals the exact framework for transforming your knowledge into a consistent $10,000+ monthly income stream.
        </p>

        {/* Video placeholder */}
        <div
          className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black/40 flex items-center justify-center group cursor-pointer mb-8"
          role="img"
          aria-label="Video placeholder — watch the live demo"
        >
          <img
            src="https://images.unsplash.com/photo-1587440871875-191322ee64b0?w=1200&auto=format&fit=crop&q=70"
            alt="Creator filming content for their digital platform"
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          />
          <div className="relative z-10 flex flex-col items-center gap-3">
            <PlayCircleIcon
              className="w-20 h-20 text-[#FFC857] group-hover:scale-110 transition-transform duration-200"
              aria-hidden="true"
            />
            <span className="text-white/70 text-sm font-medium">
              Click to play · 12 min preview
            </span>
          </div>
        </div>

        <Button variant="primary" size="lg" href="/register?redirect=checkout">
          Ready? Get Full Access →
        </Button>
      </div>
    </section>
  );
}
