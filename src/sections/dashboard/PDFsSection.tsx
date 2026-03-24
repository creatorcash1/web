// ─── PDFsSection ─────────────────────────────────────────────────────────────
// Grid of owned PDFs / digital products with download CTA.
// ─────────────────────────────────────────────────────────────────────────────
import { DocumentTextIcon } from "@heroicons/react/24/outline";
import PDFCard from "@/components/dashboard/PDFCard";
import EmptyState from "@/components/dashboard/EmptyState";
import type { OwnedPDF } from "@/types/dashboard";

interface Props {
  pdfs: OwnedPDF[];
}

export default function PDFsSection({ pdfs }: Props) {
  if (pdfs.length === 0) {
    return (
      <EmptyState
        icon={<DocumentTextIcon className="w-8 h-8" />}
        title="No digital products yet"
        description="Supercharge your learning with premium PDF guides, templates, and cheat sheets."
        ctaLabel="Browse PDFs"
        ctaHref="/dashboard/pdfs"
      />
    );
  }

  return (
    <div>
      <h2 className="font-bold text-[#0D1B2A] text-xl mb-5">My PDFs & Digital Products</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-5">
        {pdfs.map((p) => (
          <PDFCard key={p.id} pdf={p} />
        ))}
      </div>
    </div>
  );
}
