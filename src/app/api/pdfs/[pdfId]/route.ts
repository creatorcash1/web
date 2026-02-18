import { NextResponse } from "next/server";
import { PDF_CATALOG } from "@/services/catalog";

export async function GET(_: Request, { params }: { params: Promise<{ pdfId: string }> }) {
  const { pdfId } = await params;
  const pdf = PDF_CATALOG.find((p) => p.pdfId === pdfId);
  if (!pdf) {
    return NextResponse.json({ error: "PDF not found" }, { status: 404 });
  }
  return NextResponse.json(pdf);
}
