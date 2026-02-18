import Link from "next/link";
import { PDF_CATALOG } from "@/services/catalog";

export default function PDFsPage() {
  return (
    <main className="min-h-screen bg-[#F7F8FA] px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-black text-[#0D1B2A] mb-2">PDF Library</h1>
        <p className="text-gray-500 mb-8">Digital products and template packs.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {PDF_CATALOG.map((pdf) => (
            <article key={pdf.pdfId} className="bg-white border border-[#E5E5E5] rounded-2xl p-5 shadow-sm">
              <h2 className="text-lg font-bold text-[#0D1B2A]">{pdf.title}</h2>
              <p className="text-sm text-gray-500 mt-2 min-h-[48px]">{pdf.description}</p>
              <p className="text-xl font-black text-[#FFC857] mt-4">${pdf.price}</p>
              <div className="mt-4 flex gap-2">
                <Link href={`/pdfs/${pdf.pdfId}`} className="px-4 py-2 rounded-lg bg-[#0D1B2A] text-white text-xs font-bold uppercase">Learn More</Link>
                <Link href={`/checkout/${pdf.pdfId}`} className="px-4 py-2 rounded-lg bg-[#FFC857] text-[#0D1B2A] text-xs font-bold uppercase">Buy Now</Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
