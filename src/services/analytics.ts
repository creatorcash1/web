import type { AnalyticsPayload } from "@/lib/analytics";

export async function trackEventApi(payload: AnalyticsPayload): Promise<void> {
  await fetch("/api/analytics/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}
