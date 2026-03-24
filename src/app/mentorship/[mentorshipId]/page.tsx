"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { fetchMentorshipById } from "@/services/catalog";
import { fetchDashboardData } from "@/services/dashboard";
import { trackEvent } from "@/lib/analytics";
import UserAppShell from "@/components/user/UserAppShell";

export default function MentorshipDetailPage() {
  const params = useParams<{ mentorshipId: string }>();
  const search = useSearchParams();
  const mentorshipId = params.mentorshipId;
  const trackingId = search.get("ref");
  const trackingUser = search.get("userId");

  const { data: mentorship, isLoading } = useQuery({
    queryKey: ["mentorship", mentorshipId],
    queryFn: () => fetchMentorshipById(mentorshipId),
    staleTime: 5 * 60 * 1000,
  });

  const { data: dashboard } = useQuery({
    queryKey: ["dashboard-data", "usr_001"],
    queryFn: () => fetchDashboardData(),
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (!trackingId) return;
    trackEvent({
      event: "email_link_clicked",
      userId: trackingUser ?? undefined,
      location: "mentorship_detail",
      resourceType: "mentorship",
      resourceId: mentorshipId,
      metadata: { trackingId },
    });
  }, [trackingId, trackingUser, mentorshipId]);

  if (isLoading) return <UserAppShell><main className="max-w-3xl mx-auto p-8 text-sm text-gray-500">Loading mentorship…</main></UserAppShell>;
  if (!mentorship) return <UserAppShell><main className="max-w-3xl mx-auto p-8 text-sm text-red-500">Mentorship not found.</main></UserAppShell>;

  const alreadyBooked = (dashboard?.bookings.length ?? 0) > 0;

  return (
    <UserAppShell>
      <main className="max-w-3xl mx-auto">
      <div className="max-w-3xl mx-auto bg-white border border-[#E5E5E5] rounded-2xl p-6 md:p-8">
        <h1 className="text-2xl font-black text-[#0D1B2A]">{mentorship.title}</h1>
        <p className="text-gray-500 mt-3">{mentorship.description}</p>
        <p className="text-sm mt-2 text-[#0D1B2A]">Duration: {mentorship.durationMinutes} minutes</p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={alreadyBooked ? "/dashboard/mentorship" : `/checkout/${mentorship.mentorshipId}`} className="px-5 py-2.5 rounded-lg bg-[#FFC857] text-[#0D1B2A] text-xs font-bold uppercase">{alreadyBooked ? "Manage Booking" : `Book Now — $${mentorship.price}`}</Link>
        </div>
      </div>
      </main>
    </UserAppShell>
  );
}
