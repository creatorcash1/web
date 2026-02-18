import { NextResponse } from "next/server";
import { MENTORSHIP_CATALOG } from "@/services/catalog";

export async function GET(_: Request, { params }: { params: Promise<{ mentorshipId: string }> }) {
  const { mentorshipId } = await params;
  const mentorship = MENTORSHIP_CATALOG.find((m) => m.mentorshipId === mentorshipId);
  if (!mentorship) {
    return NextResponse.json({ error: "Mentorship product not found" }, { status: 404 });
  }
  return NextResponse.json(mentorship);
}
