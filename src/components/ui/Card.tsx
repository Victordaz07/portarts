import { type HTMLAttributes } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "raised" | "glass";
}

export function Card({
  className = "",
  variant = "default",
  ...props
}: CardProps) {
  const variants = {
    default: "bg-bg-card border border-border",
    raised: "bg-bg-raised border border-border",
    glass: "bg-surface border border-border glass",
  };

  return (
    <div
      className={`rounded-card-lg overflow-hidden transition-all duration-500 ease-smooth ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
