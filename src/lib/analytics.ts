import { trackEventApi } from "@/services/analytics";

export interface AnalyticsPayload {
  event: string;
  userId?: string;
  location?: string;
  resourceType?: string;
  resourceId?: string;
  metadata?: Record<string, string | number | boolean | undefined>;
}

export async function trackEvent(payload: AnalyticsPayload): Promise<void> {
  if (typeof window !== "undefined") {
    const queueName = "__creatorcash_events__";
    const existing = (window as unknown as Record<string, unknown[]>)[queueName] ?? [];
    existing.push({ ...payload, timestamp: new Date().toISOString() });
    (window as unknown as Record<string, unknown[]>)[queueName] = existing;
  }

  try {
    await trackEventApi(payload);
  } catch {
    // non-blocking analytics failure
  }
}
