// ─── Stripe Webhook Handler ─────────────────────────────────────────────────
// Processes successful payments and grants access to purchased content
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from "next/server";
import Stripe from "stripe";
import {
  enrollUserInCourse,
  grantPDFAccess,
  createMentorshipBooking,
  recordPayment,
} from "@/lib/database";

function getStripeDeps() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!secretKey || !webhookSecret) {
    return null;
  }

  return {
    stripe: new Stripe(secretKey, {
      apiVersion: "2026-01-28.clover",
    }),
    webhookSecret,
  };
}

export async function POST(request: Request) {
  try {
    const deps = getStripeDeps();
    if (!deps) {
      return NextResponse.json(
        { error: "Stripe webhook is not configured. Missing STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET." },
        { status: 500 }
      );
    }

    const { stripe, webhookSecret } = deps;

    const body = await request.text();
    const signature = request.headers.get("stripe-signature")!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error("Webhook signature verification failed:", err.message);
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      );
    }

    // Handle the event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      
      const userId = session.metadata?.userId;
      const productId = session.metadata?.productId;
      const productType = session.metadata?.productType;

      if (!userId || !productId || !productType) {
        console.error("Missing metadata in checkout session");
        return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
      }

      // Record the payment
      const payment_intent = session.payment_intent as string;
      await recordPayment(
        userId,
        session.amount_total! / 100, // Convert from cents
        session.currency!,
        productType,
        productId,
        payment_intent
      );

      // Grant access based on product type
      if (productType === "course") {
        await enrollUserInCourse(userId, productId);
        console.log(`User ${userId} enrolled in course ${productId}`);
      } else if (productType === "pdf") {
        await grantPDFAccess(userId, productId);
        console.log(`User ${userId} granted access to PDF ${productId}`);
      } else if (productType === "mentorship") {
        // For mentorship, we'll create a pending booking
        // User will schedule the actual time later
        await createMentorshipBooking(
          userId,
          productId,
          new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Default to 7 days from now
          120 // Default 2 hours
        );
        console.log(`User ${userId} booked mentorship ${productId}`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: error.message || "Webhook processing failed" },
      { status: 500 }
    );
  }
}

// Note: In Next.js App Router, we read the raw body directly
// No need for bodyParser config
