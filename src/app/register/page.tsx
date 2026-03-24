// ─── Real Registration Page ─────────────────────────────────────────────────
// Supabase-powered authentication with email/password
// ─────────────────────────────────────────────────────────────────────────────
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/Button";

interface SignupResponse {
  assignedWhatsappLink?: string | null;
  dashboardLoginUrl?: string;
  assignedGroupName?: string | null;
}

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [successData, setSuccessData] = useState<SignupResponse | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    country: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Validation
    if (!formData.email || !formData.password || !formData.fullName || !formData.phone || !formData.country) {
      setError("Please fill in all fields");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
          phone: formData.phone,
          country: formData.country,
        }),
      });

      const data = (await response.json()) as SignupResponse & { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Sign up failed");
      }

      setSuccessData(data);
      setSuccess(true);
      
      // Auto sign in in background
      const signInResponse = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!signInResponse.ok) {
        console.warn("Auto sign-in failed after signup");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during sign up");
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-[#0D1B2A] flex items-center justify-center px-4 py-10">
        <div className="pointer-events-none absolute -top-20 -left-20 h-60 w-60 rounded-full bg-[#1CE7D0]/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-[#FFC857]/20 blur-3xl" />

        <div className="relative max-w-md w-full rounded-3xl border border-white/20 bg-white/95 shadow-2xl p-8 text-center">
          <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[#0D1B2A]/70 bg-[#1CE7D0]/25 border border-[#1CE7D0]/30 px-4 py-2 rounded-full mb-4">
            Welcome Aboard
          </div>

          <div className="w-16 h-16 bg-[#1CE7D0]/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">✨</span>
          </div>
          <h1 className="text-2xl font-bold text-[#0D1B2A] mb-2 font-(family-name:--font-montserrat)">
            Account Created!
          </h1>
          <p className="text-[#0D1B2A]/70 mb-4">
            Welcome to CreatorCashCow! Your account is ready.
          </p>
          {successData?.assignedGroupName && (
            <p className="text-sm text-[#0D1B2A] mb-4">
              Assigned Group: <span className="font-semibold">{successData.assignedGroupName}</span>
            </p>
          )}
          <div className="flex flex-col gap-3">
            {successData?.assignedWhatsappLink ? (
              <a
                href={successData.assignedWhatsappLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center bg-[#25D366] text-[#0D1B2A] font-bold text-sm uppercase tracking-wider rounded-full px-6 py-3 hover:brightness-105 transition"
              >
                Join Assigned WhatsApp Group
              </a>
            ) : (
              <p className="text-xs text-gray-500">WhatsApp link will be provided shortly by admin.</p>
            )}
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="inline-flex items-center justify-center bg-[#FFC857] text-[#0D1B2A] font-bold text-sm uppercase tracking-wider rounded-full px-6 py-3 hover:brightness-105 transition"
            >
              Log Into Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0D1B2A] flex items-center justify-center px-4 py-12">
      <div className="pointer-events-none absolute -top-16 -left-16 h-64 w-64 rounded-full bg-[#1CE7D0]/15 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -right-20 h-72 w-72 rounded-full bg-[#FFC857]/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 left-1/3 h-64 w-64 rounded-full bg-[#1CE7D0]/10 blur-3xl" />

      <div className="max-w-2xl w-full rounded-4xl border border-white/20 bg-white/8 backdrop-blur-xl shadow-2xl p-8 sm:p-10">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="inline-flex items-center rounded-full border border-[#1CE7D0]/30 bg-[#1CE7D0]/15 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#1CE7D0]">
            Creator Community
          </span>
          <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold text-white mb-3 font-(family-name:--font-montserrat)">
            Build Your Creator Income
          </h1>
          <p className="text-white/75 text-base sm:text-lg max-w-xl mx-auto">
            Join high-performing creators, unlock premium courses, and grow with live mentorship + private groups.
          </p>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-white/85">5 Premium Courses</span>
            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-white/85">Private Group Access</span>
            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-white/85">Mentorship Ready</span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-300/40 text-red-200 px-4 py-3 rounded-2xl mb-6 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="fullName" className="block text-sm font-semibold text-white/90 mb-2">
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full px-4 py-3.5 border border-white/15 bg-white/10 rounded-2xl focus:ring-2 focus:ring-[#1CE7D0] focus:border-transparent transition-all text-white placeholder:text-white/50"
              placeholder="John Doe"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-white/90 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3.5 border border-white/15 bg-white/10 rounded-2xl focus:ring-2 focus:ring-[#1CE7D0] focus:border-transparent transition-all text-white placeholder:text-white/50"
              placeholder="you@example.com"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-semibold text-white/90 mb-2">
              Phone Number (WhatsApp)
            </label>
            <input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3.5 border border-white/15 bg-white/10 rounded-2xl focus:ring-2 focus:ring-[#1CE7D0] focus:border-transparent transition-all text-white placeholder:text-white/50"
              placeholder="+234 xxx xxx xxxx"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="country" className="block text-sm font-semibold text-white/90 mb-2">
              Country
            </label>
            <select
              id="country"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              className="w-full px-4 py-3.5 border border-white/15 bg-white/10 rounded-2xl focus:ring-2 focus:ring-[#1CE7D0] focus:border-transparent transition-all text-white"
              required
              disabled={loading}
            >
              <option value="">Select your country</option>
              <option value="Nigeria">Nigeria</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="United States">United States</option>
              <option value="Canada">Canada</option>
              <option value="Ghana">Ghana</option>
              <option value="South Africa">South Africa</option>
            </select>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-white/90 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3.5 border border-white/15 bg-white/10 rounded-2xl focus:ring-2 focus:ring-[#1CE7D0] focus:border-transparent transition-all text-white placeholder:text-white/50"
              placeholder="••••••••"
              required
              disabled={loading}
              minLength={6}
            />
            <p className="text-xs text-white/60 mt-1">Must be at least 6 characters</p>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-white/90 mb-2">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="w-full px-4 py-3.5 border border-white/15 bg-white/10 rounded-2xl focus:ring-2 focus:ring-[#1CE7D0] focus:border-transparent transition-all text-white placeholder:text-white/50"
              placeholder="••••••••"
              required
              disabled={loading}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-linear-to-r from-[#FFC857] to-[#1CE7D0] text-[#0D1B2A] font-extrabold text-sm uppercase tracking-[0.16em] rounded-2xl py-4 hover:brightness-105 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-[#0D1B2A] border-t-transparent rounded-full animate-spin"></div>
                Creating Account...
              </span>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center space-y-3">
          <p className="text-sm text-white/70">
            Already have an account?{" "}
            <Link href="/login" className="text-[#FFC857] font-semibold hover:underline">
              Log in
            </Link>
          </p>
          <Link href="/" className="text-xs text-white/50 hover:text-white/80 block">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
