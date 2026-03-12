import { forwardRef, type ButtonHTMLAttributes } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", size = "md", ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center font-medium rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed";
    const variants = {
      primary:
        "bg-accent text-bg border border-accent hover:shadow-[0_6px_24px_rgba(232,197,71,0.3)] hover:-translate-y-0.5",
      secondary:
        "bg-transparent text-text-primary border border-border hover:border-text-secondary hover:-translate-y-0.5",
      ghost:
        "bg-transparent text-text-secondary hover:text-text-primary hover:bg-bg-hover",
    };
    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-sm",
      lg: "px-8 py-4 text-base",
    };

    return (
      <button
        ref={ref}
        className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
