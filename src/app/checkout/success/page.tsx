// ─── Checkout Success Page ──────────────────────────────────────────────────
// Shown after successful payment, processes enrollment
// ─────────────────────────────────────────────────────────────────────────────
"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function SuccessContent() {
  const searchParams = useSearchParams();
  const [processing, setProcessing] = useState(true);

  const sessionId = searchParams.get("session_id");
  const productId = searchParams.get("product_id");
  const productType = searchParams.get("product_type");
  const hasInvalidSession = !sessionId;

  useEffect(() => {
    if (!sessionId) return;

    // Give webhook time to process (it runs in background)
    const timer = setTimeout(() => {
      setProcessing(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [sessionId]);

  if (hasInvalidSession) {
    return (
      <div className="min-h-screen bg-linear-to-br from-[#0D1B2A] to-[#1a2f42] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">✗</span>
          </div>
          <h1 className="text-2xl font-bold text-[#0D1B2A] mb-2 font-(family-name:--font-montserrat)">
            Something Went Wrong
          </h1>
          <p className="text-gray-600 mb-6">Invalid session</p>
          <Link
            href="/dashboard"
            className="inline-block bg-[#FFC857] text-[#0D1B2A] font-bold text-sm uppercase tracking-wider rounded-full px-6 py-3 hover:bg-[#f5b732] transition-all"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (processing) {
    return (
      <div className="min-h-screen bg-linear-to-br from-[#0D1B2A] to-[#1a2f42] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="w-16 h-16 border-4 border-[#FFC857] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold text-[#0D1B2A] mb-2 font-(family-name:--font-montserrat)">
            Processing Payment...
          </h1>
          <p className="text-gray-600">
            Please wait while we confirm your purchase and grant access.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-[#0D1B2A] to-[#1a2f42] flex items-center justify-center px-4">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 text-green-600"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M5 13l4 4L19 7"></path>
          </svg>
        </div>

        {/* Success Message */}
        <h1 className="text-3xl font-extrabold text-[#0D1B2A] mb-3 font-(family-name:--font-montserrat)">
          Payment Successful!
        </h1>
        <p className="text-gray-600 mb-8 text-lg">
          🎉 Your purchase has been confirmed. You now have full access to your content!
        </p>

        {/* What's Next */}
        <div className="bg-[#F7F8FA] rounded-xl p-6 mb-8 text-left">
          <h2 className="font-bold text-[#0D1B2A] mb-3 text-lg">What&apos;s Next?</h2>
          <ul className="space-y-2 text-sm text-gray-700">
            {productType === "course" && (
              <>
                <li className="flex items-start gap-2">
                  <span className="text-[#1CE7D0] mt-0.5">✓</span>
                  <span>Access your course modules in the dashboard</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#1CE7D0] mt-0.5">✓</span>
                  <span>Track your progress as you learn</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#1CE7D0] mt-0.5">✓</span>
                  <span>Complete lessons at your own pace</span>
                </li>
              </>
            )}
            {productType === "pdf" && (
              <>
                <li className="flex items-start gap-2">
                  <span className="text-[#1CE7D0] mt-0.5">✓</span>
                  <span>Download your PDF from the dashboard</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#1CE7D0] mt-0.5">✓</span>
                  <span>Access it anytime, anywhere</span>
                </li>
              </>
            )}
            {productType === "mentorship" && (
              <>
                <li className="flex items-start gap-2">
                  <span className="text-[#1CE7D0] mt-0.5">✓</span>
                  <span>Check your email for booking instructions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#1CE7D0] mt-0.5">✓</span>
                  <span>Schedule your 1:1 session with CC Mendel</span>
                </li>
              </>
            )}
            <li className="flex items-start gap-2">
              <span className="text-[#1CE7D0] mt-0.5">✓</span>
              <span>Receipt sent to your email</span>
            </li>
          </ul>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/dashboard"
            className="flex-1 bg-[#FFC857] text-[#0D1B2A] font-bold text-sm uppercase tracking-wider rounded-full py-4 hover:bg-[#f5b732] transition-all shadow-lg hover:shadow-xl text-center"
          >
            Go to Dashboard
          </Link>
          {productType === "course" && (
            <Link
              href={`/courses/${productId}`}
              className="flex-1 bg-[#1CE7D0] text-white font-bold text-sm uppercase tracking-wider rounded-full py-4 hover:bg-[#19d4bd] transition-all text-center"
            >
              Start Learning
            </Link>
          )}
        </div>

        {/* Footer */}
        <p className="mt-6 text-xs text-gray-500">
          Questions? Contact us at support@creatorcashcow.com
        </p>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-linear-to-br from-[#0D1B2A] to-[#1a2f42] flex items-center justify-center px-4">
        <div className="w-16 h-16 border-4 border-[#FFC857] border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
