// ─── Stripe Checkout API Route ──────────────────────────────────────────────
// Creates Stripe payment session for course/PDF/mentorship purchase
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getServerUser } from "@/lib/auth";
import {
  fetchCourse,
  fetchPDF,
  fetchMentorshipProduct,
} from "@/lib/database";

function getStripeClient() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return null;
  }
  return new Stripe(secretKey, {
    apiVersion: "2026-01-28.clover",
  });
}

interface Body {
  productId: string;
  productType: "course" | "pdf" | "mentorship" | "bundle";
}

export async function POST(request: Request) {
  try {
    const stripe = getStripeClient();
    if (!stripe) {
      return NextResponse.json(
        { error: "Stripe is not configured. Missing STRIPE_SECRET_KEY." },
        { status: 500 }
      );
    }

    // Verify authentication
    const user = await getServerUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as Body;

    if (!body.productId || !body.productType) {
      return NextResponse.json(
        { error: "productId and productType are required" },
        { status: 400 }
      );
    }

    // Fetch product details
    let productName = "";
    let productPrice = 0;
    let productDescription = "";

    if (body.productType === "course") {
      const course = await fetchCourse(body.productId);
      productName = course.title;
      productPrice = parseFloat(course.price);
      productDescription = course.description;
    } else if (body.productType === "pdf") {
      const pdf = await fetchPDF(body.productId);
      productName = pdf.title;
      productPrice = parseFloat(pdf.price);
      productDescription = pdf.description;
    } else if (body.productType === "mentorship") {
      const mentorship = await fetchMentorshipProduct(body.productId);
      productName = mentorship.title;
      productPrice = parseFloat(mentorship.price);
      productDescription = mentorship.description;
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: productName,
              description: productDescription,
            },
            unit_amount: Math.round(productPrice * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}&product_id=${body.productId}&product_type=${body.productType}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/${body.productId}?cancelled=true`,
      client_reference_id: user.id,
      metadata: {
        userId: user.id,
        productId: body.productId,
        productType: body.productType,
      },
    });

    return NextResponse.json({
      sessionId: session.id,
      checkoutUrl: session.url,
    });
  } catch (error: any) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
