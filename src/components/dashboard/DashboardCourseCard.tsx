// ─── DashboardCourseCard ─────────────────────────────────────────────────────
// Enrolled course card: thumbnail, title, description, progress, continue CTA.
// ─────────────────────────────────────────────────────────────────────────────
import ProgressBar from "./ProgressBar";
import type { EnrolledCourse } from "@/types/dashboard";

interface Props {
  course: EnrolledCourse;
}

export default function DashboardCourseCard({ course }: Props) {
  return (
    <div
      className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden shadow-sm
                 hover:shadow-xl hover:border-[#1CE7D0]/40 hover:-translate-y-0.5
                 transition-all duration-300 flex flex-col"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-[#E5E5E5]">
        <img
          src={course.thumbnail_url}
          alt={`${course.title} thumbnail`}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {/* Progress badge */}
        <span className="absolute top-3 right-3 text-xs font-bold bg-[#0D1B2A]/80 text-[#FFC857] backdrop-blur px-2.5 py-1 rounded-full">
          {course.progress}%
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        <h3 className="text-base font-bold text-[#0D1B2A] leading-tight">
          {course.title}
        </h3>
        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
          {course.description}
        </p>

        {/* Progress bar */}
        <div className="mt-auto pt-2">
          <ProgressBar percentage={course.progress} />
        </div>

        {/* Continue button */}
        <a
          href={`/courses/${course.id}`}
          className="mt-1 inline-flex items-center justify-center bg-[#FFC857] text-[#0D1B2A] text-sm
                     font-bold uppercase tracking-wider rounded-full px-5 py-2.5
                     hover:bg-[#f5b732] hover:scale-[1.03] transition-all duration-200 shadow-sm"
        >
          {course.progress > 0 ? "Continue" : "Start"} →
        </a>
      </div>
    </div>
  );
}
