"use client";
// ─── Admin Products Section ─────────────────────────────────────────────────
// Tab-switchable view: Courses | PDFs. Each with table + stats summary.
// ─────────────────────────────────────────────────────────────────────────────

import { useAdminStore } from "@/stores/adminStore";
import AdminTable, { type Column } from "@/components/admin/AdminTable";
import StatusBadge from "@/components/admin/StatusBadge";
import type { AdminCourse, AdminPDF } from "@/types/admin";

interface Props {
  courses: AdminCourse[];
  pdfs: AdminPDF[];
}

export default function AdminProductsSection({ courses, pdfs }: Props) {
  const productTab = useAdminStore((s) => s.productTab);
  const setProductTab = useAdminStore((s) => s.setProductTab);

  const courseColumns: Column<AdminCourse>[] = [
    {
      key: "course",
      header: "Course",
      render: (c) => (
        <div className="flex items-center gap-3">
          <img
            src={c.thumbnail_url}
            alt={c.title}
            className="w-12 h-8 rounded object-cover"
          />
          <div>
            <p className="text-sm font-medium text-white/90">{c.title}</p>
            <p className="text-xs text-white/40">{c.modules.length} modules</p>
          </div>
        </div>
      ),
    },
    {
      key: "price",
      header: "Price",
      width: "w-24",
      render: (c) => <span className="text-[#FFC857] font-medium">${c.price}</span>,
    },
    {
      key: "enrollments",
      header: "Enrolled",
      width: "w-24",
      render: (c) => <span>{c.enrollments}</span>,
    },
    {
      key: "revenue",
      header: "Revenue",
      width: "w-28",
      render: (c) => (
        <span className="text-[#1CE7D0] font-medium">${c.revenue.toLocaleString()}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      width: "w-28",
      render: (c) => <StatusBadge status={c.status} />,
    },
  ];

  const pdfColumns: Column<AdminPDF>[] = [
    {
      key: "pdf",
      header: "PDF Product",
      render: (p) => (
        <div>
          <p className="text-sm font-medium text-white/90">{p.title}</p>
          <p className="text-xs text-white/40 line-clamp-1">{p.description}</p>
        </div>
      ),
    },
    {
      key: "price",
      header: "Price",
      width: "w-24",
      render: (p) => <span className="text-[#FFC857] font-medium">${p.price}</span>,
    },
    {
      key: "downloads",
      header: "Downloads",
      width: "w-28",
      render: (p) => <span>{p.downloads}</span>,
    },
    {
      key: "revenue",
      header: "Revenue",
      width: "w-28",
      render: (p) => (
        <span className="text-[#1CE7D0] font-medium">${p.revenue.toLocaleString()}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      width: "w-24",
      render: (p) => <StatusBadge status={p.status} />,
    },
  ];

  const totalCourseRevenue = courses.reduce((s, c) => s + c.revenue, 0);
  const totalPdfRevenue = pdfs.reduce((s, p) => s + p.revenue, 0);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white font-[family-name:var(--font-montserrat)]">
            Products
          </h2>
          <p className="text-sm text-white/40">
            {courses.length} courses · {pdfs.length} PDFs
          </p>
        </div>

        {/* Tabs */}
        <div className="flex bg-white/5 rounded-lg p-1">
          {(["courses", "pdfs"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setProductTab(tab)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all capitalize ${
                productTab === tab
                  ? "bg-[#FFC857]/10 text-[#FFC857] shadow-sm"
                  : "text-white/40 hover:text-white/60"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#0D1B2A] rounded-lg border border-white/5 p-4">
          <p className="text-xs text-white/40 uppercase">Total Products</p>
          <p className="text-lg font-bold text-white mt-1">{courses.length + pdfs.length}</p>
        </div>
        <div className="bg-[#0D1B2A] rounded-lg border border-white/5 p-4">
          <p className="text-xs text-white/40 uppercase">Total Enrollments</p>
          <p className="text-lg font-bold text-[#1CE7D0] mt-1">
            {courses.reduce((s, c) => s + c.enrollments, 0)}
          </p>
        </div>
        <div className="bg-[#0D1B2A] rounded-lg border border-white/5 p-4">
          <p className="text-xs text-white/40 uppercase">Course Revenue</p>
          <p className="text-lg font-bold text-[#FFC857] mt-1">
            ${totalCourseRevenue.toLocaleString()}
          </p>
        </div>
        <div className="bg-[#0D1B2A] rounded-lg border border-white/5 p-4">
          <p className="text-xs text-white/40 uppercase">PDF Revenue</p>
          <p className="text-lg font-bold text-[#FFC857] mt-1">
            ${totalPdfRevenue.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#0D1B2A] rounded-xl border border-white/5 p-1">
        {productTab === "courses" ? (
          <AdminTable
            columns={courseColumns}
            data={courses}
            keyExtractor={(c) => c.id}
            emptyMessage="No courses yet."
          />
        ) : (
          <AdminTable
            columns={pdfColumns}
            data={pdfs}
            keyExtractor={(p) => p.id}
            emptyMessage="No PDFs yet."
          />
        )}
      </div>
    </div>
  );
}
