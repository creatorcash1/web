// ─── CourseCard ─────────────────────────────────────────────────────────────
// Displays a single course with icon, title, description, and a hover effect.
// ───────────────────────────────────────────────────────────────────────────
import React from "react";
import Link from "next/link";

interface CourseCardProps {
  icon: React.ReactNode;
  courseId: string;
  title: string;
  description: string;
  badge?: string;
}

export default function CourseCard({ icon, courseId, title, description, badge }: CourseCardProps) {
  return (
    <div
      className="group relative bg-white rounded-2xl p-6 shadow-md border border-[#E5E5E5]
                 hover:shadow-xl hover:border-[#1CE7D0] hover:-translate-y-1
                 transition-all duration-300 flex flex-col gap-4"
    >
      {badge && (
        <span className="absolute top-4 right-4 text-xs bg-[#FFC857] text-[#0D1B2A] font-bold uppercase px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}

      {/* Icon */}
      <div className="w-14 h-14 rounded-xl bg-[#E5E5E5] group-hover:bg-[#1CE7D0]/10
                      flex items-center justify-center transition-colors duration-300 text-[#1CE7D0]">
        {icon}
      </div>

      {/* Content */}
      <div>
        <h3 className="text-[#0D1B2A] text-lg font-bold mb-1">{title}</h3>
        <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
      </div>

      {/* Hover CTA line */}
      <div className="mt-auto pt-2 border-t border-[#E5E5E5] group-hover:border-[#1CE7D0]/40 transition-colors">
        <Link href={`/courses/${courseId}`} className="text-xs font-semibold text-[#1CE7D0] uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Learn more →
        </Link>
      </div>
    </div>
  );
}
