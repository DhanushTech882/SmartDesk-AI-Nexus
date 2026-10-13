import React from "react";
import { Search, X, ChevronDown, Filter } from "lucide-react";

export interface SearchInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  placeholder?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  onClear,
  placeholder = "Search...",
  className = "",
  disabled,
  ...props
}) => {
  return (
    <div className={`relative flex items-center w-full ${className}`}>
      <Search className="w-4 h-4 text-brand-muted absolute left-3 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        className="w-full h-9 pl-9 pr-8 text-sm bg-white border border-brand-border rounded-lg text-brand-text placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue hover:border-slate-300 transition-colors shadow-subtle disabled:bg-slate-50 disabled:cursor-not-allowed"
        {...props}
      />
      {value && (
        <button
          type="button"
          onClick={() => {
            onChange("");
            onClear?.();
          }}
          className="absolute right-2.5 text-brand-muted hover:text-brand-text p-0.5 rounded transition-colors"
          aria-label="Clear search"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options?: SelectOption[];
  isError?: boolean;
  icon?: React.ReactNode;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      options,
      children,
      className = "",
      isError = false,
      icon,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <div className="relative flex items-center w-full">
        {icon && (
          <div className="absolute left-3 text-brand-muted pointer-events-none flex items-center">
            {icon}
          </div>
        )}
        <select
          ref={ref}
          disabled={disabled}
          className={`w-full h-9 bg-white border rounded-lg text-sm text-brand-text appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed transition-colors shadow-subtle ${
            icon ? "pl-9" : "pl-3.5"
          } pr-9 ${
            isError
              ? "border-brand-error focus:border-brand-error focus:ring-brand-error/20"
              : "border-brand-border hover:border-slate-300"
          } ${className}`}
          {...props}
        >
          {options
            ? options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))
            : children}
        </select>
        <ChevronDown className="w-4 h-4 text-brand-muted absolute right-3 pointer-events-none" />
      </div>
    );
  }
);

Select.displayName = "Select";
