"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  Mic,
  Home,
  Zap,
  ClipboardList,
  Archive,
  Radio,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Headphones,
  Sparkles,
} from "lucide-react";

interface AppSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
}) => {
  const pathname = usePathname();
  const { user, companyName } = useAuth();

  const navigationSections = [
    {
      title: "Workspace",
      items: [
        {
          label: "Voice Studio",
          href: "/",
          icon: Mic,
          roleAllowed: ["employee", "agent", "admin"],
          badge: "AI",
        },
        {
          label: "Employee Hub",
          href: "/employee",
          icon: Home,
          roleAllowed: ["employee", "agent", "admin"],
        },
        {
          label: "Agent Console",
          href: "/console",
          icon: Zap,
          roleAllowed: ["agent", "admin"],
          badge: "Triage",
        },
        {
          label: "Manual Ticket",
          href: "/tickets",
          icon: ClipboardList,
          roleAllowed: ["employee", "agent", "admin"],
        },
      ],
    },
    {
      title: "IT Operations",
      items: [
        {
          label: "All Tickets",
          href: "/history",
          icon: Archive,
          roleAllowed: ["agent", "admin"],
        },
        {
          label: "Outage Radar",
          href: "/incidents",
          icon: Radio,
          roleAllowed: ["admin"],
          badge: "Live",
        },
        {
          label: "SLA & Analytics",
          href: "/analytics",
          icon: BarChart3,
          roleAllowed: ["admin"],
        },
      ],
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-brand-border select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-brand-border">
        <Link
          href={user.role === "employee" ? "/employee" : "/console"}
          className="flex items-center gap-3 overflow-hidden"
          onClick={onCloseMobile}
        >
          <div className="w-9 h-9 rounded-lg bg-brand-navy flex items-center justify-center text-white font-bold text-base shadow-subtle shrink-0">
            <Sparkles className="w-4 h-4 text-brand-blue" />
          </div>
          {!isCollapsed && (
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-brand-navy tracking-tight truncate">
                  {companyName}
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 bg-blue-50 text-brand-blue border border-blue-200 rounded">
                  ITSM
                </span>
              </div>
              <p className="text-[10px] text-brand-muted truncate font-medium">
                Cognitive Support Desk
              </p>
            </div>
          )}
        </Link>
        <button
          onClick={onToggleCollapse}
          className="hidden lg:flex p-1 rounded-lg text-brand-muted hover:text-brand-navy hover:bg-slate-100 transition-colors"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Nav Items */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navigationSections.map((section, idx) => (
          <div key={idx}>
            {!isCollapsed && (
              <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                {section.title}
              </p>
            )}
            <ul className="space-y-1">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                const isPermitted = item.roleAllowed.includes(user.role);

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onCloseMobile}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all group ${
                        isActive
                          ? "bg-blue-50 text-brand-blue font-semibold shadow-subtle"
                          : "text-brand-text hover:bg-slate-50 hover:text-brand-navy"
                      } ${!isPermitted ? "opacity-60" : ""}`}
                      title={isCollapsed ? item.label : undefined}
                    >
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-colors ${
                          isActive
                            ? "text-brand-blue"
                            : "text-brand-muted group-hover:text-brand-navy"
                        }`}
                      />
                      {!isCollapsed && (
                        <>
                          <span className="flex-1 truncate">{item.label}</span>
                          {item.badge && (
                            <span
                              className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                                isActive
                                  ? "bg-brand-blue text-white"
                                  : "bg-slate-100 text-brand-muted group-hover:bg-slate-200"
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-brand-border bg-slate-50/60">
        {!isCollapsed ? (
          <div className="px-2 py-1.5 flex items-center justify-between text-[11px] text-brand-muted">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-success" />
              <span>SOC2 & ITIL v4</span>
            </span>
            <span className="text-brand-navy font-semibold text-[10px]">v1.0</span>
          </div>
        ) : (
          <div className="flex justify-center py-1">
            <span title="SOC2 Compliant">
              <ShieldCheck className="w-4 h-4 text-brand-success" />
            </span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:block shrink-0 transition-all duration-200 sticky top-0 h-screen z-30 ${
          isCollapsed ? "w-18" : "w-64"
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm"
          onClick={onCloseMobile}
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`lg:hidden fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-200 ease-in-out ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </div>
    </>
  );
};
