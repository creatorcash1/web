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
  const [promoCode, setPromoCode] = useState("");
  const [promoMessage, setPromoMessage] = useState<string | null>(null);

  const productId = params.productId;
  const sessionId = searchParams.get("sessionId");
  const userId = searchParams.get("userId") ?? "usr_001";

  async function handleSuccess() {
    setLoading(true);
    await enrollAfterPayment({ userId, productId });
    setLoading(false);
    router.push("/dashboard");
  }

  async function handlePromoRedeem() {
    setPromoMessage(null);
    setLoading(true);
    try {
      const res = await fetch("/api/promo/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ promoCode, productId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPromoMessage(data.error || "Invalid code");
      } else {
        setPromoMessage("Success! You now have full access.");
        router.push(`/courses/${productId}/lessons`);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F7F8FA] px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-2xl mx-auto bg-white border border-[#E5E5E5] rounded-2xl p-6 md:p-8">
        <h1 className="text-2xl font-black text-[#0D1B2A]">Checkout</h1>
        <p className="text-gray-500 mt-2">Product: {productId}</p>
        {sessionId && <p className="text-xs text-[#1CE7D0] mt-1">Session: {sessionId}</p>}

        <div className="mt-8 flex flex-wrap gap-3">
          <button onClick={handleSuccess} disabled={loading} className="px-5 py-2.5 rounded-lg bg-[#FFC857] text-[#0D1B2A] text-xs font-bold uppercase disabled:opacity-50">
            {loading ? "Processing…" : "Checkout with Stripe"}
          </button>
          <Link href={`/courses/${productId}`} className="px-5 py-2.5 rounded-lg bg-[#0D1B2A] text-white text-xs font-bold uppercase">
            Cancel & Return
          </Link>
        </div>

        <div className="mt-10 border border-dashed border-[#1CE7D0]/50 rounded-2xl p-5">
          <p className="text-sm font-semibold text-[#0D1B2A]">Have a promo code?</p>
          <p className="text-xs text-gray-500 mb-3">Enter it to unlock 100% free access without a card.</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              placeholder="Enter promo code"
              className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm"
            />
            <button
              type="button"
              onClick={handlePromoRedeem}
              disabled={loading || !promoCode}
              className="px-5 py-2.5 rounded-lg bg-[#1CE7D0] text-[#0D1B2A] text-xs font-bold uppercase disabled:opacity-50"
            >
              Redeem
            </button>
          </div>
          {promoMessage && <p className="mt-2 text-sm text-[#0D1B2A]">{promoMessage}</p>}
        </div>
      </div>
    </main>
  );
}
