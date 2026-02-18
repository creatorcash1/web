export interface CheckoutPayload {
  userId: string;
  productId: string;
}

export interface CheckoutResponse {
  checkoutUrl: string;
  sessionId: string;
}

export async function createCheckoutSession(payload: CheckoutPayload): Promise<CheckoutResponse> {
  const response = await fetch("/api/payments/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to create checkout session");
  }

  return response.json();
}

export async function enrollAfterPayment(payload: { userId: string; productId: string }) {
  const response = await fetch("/api/enroll", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Enrollment failed");
  }

  return response.json();
}
