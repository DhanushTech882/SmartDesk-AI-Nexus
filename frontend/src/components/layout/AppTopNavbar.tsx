"use client";

import React from "react";
import { useAuth, UserRole } from "@/context/AuthContext";
import {
  Menu,
  ChevronDown,
  UserCheck,
  Wrench,
  ShieldAlert,
  CheckCircle2,
  Bell,
  Search,
} from "lucide-react";
import { Dropdown, DropdownItem } from "@/components/ui/Dropdown";

interface AppTopNavbarProps {
  onOpenMobileSidebar: () => void;
}

export const AppTopNavbar: React.FC<AppTopNavbarProps> = ({
  onOpenMobileSidebar,
}) => {
  const { user, setRole, companyName } = useAuth();

  const roleDefinitions: {
    role: UserRole;
    label: string;
    desc: string;
    icon: any;
  }[] = [
    {
      role: "employee",
      label: "Employee Portal",
      desc: "Report issues via voice/text & track tickets",
      icon: UserCheck,
    },
    {
      role: "agent",
      label: "IT Support Agent",
      desc: "Ticket triage, audio scrubber & runbooks",
      icon: Wrench,
    },
    {
      role: "admin",
      label: "IT Admin / SRE",
      desc: "Outage radar, SLA compliance & telemetry",
      icon: ShieldAlert,
    },
  ];

  const dropdownItems: DropdownItem[] = roleDefinitions.map((item) => {
    const Icon = item.icon;
    return {
      id: item.role,
      label: item.label,
      description: item.desc,
      icon: <Icon className="w-4 h-4" />,
      active: user.role === item.role,
      onClick: () => setRole(item.role),
    };
  });

  return (
    <header className="h-16 bg-white border-b border-brand-border sticky top-0 z-20 flex items-center justify-between px-4 lg:px-8 select-none">
      {/* Left side: Hamburger (Mobile) + Context Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-lg text-brand-muted hover:text-brand-navy hover:bg-slate-100 transition-colors"
          aria-label="Open navigation sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs text-brand-muted">
          <span className="font-semibold text-brand-navy">{companyName}</span>
          <span>/</span>
          <span className="capitalize">{user.role} Workspace</span>
        </div>
      </div>

      {/* Right side: Global Status + Persona Selector */}
      <div className="flex items-center gap-3">
        {/* Live System Health */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-50 border border-teal-200 text-brand-success text-[11px] font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-success animate-pulse" />
          <span>System Healthy</span>
        </div>

        {/* Persona Switcher Dropdown */}
        <Dropdown
          align="right"
          width="w-72"
          trigger={
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-brand-border bg-white hover:bg-slate-50 transition-colors cursor-pointer shadow-subtle">
              <span className="text-lg leading-none" aria-hidden="true">
                {user.avatar}
              </span>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-bold text-brand-navy leading-none">
                  {user.name}
                </p>
                <p className="text-[10px] text-brand-muted font-medium capitalize mt-0.5">
                  {user.role} • {user.department}
                </p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-brand-muted ml-1" />
            </div>
          }
          items={dropdownItems}
        />
      </div>
    </header>
  );
};
