"use client";

import React, { useState } from "react";
import { AppSidebar } from "./AppSidebar";
import { AppTopNavbar } from "./AppTopNavbar";

export interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-brand-bg text-brand-text">
      {/* Sidebar Navigation */}
      <AppSidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Layout Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Compact Top Navbar */}
        <AppTopNavbar
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
        />

        {/* Content Container */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>

        {/* Enterprise SaaS Footer */}
        <footer className="border-t border-brand-border bg-white py-5 text-xs text-brand-muted">
          <div className="max-w-7xl mx-auto px-4 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-brand-navy">
                Origin X ITSM
              </span>
              <span>•</span>
              <span>Enterprise Cognitive Autonomous Support Desk</span>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <span>ITIL v4 & SOC2 Type II Certified</span>
              <span>•</span>
              <span>Version 1.0</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};
