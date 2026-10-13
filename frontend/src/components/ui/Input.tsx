import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  isError?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isPassword?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className = "",
      type = "text",
      isError = false,
      leftIcon,
      rightIcon,
      isPassword = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    const resolvedType = isPassword
      ? showPassword
        ? "text"
        : "password"
      : type;

    return (
      <div className="relative flex items-center w-full">
        {leftIcon && (
          <div className="absolute left-3 text-brand-muted pointer-events-none flex items-center justify-center">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          type={resolvedType}
          disabled={disabled}
          aria-invalid={isError}
          className={`w-full rounded-lg bg-white border text-sm text-brand-text placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed ${
            isError
              ? "border-brand-error focus:border-brand-error focus:ring-brand-error/20"
              : "border-brand-border hover:border-slate-300"
          } ${leftIcon ? "pl-9" : "pl-3.5"} ${
            rightIcon || isPassword ? "pr-10" : "pr-3.5"
          } py-2 h-9 shadow-subtle ${className}`}
          {...props}
        />
        {isPassword ? (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 text-brand-muted hover:text-brand-text focus:outline-none"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        ) : (
          rightIcon && (
            <div className="absolute right-3 text-brand-muted pointer-events-none flex items-center justify-center">
              {rightIcon}
            </div>
          )
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  isError?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = "", isError = false, disabled, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        disabled={disabled}
        aria-invalid={isError}
        className={`w-full rounded-lg bg-white border text-sm text-brand-text placeholder:text-slate-400 p-3 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed shadow-subtle ${
          isError
            ? "border-brand-error focus:border-brand-error focus:ring-brand-error/20"
            : "border-brand-border hover:border-slate-300"
        } ${className}`}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";
