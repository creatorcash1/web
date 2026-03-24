export const FREE_COURSE_ID = "crs_001";
export const FREE_COURSE_BASE_PRICE = 57.99;
export const FREE_COURSE_OFFER_END_AT = "2026-04-08T23:59:59.000Z";

export function isFreeCourseOfferActive(now: Date = new Date()): boolean {
  return now.getTime() <= new Date(FREE_COURSE_OFFER_END_AT).getTime();
}

export function getCoursePrice(courseId: string): number {
  if (courseId === FREE_COURSE_ID && isFreeCourseOfferActive()) {
    return 0;
  }
  return FREE_COURSE_BASE_PRICE;
}
