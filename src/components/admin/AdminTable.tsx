// ─── Admin Table ────────────────────────────────────────────────────────────
// Generic sortable table with header, rows, and empty state. Accepts typed
// column definitions and data array. Deep navy styling.
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";

export interface Column<T> {
  key: string;
  header: string;
  /** Width class like "w-48" */
  width?: string;
  render: (item: T) => React.ReactNode;
}

interface AdminTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  emptyMessage?: string;
}

export default function AdminTable<T>({
  columns,
  data,
  keyExtractor,
  emptyMessage = "No data found.",
}: AdminTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center py-16 text-white/30 text-sm">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-160">
        <thead>
          <tr className="border-b border-white/10">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`text-left text-xs font-medium text-white/40 uppercase tracking-wider py-3 px-4 ${col.width ?? ""}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr
              key={keyExtractor(item)}
              className="border-b border-white/5 hover:bg-white/2 transition-colors"
            >
              {columns.map((col) => (
                <td key={col.key} className={`py-3 px-4 text-sm text-white/70 ${col.width ?? ""}`}>
                  {col.render(item)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
