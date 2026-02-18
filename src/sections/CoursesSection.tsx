// ─── CoursesSection ──────────────────────────────────────────────────────────
// "What's Inside The Blueprint?" – 5 course cards in a responsive grid.
// White background with gold / teal accents.
// ─────────────────────────────────────────────────────────────────────────────
import CourseCard from "@/components/CourseCard";
import {
  VideoCameraIcon,
  ShoppingBagIcon,
  DevicePhoneMobileIcon,
  GlobeAltIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

const courses = [
  {
    courseId: "crs_001",
    icon: <VideoCameraIcon className="w-7 h-7" />,
    title: "UGC Mastery",
    description:
      "Land brand deals, create scroll-stopping content, and build a UGC portfolio that brands pay for — even with zero followers.",
    badge: "Most Popular",
  },
  {
    courseId: "crs_002",
    icon: <ShoppingBagIcon className="w-7 h-7" />,
    title: "Dropshipping Profits",
    description:
      "Launch a profitable online store from scratch with no inventory. Proven product research, supplier sourcing, and scaling strategies.",
  },
  {
    courseId: "crs_003",
    icon: <DevicePhoneMobileIcon className="w-7 h-7" />,
    title: "TikTok Shop Success",
    description:
      "Tap into the fastest-growing commerce platform. Learn to find winning products, create viral content, and earn affiliate commissions daily.",
  },
  {
    courseId: "crs_004",
    icon: <GlobeAltIcon className="w-7 h-7" />,
    title: "Build Your Own Platform",
    description:
      "Create a branded digital platform that solves real problems — with your own site, email list, and multiple passive income streams.",
    badge: "New",
  },
  {
    courseId: "crs_005",
    icon: <DocumentTextIcon className="w-7 h-7" />,
    title: "PDF Creation & Digital Products",
    description:
      "Design, publish, and sell high-value eBooks and templates. Turn your knowledge into a digital product empire with recurring sales.",
  },
];

export default function CoursesSection() {
  return (
    <section
      id="courses"
      className="bg-white py-20 lg:py-28"
      aria-labelledby="courses-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Heading ─────────────────────────────────── */}
        <div className="text-center mb-14">
          <span className="inline-block bg-[#FFC857]/10 text-[#FFC857] border border-[#FFC857]/30 rounded-full text-xs font-bold uppercase tracking-widest px-4 py-1.5 mb-4">
            5 Power Courses
          </span>
          <h2
            id="courses-heading"
            className="font-headline text-3xl sm:text-4xl lg:text-5xl text-[#0D1B2A] mb-4"
          >
            What&rsquo;s Inside{" "}
            <span className="text-[#1CE7D0]">The Blueprint?</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Each course is a complete system — videos, templates, checklists,
            and bonus resources — built to take you from idea to income.
          </p>
        </div>

        {/* ── Course card grid ────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((c, i) => (
            <CourseCard key={i} {...c} />
          ))}

          {/* Bonus card */}
          <div className="sm:col-span-2 lg:col-span-3">
            <div className="bg-gradient-to-r from-[#0D1B2A] to-[#0a3d3a] rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <span className="text-xs text-[#FFC857] font-bold uppercase tracking-widest">
                  Exclusive Bonus
                </span>
                <h3 className="text-white font-headline text-2xl mt-1 mb-2">
                  2-Hour 1:1 Mentorship with CC Mendel
                </h3>
                <p className="text-white/65 text-sm max-w-xl">
                  Get personalised guidance, live account audits, and a custom
                  action plan — included FREE for the first 5 bundle buyers.
                </p>
              </div>
              <div className="flex-shrink-0 text-center">
                <p className="text-white/50 text-sm line-through">$950 value</p>
                <p className="text-[#FFC857] font-black text-3xl">FREE</p>
                <p className="text-[#1CE7D0] text-xs font-semibold mt-1">First 5 buyers only</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
