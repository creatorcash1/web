"use client";

import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { canProceed, userHasAccess } from "@/lib/access";
import { trackEvent } from "@/lib/analytics";
import { createCheckoutSession } from "@/services/payments";
import type { CTAConfig, CTAUserAccessContext } from "@/types/wiring";

interface HandleCTAOptions {
  user: CTAUserAccessContext;
  location: string;
}

function resolveRoute(resourceType: CTAConfig["resourceType"], resourceId?: string): string {
  switch (resourceType) {
    case "course":
      return resourceId ? `/courses/${resourceId}` : "/courses";
    case "pdf":
      return resourceId ? `/pdfs/${resourceId}` : "/pdfs";
    case "mentorship":
      return resourceId ? `/mentorship/${resourceId}` : "/mentorship/mentorship-2hr";
    case "live":
      return resourceId ? `/live/${resourceId}` : "/dashboard/live";
    case "dashboard":
      return resourceId ? `/dashboard/${resourceId}` : "/dashboard";
    case "legal":
      return resourceId ? `/${resourceId}` : "/";
    case "support":
      return "/contact";
    default:
      return "/";
  }
}

export function useCTA(options: HandleCTAOptions) {
  const router = useRouter();
  const queryClient = useQueryClient();

  async function handleCTA(config: CTAConfig): Promise<void> {
    const { user, location } = options;

    await trackEvent({
      event: config.analyticsEvent,
      userId: user.userId,
      location,
      resourceType: config.resourceType,
      resourceId: config.resourceId,
      metadata: config.metadata,
    });

    if (config.requiresAuth) {
      const allowed = canProceed(user);
      if (!allowed.ok) {
        router.push(`/register?redirect=${encodeURIComponent(config.fallbackRoute)}`);
        return;
      }
    }

    if (config.requiresPurchase) {
      const hasAccess = userHasAccess(user, config.resourceType, config.resourceId);
      if (!hasAccess && config.resourceId) {
        router.push(`/checkout/${config.resourceId}`);
        return;
      }
    }

    if (config.actionType === "checkout" && config.resourceId) {
      const session = await createCheckoutSession({
        userId: user.userId,
        productId: config.resourceId,
      });
      router.push(session.checkoutUrl);
      return;
    }

    if (config.actionType === "download" && config.resourceId) {
      const hasAccess = userHasAccess(user, "pdf", config.resourceId);
      if (!hasAccess) {
        router.push(`/checkout/${config.resourceId}`);
        return;
      }
      router.push(`/pdfs/${config.resourceId}?download=1`);
      return;
    }

    const route = resolveRoute(config.resourceType, config.resourceId);
    router.push(route);

    queryClient.invalidateQueries({ queryKey: ["dashboard-data", user.userId] });
    queryClient.invalidateQueries({ queryKey: ["ai-brain-user", "u-001"] });
  }

  return { handleCTA };
}
