import { type HTMLAttributes } from "react";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "accent";
}

export function Badge({
  className = "",
  variant = "default",
  ...props
}: BadgeProps) {
  const variants = {
    default:
      "bg-[rgba(255,255,255,0.04)] border border-border text-text-secondary",
    accent: "bg-accent-dim border border-accent/20 text-accent",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-mono tracking-wide ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
