import React from "react";
import { AlertCircle } from "lucide-react";

export interface FormFieldProps {
  label?: string;
  htmlFor?: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  children: React.ReactNode;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  htmlFor,
  required = false,
  error,
  helperText,
  children,
  className = "",
}) => {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={htmlFor}
          className="block text-xs font-semibold text-brand-navy tracking-tight"
        >
          {label}
          {required && <span className="text-brand-error ml-1">*</span>}
        </label>
      )}
      {children}
      {error ? (
        <p className="text-xs text-brand-error flex items-center gap-1.5 mt-1 font-medium animate-in fade-in duration-150">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      ) : helperText ? (
        <p className="text-xs text-brand-muted mt-1">{helperText}</p>
      ) : null}
    </div>
  );
};
