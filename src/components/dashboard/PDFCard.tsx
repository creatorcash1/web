// ─── PDFCard ─────────────────────────────────────────────────────────────────
// Owned PDF: cover image, title, purchase date, download CTA.
// ─────────────────────────────────────────────────────────────────────────────
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import type { OwnedPDF } from "@/types/dashboard";

interface Props {
  pdf: OwnedPDF;
}

export default function PDFCard({ pdf }: Props) {
  const date = new Date(pdf.purchased_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div
      className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden shadow-sm
                 hover:shadow-xl hover:border-[#1CE7D0]/40 hover:-translate-y-0.5
                 transition-all duration-300 flex flex-col"
    >
      {/* Cover */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#E5E5E5]">
        <img
          src={pdf.cover_url}
          alt={`${pdf.title} cover`}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5 gap-2">
        <h3 className="text-sm font-bold text-[#0D1B2A] leading-tight">
          {pdf.title}
        </h3>
        <p className="text-xs text-gray-400">Purchased {date}</p>

        <a
          href={`/pdfs/${pdf.id}?download=1`}
          className="mt-auto inline-flex items-center justify-center gap-2 bg-[#0D1B2A] text-white text-xs
                     font-bold uppercase tracking-wider rounded-full px-4 py-2.5
                     hover:bg-[#1CE7D0] hover:text-[#0D1B2A] transition-all duration-200"
          aria-label={`Download ${pdf.title}`}
        >
          <ArrowDownTrayIcon className="w-4 h-4" aria-hidden="true" />
          Download
        </a>
      </div>
    </div>
  );
}
