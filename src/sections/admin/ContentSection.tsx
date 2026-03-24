"use client";
// ─── Admin Content Section ──────────────────────────────────────────────────
// Manage CMS content blocks — edit headlines, CTAs, and page copy.
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";
import StatusBadge from "@/components/admin/StatusBadge";
import {
  PencilSquareIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import type { ContentBlock } from "@/types/admin";

export default function AdminContentSection({
  contentBlocks,
}: {
  contentBlocks: ContentBlock[];
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editBody, setEditBody] = useState("");

  const startEdit = (block: ContentBlock) => {
    setEditingId(block.id);
    setEditBody(block.body);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditBody("");
  };

  // Group by page
  const grouped = contentBlocks.reduce<Record<string, ContentBlock[]>>((acc, b) => {
    if (!acc[b.page]) acc[b.page] = [];
    acc[b.page].push(b);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white font-(family-name:--font-montserrat)">
          Content Manager
        </h2>
        <p className="text-sm text-white/40 mt-1">
          Edit marketing copy, CTAs, and page content across the site.
        </p>
      </div>

      {contentBlocks.length === 0 && (
        <div className="rounded-xl border border-white/10 bg-[#0D1B2A] p-5">
          <p className="text-sm text-white/70">No content blocks found yet.</p>
          <p className="text-xs text-white/40 mt-1">
            Create rows in the `content_blocks` table to manage site copy here.
          </p>
        </div>
      )}

      {/* Content blocks grouped by page */}
      {Object.entries(grouped).map(([page, blocks]) => (
        <div key={page}>
          <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-3">
            {page} Page
          </h3>
          <div className="space-y-3">
            {blocks.map((block) => {
              const isEditing = editingId === block.id;
              return (
                <div
                  key={block.id}
                  className="bg-[#0D1B2A] rounded-xl border border-white/5 p-5 hover:border-white/10 transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs px-2 py-0.5 rounded bg-white/5 text-white/40">
                          {block.section}
                        </span>
                        <StatusBadge status={block.published ? "published" : "draft"} />
                      </div>
                      <p className="text-sm font-medium text-white/80">{block.title}</p>

                      {isEditing ? (
                        <textarea
                          value={editBody}
                          onChange={(e) => setEditBody(e.target.value)}
                          rows={3}
                          className="mt-2 w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#FFC857]/40 resize-none"
                        />
                      ) : (
                        <p className="text-sm text-white/50 mt-1">{block.body}</p>
                      )}

                      <p className="text-xs text-white/20 mt-2">
                        Updated{" "}
                        {new Date(block.updated_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                      {isEditing ? (
                        <>
                          <button
                            onClick={cancelEdit}
                            className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition-colors"
                          >
                            <XMarkIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="p-2 rounded-lg hover:bg-emerald-500/10 text-emerald-400 transition-colors"
                          >
                            <CheckIcon className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => startEdit(block)}
                          className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-[#FFC857] transition-colors"
                        >
                          <PencilSquareIcon className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
