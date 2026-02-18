"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { fetchCourseById } from "@/services/catalog";
import { fetchDashboardData } from "@/services/dashboard";
import { trackEvent } from "@/lib/analytics";

export default function CourseDetailPage() {
  const params = useParams<{ courseId: string }>();
  const search = useSearchParams();
  const trackingId = search.get("ref");
  const trackingUser = search.get("userId");

  const courseId = params.courseId;

  const { data: course, isLoading } = useQuery({
    queryKey: ["course", courseId],
    queryFn: () => fetchCourseById(courseId),
    staleTime: 5 * 60 * 1000,
  });

  const { data: dashboard } = useQuery({
    queryKey: ["dashboard-data", "usr_001"],
    queryFn: () => fetchDashboardData("usr_001"),
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return <main className="p-8 text-sm text-gray-500">Loading course…</main>;
  }

  if (!course) {
    return <main className="p-8 text-sm text-red-500">Course not found.</main>;
  }

  const enrolled = dashboard?.courses.some((c) => c.id === courseId) ?? false;

  useEffect(() => {
    if (!trackingId) return;
    trackEvent({
      event: "email_link_clicked",
      userId: trackingUser ?? undefined,
      location: "course_detail",
      resourceType: "course",
      resourceId: courseId,
      metadata: { trackingId },
    });
  }, [trackingId, trackingUser, courseId]);

  return (
    <main className="min-h-screen bg-[#F7F8FA] px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-5xl mx-auto bg-white border border-[#E5E5E5] rounded-2xl p-6 md:p-8">
        <h1 className="text-3xl font-black text-[#0D1B2A]">{course.title}</h1>
        <p className="text-gray-500 mt-3">{course.description}</p>
        {trackingId && <p className="text-xs text-[#1CE7D0] mt-2">Tracked referral: {trackingId}</p>}

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {course.lessons.map((lesson) => (
            <div key={lesson.id} className="border border-[#E5E5E5] rounded-xl p-4">
              <p className="text-sm font-semibold text-[#0D1B2A]">{lesson.title}</p>
              <p className="text-xs text-gray-500 mt-1">{lesson.durationMinutes} min</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={`/checkout/${courseId}`} className="px-5 py-2.5 rounded-lg bg-[#FFC857] text-[#0D1B2A] text-xs font-bold uppercase">Buy Now — ${course.price}</Link>
          <Link href={enrolled ? `/courses/${courseId}/lessons` : `/checkout/${courseId}`} className="px-5 py-2.5 rounded-lg bg-[#0D1B2A] text-white text-xs font-bold uppercase">{enrolled ? "Start Course" : "Unlock Course"}</Link>
        </div>
      </div>
    </main>
  );
}
