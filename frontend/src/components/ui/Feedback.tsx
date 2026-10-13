import React from "react";
import {
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  Info,
  X,
  FileQuestion,
} from "lucide-react";
import { Button } from "./Button";

export interface AlertProps {
  variant?: "info" | "success" | "warning" | "error";
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  variant = "info",
  title,
  children,
  onClose,
  className = "",
}) => {
  const config = {
    info: {
      container: "bg-blue-50/80 border-blue-200 text-brand-navy",
      icon: Info,
      iconColor: "text-brand-blue",
    },
    success: {
      container: "bg-teal-50/80 border-teal-200 text-brand-navy",
      icon: CheckCircle2,
      iconColor: "text-brand-success",
    },
    warning: {
      container: "bg-amber-50/80 border-amber-200 text-brand-navy",
      icon: AlertTriangle,
      iconColor: "text-brand-warning",
    },
    error: {
      container: "bg-red-50/80 border-red-200 text-brand-navy",
      icon: AlertCircle,
      iconColor: "text-brand-error",
    },
  };

  const { container, icon: Icon, iconColor } = config[variant];

  return (
    <div
      role="alert"
      className={`p-4 rounded-xl border flex items-start gap-3 text-xs leading-relaxed ${container} ${className}`}
    >
      <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${iconColor}`} />
      <div className="flex-1">
        {title && <h5 className="font-bold text-xs mb-0.5">{title}</h5>}
        <div>{children}</div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-brand-navy p-0.5 rounded transition-colors"
          aria-label="Dismiss alert"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "rectangular" | "circular";
  width?: string;
  height?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = "text",
  width,
  height,
  className = "",
  style,
  ...props
}) => {
  const variantStyles = {
    text: "h-4 rounded",
    rectangular: "rounded-xl",
    circular: "rounded-full",
  };

  return (
    <div
      className={`animate-pulse bg-slate-200/80 ${variantStyles[variant]} ${className}`}
      style={{
        width: width,
        height: height,
        ...style,
      }}
      aria-hidden="true"
      {...props}
    />
  );
};

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className = "",
}) => {
  return (
    <div
      className={`p-12 text-center flex flex-col items-center justify-center border-2 border-dashed border-brand-border rounded-xl bg-white/50 ${className}`}
    >
      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-brand-muted mb-4">
        {icon || <FileQuestion className="w-6 h-6" />}
      </div>
      <h4 className="text-base font-bold text-brand-navy">{title}</h4>
      <p className="text-xs text-brand-muted max-w-sm mt-1 mb-6 leading-relaxed">
        {description}
      </p>
      {action && (
        <Button variant="outline" size="sm" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
};
