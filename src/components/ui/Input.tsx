import { forwardRef, type InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", label, error, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s/g, "-");

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs text-text-secondary uppercase tracking-wider font-medium mb-1.5"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            w-full px-3 py-2.5 bg-bg border border-border rounded-lg
            text-text-primary font-mono text-sm
            placeholder:text-text-muted
            focus:outline-none focus:border-accent transition-colors
            ${error ? "border-rose" : ""}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="mt-1 text-xs text-rose">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
