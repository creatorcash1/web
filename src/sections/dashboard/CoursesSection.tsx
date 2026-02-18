// ─── CoursesSection ──────────────────────────────────────────────────────────
// Full grid of enrolled courses with empty-state fallback.
// ─────────────────────────────────────────────────────────────────────────────
import { AcademicCapIcon } from "@heroicons/react/24/outline";
import DashboardCourseCard from "@/components/dashboard/DashboardCourseCard";
import EmptyState from "@/components/dashboard/EmptyState";
import type { EnrolledCourse } from "@/types/dashboard";

interface Props {
  courses: EnrolledCourse[];
}

export default function CoursesSection({ courses }: Props) {
  if (courses.length === 0) {
    return (
      <EmptyState
        icon={<AcademicCapIcon className="w-8 h-8" />}
        title="No courses yet"
        description="Your creator journey starts with a single course. Explore the catalogue and unlock your first digital skill."
        ctaLabel="Browse Courses"
        ctaHref="/courses"
      />
    );
  }

  return (
    <div>
      <h2 className="font-bold text-[#0D1B2A] text-xl mb-5">My Courses</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {courses.map((c) => (
          <DashboardCourseCard key={c.id} course={c} />
        ))}
      </div>
    </div>
  );
}
