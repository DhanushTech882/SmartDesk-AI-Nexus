import React from "react";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className = "",
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      leftIcon,
      rightIcon,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/30 focus-visible:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none select-none rounded-lg";

    const variantStyles = {
      primary:
        "bg-brand-blue text-white hover:bg-brand-blue-hover shadow-subtle active:bg-blue-700",
      secondary:
        "bg-slate-100 text-brand-navy hover:bg-slate-200 border border-brand-border active:bg-slate-300",
      outline:
        "bg-white text-brand-text hover:bg-slate-50 border border-brand-border active:bg-slate-100 shadow-subtle",
      ghost:
        "bg-transparent text-brand-muted hover:text-brand-text hover:bg-slate-100 active:bg-slate-200",
      danger:
        "bg-brand-error text-white hover:bg-red-800 shadow-subtle active:bg-red-900",
    };

    const sizeStyles = {
      sm: "h-8 px-3 text-xs gap-1.5",
      md: "h-9 px-4 text-sm gap-2",
      lg: "h-11 px-5 text-base gap-2.5",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";
