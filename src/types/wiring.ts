export type CTAActionType =
  | "navigate"
  | "checkout"
  | "download"
  | "book"
  | "join"
  | "api";

export type CTAResourceType =
  | "course"
  | "pdf"
  | "mentorship"
  | "live"
  | "dashboard"
  | "legal"
  | "support"
  | "unknown";

export interface CTAConfig {
  actionType: CTAActionType;
  resourceType: CTAResourceType;
  resourceId?: string;
  requiresAuth: boolean;
  requiresPurchase: boolean;
  analyticsEvent: string;
  fallbackRoute: string;
  metadata?: Record<string, string | number | boolean | undefined>;
}

export interface CTAUserAccessContext {
  userId: string;
  isAuthenticated: boolean;
  role: "user" | "admin";
  isSuspended?: boolean;
  enrolledCourseIds: string[];
  purchasedPdfIds: string[];
  mentorshipProductIds: string[];
}
