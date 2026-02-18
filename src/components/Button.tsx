// ─── Button ────────────────────────────────────────────────────────────────
// Reusable CTA button with three variants: primary (gold), secondary (teal),
// and outline. Supports full-width and size props.
// ───────────────────────────────────────────────────────────────────────────

import React from "react";
import Link from "next/link";

type Variant = "primary" | "secondary" | "outline";
type Size    = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  href?: string;
  children: React.ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-[#FFC857] text-[#0D1B2A] hover:bg-[#f5b732] shadow-lg hover:shadow-[#FFC857]/40 hover:scale-105",
  secondary:
    "bg-transparent border-2 border-[#1CE7D0] text-[#1CE7D0] hover:bg-[#1CE7D0] hover:text-[#0D1B2A] hover:scale-105",
  outline:
    "bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#0D1B2A] hover:scale-105",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

export default function Button({
  variant  = "primary",
  size     = "md",
  fullWidth = false,
  href,
  children,
  className = "",
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center font-bold uppercase tracking-wider rounded-full transition-all duration-200 cursor-pointer";

  const classes = [
    base,
    variantClasses[variant],
    sizeClasses[size],
    fullWidth ? "w-full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (href) {
    const isInternal = href.startsWith("/");

    if (isInternal) {
      return (
        <Link href={href} className={classes}>
          {children}
        </Link>
      );
    }

    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
