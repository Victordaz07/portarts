import { type HTMLAttributes } from "react";

export interface LoadingSpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
}

export function LoadingSpinner({
  className = "",
  size = "md",
  ...props
}: LoadingSpinnerProps) {
  const sizes = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-2",
    lg: "w-12 h-12 border-3",
  };

  return (
    <div
      className={`rounded-full border-accent border-t-transparent animate-spin ${sizes[size]} ${className}`}
      role="status"
      aria-label="Loading"
      {...props}
    />
  );
}
