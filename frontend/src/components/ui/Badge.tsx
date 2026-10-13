import React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "error" | "neutral" | "navy";
  size?: "sm" | "md";
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  className = "",
  variant = "neutral",
  size = "md",
  dot = false,
  children,
  ...props
}) => {
  const variantStyles = {
    default: "bg-blue-50 text-brand-blue border-blue-200",
    success: "bg-teal-50 text-brand-success border-teal-200",
    warning: "bg-amber-50 text-brand-warning border-amber-200",
    error: "bg-red-50 text-brand-error border-red-200",
    neutral: "bg-slate-50 text-brand-muted border-brand-border",
    navy: "bg-slate-100 text-brand-navy border-slate-300",
  };

  const dotStyles = {
    default: "bg-brand-blue",
    success: "bg-brand-success",
    warning: "bg-brand-warning",
    error: "bg-brand-error",
    neutral: "bg-slate-400",
    navy: "bg-brand-navy",
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-2.5 py-1 text-xs",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotStyles[variant]}`}
          aria-hidden="true"
        />
      )}
      <span>{children}</span>
    </span>
  );
};
