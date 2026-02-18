import type { CTAResourceType, CTAUserAccessContext } from "@/types/wiring";

export function userHasAccess(
  ctx: CTAUserAccessContext,
  resourceType: CTAResourceType,
  resourceId?: string
): boolean {
  if (!resourceId) return true;

  if (resourceType === "course") {
    return ctx.enrolledCourseIds.includes(resourceId);
  }

  if (resourceType === "pdf") {
    return ctx.purchasedPdfIds.includes(resourceId);
  }

  if (resourceType === "mentorship") {
    return ctx.mentorshipProductIds.includes(resourceId);
  }

  return true;
}

export function canProceed(ctx: CTAUserAccessContext): { ok: boolean; reason?: string } {
  if (!ctx.isAuthenticated) {
    return { ok: false, reason: "unauthenticated" };
  }
  if (ctx.isSuspended) {
    return { ok: false, reason: "suspended" };
  }
  return { ok: true };
}
