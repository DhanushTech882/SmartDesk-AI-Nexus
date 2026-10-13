import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down" | "neutral";
  subtext?: string;
  icon?: React.ReactNode;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  trend = "neutral",
  subtext,
  icon,
  className = "",
}) => {
  const trendConfig = {
    up: {
      color: "text-brand-success bg-emerald-50 border-emerald-200",
      icon: TrendingUp,
    },
    down: {
      color: "text-brand-error bg-red-50 border-red-200",
      icon: TrendingDown,
    },
    neutral: {
      color: "text-brand-muted bg-slate-100 border-brand-border",
      icon: Minus,
    },
  };

  const TrendIcon = trendConfig[trend].icon;

  return (
    <div
      className={`bg-brand-card border border-brand-border rounded-xl p-5 shadow-subtle hover:border-slate-300 transition-colors ${className}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-brand-muted uppercase tracking-wider">
          {title}
        </span>
        {icon && (
          <div className="w-8 h-8 rounded-lg bg-slate-50 border border-brand-border flex items-center justify-center text-brand-blue">
            {icon}
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-2.5">
        <span className="text-2xl font-bold text-brand-navy tracking-tight">
          {value}
        </span>
        {change && (
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${trendConfig[trend].color}`}
          >
            <TrendIcon className="w-3 h-3" />
            {change}
          </span>
        )}
      </div>

      {subtext && (
        <p className="mt-2 text-xs text-brand-muted font-normal">{subtext}</p>
      )}
    </div>
  );
};
