import { NextResponse } from "next/server";
import { COURSE_CATALOG } from "@/services/catalog";

export async function GET(_: Request, { params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  const course = COURSE_CATALOG.find((c) => c.courseId === courseId);
  if (!course) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  }
  return NextResponse.json(course);
}
