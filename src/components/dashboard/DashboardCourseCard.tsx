// ─── DashboardCourseCard ─────────────────────────────────────────────────────
// Premium course card: glassmorphism, gradient progress, smooth animations
// ─────────────────────────────────────────────────────────────────────────────
"use client";

import { useState } from "react";
import { PlayIcon, CheckCircleIcon, SparklesIcon } from "@heroicons/react/24/solid";
import type { EnrolledCourse } from "@/types/dashboard";

interface Props {
  course: EnrolledCourse;
}

export default function DashboardCourseCard({ course }: Props) {
  const [isHovered, setIsHovered] = useState(false);
  const isCompleted = course.progress === 100;
  const isNew = course.progress === 0;

  // Dynamic status text
  const getStatusText = () => {
    if (isCompleted) return "Completed 🎉";
    if (isNew) return "New Course ✨";
    if (course.progress > 75) return "Almost there! 🔥";
    if (course.progress > 50) return "Halfway! 💪";
    return "Keep going 🚀";
  };

  // Dynamic CTA text - casual, modern tone
  const getCTAText = () => {
    if (isCompleted) return "Revisit";
    if (isNew) return "Let's Go";
    if (course.progress > 75) return "Finish This";
    return "Continue";
  };

  return (
    <div
      className="group relative overflow-hidden rounded-3xl transition-all duration-500 ease-out"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transform: isHovered ? "translateY(-8px) scale(1.02)" : "translateY(0) scale(1)",
      }}
    >
      {/* Glow effect on hover */}
      <div
        className="absolute -inset-1 rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"
        style={{
          background: isCompleted
            ? "linear-gradient(135deg, #10B981 0%, #34D399 100%)"
            : "linear-gradient(135deg, #1CE7D0 0%, #FFC857 50%, #F472B6 100%)",
        }}
      />

      {/* Main card */}
      <div className="relative bg-gradient-to-br from-[#0D1B2A] via-[#12263A] to-[#0D1B2A] rounded-3xl overflow-hidden border border-white/10 backdrop-blur-xl">
        {/* Thumbnail with overlay */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={course.thumbnail_url}
            alt={course.title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            loading="lazy"
          />
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D1B2A] via-[#0D1B2A]/40 to-transparent" />
          
          {/* Status badge */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            {isNew && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-[#F472B6] to-[#FB923C] text-white shadow-lg shadow-pink-500/25">
                <SparklesIcon className="w-3.5 h-3.5" />
                NEW
              </span>
            )}
            {isCompleted && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-emerald-400 to-teal-400 text-[#0D1B2A] shadow-lg shadow-emerald-500/25">
                <CheckCircleIcon className="w-3.5 h-3.5" />
                DONE
              </span>
            )}
          </div>

          {/* Progress circle */}
          <div className="absolute top-4 right-4">
            <div className="relative w-14 h-14">
              {/* Background circle */}
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="28"
                  cy="28"
                  r="24"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="4"
                  fill="transparent"
                />
                <circle
                  cx="28"
                  cy="28"
                  r="24"
                  stroke="url(#progressGradient)"
                  strokeWidth="4"
                  fill="transparent"
                  strokeLinecap="round"
                  strokeDasharray={`${course.progress * 1.508} 150.8`}
                  className="transition-all duration-1000 ease-out"
                />
                <defs>
                  <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#1CE7D0" />
                    <stop offset="100%" stopColor="#FFC857" />
                  </linearGradient>
                </defs>
              </svg>
              {/* Percentage text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-black text-white">{course.progress}%</span>
              </div>
            </div>
          </div>

          {/* Play button overlay on hover */}
          <a
            href={`/courses/${course.id}`}
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
          >
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-2xl transform scale-75 group-hover:scale-100 transition-transform duration-300">
              <PlayIcon className="w-7 h-7 text-white ml-1" />
            </div>
          </a>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Title */}
          <h3 className="text-lg font-bold text-white leading-tight line-clamp-2 group-hover:text-[#1CE7D0] transition-colors duration-300">
            {course.title}
          </h3>

          {/* Status text */}
          <p className="text-sm text-white/50 font-medium">
            {getStatusText()}
          </p>

          {/* Progress bar - modern gradient style */}
          <div className="space-y-2">
            <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out relative"
                style={{
                  width: `${course.progress}%`,
                  background: isCompleted
                    ? "linear-gradient(90deg, #10B981 0%, #34D399 100%)"
                    : "linear-gradient(90deg, #1CE7D0 0%, #FFC857 50%, #F472B6 100%)",
                }}
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <a
            href={`/courses/${course.id}`}
            className="relative w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl font-bold text-sm uppercase tracking-wide overflow-hidden transition-all duration-300 group/btn"
            style={{
              background: isCompleted
                ? "linear-gradient(135deg, #10B981 0%, #059669 100%)"
                : "linear-gradient(135deg, #FFC857 0%, #F59E0B 100%)",
              color: isCompleted ? "#fff" : "#0D1B2A",
            }}
          >
            {/* Button glow */}
            <span className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"
              style={{
                background: isCompleted
                  ? "linear-gradient(135deg, #34D399 0%, #10B981 100%)"
                  : "linear-gradient(135deg, #FBBF24 0%, #FFC857 100%)",
              }}
            />
            <span className="relative z-10">{getCTAText()}</span>
            <span className="relative z-10 transform group-hover/btn:translate-x-1 transition-transform duration-200">→</span>
          </a>
        </div>
      </div>
    </div>
  );
}
