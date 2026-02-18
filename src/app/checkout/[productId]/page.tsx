"use client";

import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { enrollAfterPayment } from "@/services/payments";

export default function CheckoutPage() {
  const params = useParams<{ productId: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  const productId = params.productId;
  const sessionId = searchParams.get("sessionId");
  const userId = searchParams.get("userId") ?? "usr_001";

  async function handleSuccess() {
    setLoading(true);
    await enrollAfterPayment({ userId, productId });
    setLoading(false);
    router.push("/dashboard");
  }

  return (
    <main className="min-h-screen bg-[#F7F8FA] px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-2xl mx-auto bg-white border border-[#E5E5E5] rounded-2xl p-6 md:p-8">
        <h1 className="text-2xl font-black text-[#0D1B2A]">Checkout</h1>
        <p className="text-gray-500 mt-2">Product: {productId}</p>
        {sessionId && <p className="text-xs text-[#1CE7D0] mt-1">Session: {sessionId}</p>}

        <div className="mt-8 flex flex-wrap gap-3">
          <button onClick={handleSuccess} disabled={loading} className="px-5 py-2.5 rounded-lg bg-[#FFC857] text-[#0D1B2A] text-xs font-bold uppercase disabled:opacity-50">
            {loading ? "Processing…" : "Simulate Payment Success"}
          </button>
          <Link href={`/courses/${productId}`} className="px-5 py-2.5 rounded-lg bg-[#0D1B2A] text-white text-xs font-bold uppercase">
            Cancel & Return
          </Link>
        </div>
      </div>
    </main>
  );
}
