// ─── CoursesSection ──────────────────────────────────────────────────────────
// Premium Gen Z course grid with filtering and modern empty state.
// ─────────────────────────────────────────────────────────────────────────────
"use client";

import { useState } from "react";
import { AcademicCapIcon, SparklesIcon, FireIcon, CheckBadgeIcon } from "@heroicons/react/24/solid";
import DashboardCourseCard from "@/components/dashboard/DashboardCourseCard";
import EmptyState from "@/components/dashboard/EmptyState";
import type { EnrolledCourse } from "@/types/dashboard";

interface Props {
  courses: EnrolledCourse[];
}

type FilterType = "all" | "in-progress" | "completed" | "not-started";

export default function CoursesSection({ courses }: Props) {
  const [filter, setFilter] = useState<FilterType>("all");

  // Filter courses based on selected filter
  const filteredCourses = courses.filter((c) => {
    if (filter === "all") return true;
    if (filter === "completed") return c.progress === 100;
    if (filter === "not-started") return c.progress === 0;
    if (filter === "in-progress") return c.progress > 0 && c.progress < 100;
    return true;
  });

  // Stats calculation
  const totalCourses = courses.length;
  const completedCount = courses.filter((c) => c.progress === 100).length;
  const inProgressCount = courses.filter((c) => c.progress > 0 && c.progress < 100).length;
  const avgProgress = totalCourses > 0 
    ? Math.round(courses.reduce((sum, c) => sum + c.progress, 0) / totalCourses)
    : 0;

  if (courses.length === 0) {
    return (
      <EmptyState
        icon={<AcademicCapIcon className="w-10 h-10" />}
        title="Your journey starts here"
        description="Ready to level up? Grab your first course and start building wealth like a pro. No cap, this is gonna change everything."
        ctaLabel="Explore Courses"
        ctaHref="/courses"
      />
    );
  }

  const filters: { key: FilterType; label: string; icon: React.ReactNode; count: number }[] = [
    { key: "all", label: "All", icon: <SparklesIcon className="w-4 h-4" />, count: totalCourses },
    { key: "in-progress", label: "In Progress", icon: <FireIcon className="w-4 h-4" />, count: inProgressCount },
    { key: "completed", label: "Completed", icon: <CheckBadgeIcon className="w-4 h-4" />, count: completedCount },
  ];

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0D1B2A] via-[#12263A] to-[#0D1B2A] p-6 md:p-8 border border-white/10">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#1CE7D0]/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-[#FFC857]/20 to-transparent rounded-full blur-3xl" />
        
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Title and subtitle */}
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Your Courses <span className="text-[#FFC857]">✦</span>
            </h1>
            <p className="text-white/60 text-sm md:text-base">
              {totalCourses} course{totalCourses !== 1 ? "s" : ""} enrolled • {avgProgress}% average progress
            </p>
          </div>

          {/* Quick stats */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                <CheckBadgeIcon className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-white font-bold text-lg leading-none">{completedCount}</p>
                <p className="text-white/40 text-xs">Done</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#FFC857] to-amber-500 flex items-center justify-center">
                <FireIcon className="w-4 h-4 text-[#0D1B2A]" />
              </div>
              <div>
                <p className="text-white font-bold text-lg leading-none">{inProgressCount}</p>
                <p className="text-white/40 text-xs">Active</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {filters.map(({ key, label, icon, count }) => {
          const isActive = filter === key;
          return (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-300
                ${isActive 
                  ? "bg-gradient-to-r from-[#1CE7D0] to-[#FFC857] text-[#0D1B2A] shadow-lg shadow-teal-500/25" 
                  : "bg-[#0D1B2A]/5 text-[#0D1B2A]/60 hover:bg-[#0D1B2A]/10 hover:text-[#0D1B2A]"
                }
              `}
            >
              {icon}
              <span>{label}</span>
              <span className={`
                ml-1 px-2 py-0.5 rounded-full text-xs font-bold
                ${isActive ? "bg-white/30 text-[#0D1B2A]" : "bg-[#0D1B2A]/10 text-[#0D1B2A]/50"}
              `}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Course Grid */}
      {filteredCourses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#0D1B2A]/5 flex items-center justify-center mb-4">
            <AcademicCapIcon className="w-8 h-8 text-[#0D1B2A]/30" />
          </div>
          <p className="text-[#0D1B2A]/50 text-sm font-medium">No courses match this filter</p>
          <button 
            onClick={() => setFilter("all")}
            className="mt-3 text-[#1CE7D0] font-semibold text-sm hover:underline"
          >
            View all courses
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCourses.map((c) => (
            <DashboardCourseCard key={c.id} course={c} />
          ))}
        </div>
      )}

      {/* Browse more CTA */}
      {courses.length > 0 && (
        <div className="flex justify-center pt-4">
          <a
            href="/courses"
            className="group flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#0D1B2A] text-white font-bold text-sm
                       hover:bg-[#12263A] transition-all duration-300 shadow-lg shadow-[#0D1B2A]/25"
          >
            <SparklesIcon className="w-4 h-4 text-[#FFC857]" />
            Explore More Courses
            <span className="transform group-hover:translate-x-1 transition-transform duration-200">→</span>
          </a>
        </div>
      )}
    </div>
  );
}
