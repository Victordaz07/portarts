import { forwardRef, type TextareaHTMLAttributes } from "react";

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
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
        <textarea
          ref={ref}
          id={inputId}
          className={`
            w-full px-3 py-2.5 bg-bg border border-border rounded-lg
            text-text-primary font-mono text-sm min-h-[70px] resize-y
            placeholder:text-text-muted
            focus:outline-none focus:border-accent transition-colors
            ${error ? "border-rose" : ""}
            ${className}
          `}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-rose">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };
