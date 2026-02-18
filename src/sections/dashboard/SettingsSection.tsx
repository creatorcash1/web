// ─── SettingsSection ─────────────────────────────────────────────────────────
// Placeholder settings page: profile info, email, password change.
// ─────────────────────────────────────────────────────────────────────────────
"use client";

import type { User } from "@/types/dashboard";

interface Props {
  user: User;
}

export default function SettingsSection({ user }: Props) {
  return (
    <div className="max-w-2xl">
      <h2 className="font-bold text-[#0D1B2A] text-xl mb-5">Settings</h2>

      <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 shadow-sm flex flex-col gap-6">
        {/* Avatar + name */}
        <div className="flex items-center gap-5">
          <img
            src={user.avatar_url}
            alt={`${user.full_name}'s avatar`}
            className="w-20 h-20 rounded-full border-2 border-[#FFC857] object-cover"
          />
          <div>
            <h3 className="text-lg font-bold text-[#0D1B2A]">{user.full_name}</h3>
            <p className="text-sm text-gray-500">{user.email}</p>
            <span className="inline-block mt-1 text-xs font-bold uppercase tracking-wider bg-[#FFC857]/15 text-[#FFC857] border border-[#FFC857]/30 rounded-full px-3 py-0.5">
              Pro Member
            </span>
          </div>
        </div>

        <hr className="border-[#E5E5E5]" />

        {/* Profile fields (placeholder) */}
        <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-5">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Full Name</span>
            <input
              type="text"
              defaultValue={user.full_name}
              className="border border-[#E5E5E5] rounded-xl px-4 py-3 text-sm text-[#0D1B2A]
                         focus:outline-none focus:border-[#1CE7D0] transition-colors"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email Address</span>
            <input
              type="email"
              defaultValue={user.email}
              className="border border-[#E5E5E5] rounded-xl px-4 py-3 text-sm text-[#0D1B2A]
                         focus:outline-none focus:border-[#1CE7D0] transition-colors"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">New Password</span>
            <input
              type="password"
              placeholder="Leave blank to keep current"
              className="border border-[#E5E5E5] rounded-xl px-4 py-3 text-sm text-[#0D1B2A] placeholder:text-gray-300
                         focus:outline-none focus:border-[#1CE7D0] transition-colors"
            />
          </label>

          <button
            type="submit"
            className="self-start bg-[#FFC857] text-[#0D1B2A] text-sm font-bold uppercase tracking-wider
                       rounded-full px-6 py-3 hover:bg-[#f5b732] hover:scale-[1.03] transition-all duration-200 shadow-sm"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
