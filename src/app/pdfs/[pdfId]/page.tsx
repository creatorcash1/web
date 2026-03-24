"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { fetchPDFById } from "@/services/catalog";
import { fetchDashboardData } from "@/services/dashboard";
import { trackEvent } from "@/lib/analytics";
import UserAppShell from "@/components/user/UserAppShell";

export default function PDFDetailPage() {
  const params = useParams<{ pdfId: string }>();
  const search = useSearchParams();

  const pdfId = params.pdfId;
  const wantsDownload = search.get("download") === "1";
  const trackingId = search.get("ref");
  const trackingUser = search.get("userId");

  const { data: pdf, isLoading } = useQuery({
    queryKey: ["pdf", pdfId],
    queryFn: () => fetchPDFById(pdfId),
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
      location: "pdf_detail",
      resourceType: "pdf",
      resourceId: pdfId,
      metadata: { trackingId },
    });
  }, [trackingId, trackingUser, pdfId]);

  if (isLoading) return <UserAppShell><main className="max-w-3xl mx-auto p-8 text-sm text-gray-500">Loading PDF…</main></UserAppShell>;
  if (!pdf) return <UserAppShell><main className="max-w-3xl mx-auto p-8 text-sm text-red-500">PDF not found.</main></UserAppShell>;

  const hasPurchased = dashboard?.pdfs.some((p) => p.id === pdfId) ?? false;

  return (
    <UserAppShell>
      <main className="max-w-3xl mx-auto">
      <div className="max-w-3xl mx-auto bg-white border border-[#E5E5E5] rounded-2xl p-6 md:p-8">
        <h1 className="text-2xl font-black text-[#0D1B2A]">{pdf.title}</h1>
        <p className="text-gray-500 mt-3">{pdf.description}</p>
        <p className="text-xs text-gray-400 mt-2">{pdf.pages} pages</p>

        {wantsDownload && hasPurchased && (
          <div className="mt-4 p-3 rounded-lg bg-emerald-50 text-emerald-700 text-sm">
            Download started securely.
          </div>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={hasPurchased ? `/pdfs/${pdfId}?download=1` : `/checkout/${pdfId}`} className="px-5 py-2.5 rounded-lg bg-[#0D1B2A] text-white text-xs font-bold uppercase">{hasPurchased ? "Download PDF" : "Unlock PDF"}</Link>
          <Link href={`/checkout/${pdfId}`} className="px-5 py-2.5 rounded-lg bg-[#FFC857] text-[#0D1B2A] text-xs font-bold uppercase">Buy Now — ${pdf.price}</Link>
        </div>
      </div>
      </main>
    </UserAppShell>
  );
}
