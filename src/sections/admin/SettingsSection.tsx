"use client";
// ─── Admin Settings Section ─────────────────────────────────────────────────
// System configuration form: site settings, payment mode, toggles.
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";
import type { SystemSettings } from "@/types/admin";

export default function AdminSettingsSection({
  settings,
}: {
  settings: SystemSettings;
}) {
  const [form, setForm] = useState<SystemSettings>(settings);
  const [saved, setSaved] = useState(false);

  const update = <K extends keyof SystemSettings>(key: K, value: SystemSettings[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    // Mock save
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white font-[family-name:var(--font-montserrat)]">
          System Settings
        </h2>
        <p className="text-sm text-white/40 mt-1">
          Configure global site settings, payment modes, and feature toggles.
        </p>
      </div>

      {/* General */}
      <section className="bg-[#0D1B2A] rounded-xl border border-white/5 p-6 space-y-5">
        <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider">
          General
        </h3>

        <div className="space-y-4">
          {/* Site name */}
          <div>
            <label className="block text-sm text-white/50 mb-1.5">Site Name</label>
            <input
              type="text"
              value={form.site_name}
              onChange={(e) => update("site_name", e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FFC857]/40 transition-colors"
            />
          </div>

          {/* Tagline */}
          <div>
            <label className="block text-sm text-white/50 mb-1.5">Tagline</label>
            <input
              type="text"
              value={form.tagline}
              onChange={(e) => update("tagline", e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FFC857]/40 transition-colors"
            />
          </div>

          {/* Support email */}
          <div>
            <label className="block text-sm text-white/50 mb-1.5">Support Email</label>
            <input
              type="email"
              value={form.support_email}
              onChange={(e) => update("support_email", e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FFC857]/40 transition-colors"
            />
          </div>

          {/* Default currency */}
          <div>
            <label className="block text-sm text-white/50 mb-1.5">Default Currency</label>
            <select
              value={form.default_currency}
              onChange={(e) => update("default_currency", e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FFC857]/40 transition-colors"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
          </div>
        </div>
      </section>

      {/* Payments */}
      <section className="bg-[#0D1B2A] rounded-xl border border-white/5 p-6 space-y-5">
        <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider">
          Payments
        </h3>

        <div className="space-y-4">
          {/* Stripe mode */}
          <div>
            <label className="block text-sm text-white/50 mb-1.5">Stripe Mode</label>
            <div className="flex gap-2">
              {(["test", "live"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => update("stripe_mode", mode)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg capitalize transition-all ${
                    form.stripe_mode === mode
                      ? mode === "live"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      : "bg-white/5 text-white/40 border border-transparent hover:bg-white/10"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Mentorship price */}
          <div>
            <label className="block text-sm text-white/50 mb-1.5">Mentorship Price ($)</label>
            <input
              type="number"
              value={form.mentorship_price}
              onChange={(e) => update("mentorship_price", Number(e.target.value))}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FFC857]/40 transition-colors"
            />
          </div>
        </div>
      </section>

      {/* Feature Toggles */}
      <section className="bg-[#0D1B2A] rounded-xl border border-white/5 p-6 space-y-5">
        <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider">
          Feature Toggles
        </h3>

        <div className="space-y-4">
          {[
            { key: "maintenance_mode" as const, label: "Maintenance Mode", desc: "Show maintenance page to all visitors" },
            { key: "signup_enabled" as const, label: "Sign-up Enabled", desc: "Allow new user registrations" },
            { key: "mentorship_enabled" as const, label: "Mentorship Enabled", desc: "Allow new mentorship bookings" },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/80">{label}</p>
                <p className="text-xs text-white/40">{desc}</p>
              </div>
              <button
                onClick={() => update(key, !form[key])}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  form[key] ? "bg-[#1CE7D0]" : "bg-white/10"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                    form[key] ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Save */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          className="px-6 py-2.5 bg-[#FFC857] text-[#0D1B2A] font-semibold text-sm rounded-lg hover:bg-[#FFC857]/90 transition-colors"
        >
          Save Settings
        </button>
        {saved && (
          <span className="text-sm text-emerald-400 animate-pulse">
            Settings saved successfully!
          </span>
        )}
      </div>
    </div>
  );
}
