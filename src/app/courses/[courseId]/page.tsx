"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { fetchCourseById } from "@/services/catalog";
import { trackEvent } from "@/lib/analytics";
import type { DashboardData, EnrolledCourse } from "@/types/dashboard";
import UserAppShell from "@/components/user/UserAppShell";

export default function CourseDetailPage() {
  const params = useParams<{ courseId: string }>();
  const search = useSearchParams();
  const trackingId = search.get("ref");
  const trackingUser = search.get("userId");
  const joined = search.get("joined") === "1";
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestSubmitting, setRequestSubmitting] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [showEnrollSuccess, setShowEnrollSuccess] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    email: "",
    phone: "",
    desiredPassword: "",
  });

  const courseId = params.courseId;

  const { data: course, isLoading } = useQuery({
    queryKey: ["course", courseId],
    queryFn: () => fetchCourseById(courseId),
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    async function loadDashboard() {
      try {
        const res = await fetch("/api/dashboard");
        if (res.ok) {
          const data = (await res.json()) as DashboardData;
          setDashboard(data);
        }
      } catch (err) {
        console.error("dashboard load error", err);
      }
    }
    loadDashboard();
  }, []);

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

  const enrolledCourse: EnrolledCourse | undefined = dashboard?.courses?.find((courseItem) => courseItem.id === courseId);
  const isPromoEnrollment = enrolledCourse?.access_source === "promo";
  const enrolled = Boolean(enrolledCourse) || joined;
  const isFreeCourse = Number(course?.price ?? 0) <= 0;

  async function handleEnrollNow() {
    if (enrolling || enrolled) return;

    if (!isFreeCourse) {
      window.location.href = `/checkout/${courseId}`;
      return;
    }

    setEnrolling(true);
    try {
      const res = await fetch("/api/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: courseId, accessSource: "promo" }),
      });

      if (res.status === 401) {
        window.location.href = `/login?redirect=/courses/${courseId}`;
        return;
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: "Failed to enroll" }));
        throw new Error(data.error || "Failed to enroll");
      }

      setShowEnrollSuccess(true);
      const refreshed = await fetch("/api/dashboard");
      if (refreshed.ok) {
        const data = (await refreshed.json()) as DashboardData;
        setDashboard(data);
      }
    } catch (error: any) {
      alert(error?.message || "Could not enroll right now.");
    } finally {
      setEnrolling(false);
    }
  }

  if (isLoading) {
    return (
      <UserAppShell>
        <main className="max-w-5xl mx-auto p-8 text-sm text-gray-500">Loading course…</main>
      </UserAppShell>
    );
  }

  if (!course) {
    return (
      <UserAppShell>
        <main className="max-w-5xl mx-auto p-8 text-sm text-red-500">Course not found.</main>
      </UserAppShell>
    );
  }

  return (
    <UserAppShell>
      <main className="max-w-5xl mx-auto">
      <div className="max-w-5xl mx-auto bg-white border border-[#E5E5E5] rounded-2xl p-6 md:p-8">
        <h1 className="text-3xl font-black text-[#0D1B2A]">{course.title}</h1>
        <p className="text-gray-500 mt-3">{course.description}</p>
        {trackingId && <p className="text-xs text-[#1CE7D0] mt-2">Tracked referral: {trackingId}</p>}
        {joined && (
          <div className="mt-4 rounded-xl border border-[#1CE7D0]/40 bg-[#1CE7D0]/10 p-4">
            <p className="text-sm font-bold text-[#0D1B2A]">🎉 Congratulations! You joined successfully.</p>
            <p className="text-xs text-gray-600 mt-1">Tap Start Course below to continue.</p>
          </div>
        )}

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {course.lessons.map((lesson) => (
            <div key={lesson.id} className="border border-[#E5E5E5] rounded-xl p-4">
              <p className="text-sm font-semibold text-[#0D1B2A]">{lesson.title}</p>
              <p className="text-xs text-gray-500 mt-1">{lesson.durationMinutes} min</p>
            </div>
          ))}
        </div>

        {!showEnrollSuccess && (
          <div className="mt-8 flex flex-wrap gap-3">
            {enrolled ? (
              <Link href={`/courses/${courseId}/lessons`} className="px-5 py-2.5 rounded-lg bg-[#0D1B2A] text-white text-xs font-bold uppercase">Start Learning</Link>
            ) : (
              <button
                type="button"
                onClick={handleEnrollNow}
                disabled={enrolling}
                className="px-5 py-2.5 rounded-lg bg-[#FFC857] text-[#0D1B2A] text-xs font-bold uppercase disabled:opacity-60"
              >
                {enrolling ? "Enrolling..." : isFreeCourse ? "Enroll Now — Free" : `Enroll Now — $${course.price}`}
              </button>
            )}
          </div>
        )}

        {showEnrollSuccess && (
          <div className="mt-8 rounded-2xl border border-emerald-300/60 bg-emerald-50 p-6 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
              {Array.from({ length: 24 }).map((_, index) => (
                <span
                  key={index}
                  className="absolute text-lg animate-bounce"
                  style={{
                    left: `${(index * 17) % 100}%`,
                    top: `${(index * 29) % 70}%`,
                    animationDelay: `${(index % 8) * 0.1}s`,
                  }}
                >
                  {index % 3 === 0 ? "🎉" : index % 3 === 1 ? "✨" : "🎊"}
                </span>
              ))}
            </div>
            <p className="relative text-lg font-black text-[#0D1B2A]">Congratulations! You have enrolled successfully.</p>
            <p className="relative text-sm text-[#0D1B2A]/70 mt-1">Your course is unlocked. Start learning now.</p>
            <Link
              href={`/courses/${courseId}/lessons`}
              className="relative mt-4 inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-[#0D1B2A] text-white text-xs font-bold uppercase"
            >
              Start Learning
            </Link>
          </div>
        )}

        {enrolled && isPromoEnrollment && (
          <div className="mt-10 border border-[#1CE7D0]/30 bg-[#1CE7D0]/5 rounded-2xl p-6">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎯</span>
              <div>
                <p className="text-sm uppercase text-[#1CE7D0] font-bold">Promo Bonus</p>
                <h3 className="text-xl font-headline text-[#0D1B2A]">Request your UK TikTok account</h3>
                <p className="text-gray-600 text-sm">Only promo students can see this. Fill the form to get your account created.</p>
              </div>
            </div>

            {!showRequestForm && !requestSuccess && (
              <button
                onClick={() => setShowRequestForm(true)}
                className="mt-4 inline-flex items-center gap-2 px-5 py-3 bg-[#0D1B2A] text-white rounded-xl text-sm font-semibold"
              >
                Request UK TikTok Account
              </button>
            )}

            {showRequestForm && !requestSuccess && (
              <form
                className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4"
                onSubmit={async (e) => {
                  e.preventDefault();
                  setRequestSubmitting(true);
                  try {
                    const res = await fetch("/api/tiktok/requests", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        courseId,
                        fullName: `${formData.firstName} ${formData.lastName}`.trim(),
                        firstName: formData.firstName,
                        lastName: formData.lastName,
                        dateOfBirth: formData.dateOfBirth,
                        email: formData.email,
                        phone: formData.phone,
                        desiredPassword: formData.desiredPassword,
                      }),
                    });
                    if (res.ok) {
                      setRequestSuccess(true);
                    } else {
                      const data = await res.json();
                      alert(data.error || "Failed to submit request");
                    }
                  } finally {
                    setRequestSubmitting(false);
                  }
                }}
              >
                <input required className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" placeholder="First name" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />
                <input required className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" placeholder="Last name" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
                <input required className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" type="date" placeholder="Date of Birth" value={formData.dateOfBirth} onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })} />
                <input required className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" placeholder="Email (must be new to TikTok)" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                <input required className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" placeholder="Phone number" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                <input required className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" placeholder="Desired password" value={formData.desiredPassword} onChange={(e) => setFormData({ ...formData, desiredPassword: e.target.value })} />
                <p className="text-xs text-[#0D1B2A]/70 md:col-span-2">Warning: Use an email that has never been used to open a TikTok account.</p>
                <button
                  type="submit"
                  disabled={requestSubmitting}
                  className="md:col-span-2 inline-flex justify-center px-5 py-3 bg-[#FFC857] text-[#0D1B2A] rounded-xl text-sm font-semibold disabled:opacity-60"
                >
                  {requestSubmitting ? "Submitting..." : "Submit request"}
                </button>
              </form>
            )}

            {requestSuccess && (
              <div className="mt-4 rounded-xl border border-[#1CE7D0]/40 bg-white p-4">
                <p className="text-lg">🎉 Congratulations! Your TikTok account request is on the way.</p>
                <p className="text-sm text-gray-600">We will email you once it is created.</p>
              </div>
            )}
          </div>
        )}
      </div>
      </main>
    </UserAppShell>
  );
}
