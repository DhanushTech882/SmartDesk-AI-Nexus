"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth, UserRole } from "@/context/AuthContext";
import { 
  Building2, 
  ChevronDown, 
  Headphones, 
  Mic, 
  Radio, 
  BarChart3, 
  Archive, 
  UserCheck, 
  ShieldAlert, 
  Wrench,
  CheckCircle,
  Sparkles
} from "lucide-react";

export default function AppNavbar() {
  const { user, setRole, companyName } = useAuth();
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const roles: { role: UserRole; label: string; desc: string; icon: any }[] = [
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

  return (
    <header className="border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between gap-4">
        {/* Company Branding */}
        <Link href={user.role === "employee" ? "/employee" : "/console"} className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
            ⚡
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                {companyName} <span className="text-cyan-400 font-extrabold text-sm px-1.5 py-0.5 rounded bg-cyan-950/70 border border-cyan-800/60">ITSM</span>
              </span>
              <span className="hidden sm:inline-flex px-2 py-0.5 text-[9px] font-black tracking-wider uppercase bg-slate-800/80 text-slate-300 border border-slate-700/60 rounded-full">
                {user.role.toUpperCase()} VIEW
              </span>
            </div>
            <p className="text-[10px] text-slate-400 -mt-0.5 font-medium tracking-tight">
              Enterprise Autonomous Cognitive Support Desk
            </p>
          </div>
        </Link>

        {/* Dynamic Role Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {user.role === "employee" && (
            <>
              <Link
                href="/employee"
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  pathname === "/employee"
                    ? "bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 shadow-sm"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/70"
                }`}
              >
                <span>🏠</span>
                <span>Employee Hub</span>
              </Link>
              <Link
                href="/"
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  pathname === "/"
                    ? "bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 shadow-sm"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/70"
                }`}
              >
                <span>🎙️</span>
                <span>Voice Studio</span>
              </Link>
            </>
          )}

          {user.role === "agent" && (
            <>
              <Link
                href="/console"
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  pathname === "/console"
                    ? "bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 shadow-sm"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/70"
                }`}
              >
                <span>⚡</span>
                <span>Agent Console</span>
              </Link>
              <Link
                href="/"
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  pathname === "/"
                    ? "bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 shadow-sm"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/70"
                }`}
              >
                <span>🎙️</span>
                <span>Voice Intake</span>
              </Link>
              <Link
                href="/history"
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  pathname === "/history"
                    ? "bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 shadow-sm"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/70"
                }`}
              >
                <span>🗃️</span>
                <span>All Tickets</span>
              </Link>
            </>
          )}

          {user.role === "admin" && (
            <>
              <Link
                href="/incidents"
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  pathname === "/incidents"
                    ? "bg-rose-600/30 text-rose-300 border border-rose-500/30 shadow-sm"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/70"
                }`}
              >
                <span>📡</span>
                <span>Outage Radar</span>
              </Link>
              <Link
                href="/analytics"
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  pathname === "/analytics"
                    ? "bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 shadow-sm"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/70"
                }`}
              >
                <span>📊</span>
                <span>Analytics & SLA</span>
              </Link>
              <Link
                href="/console"
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  pathname === "/console"
                    ? "bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 shadow-sm"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/70"
                }`}
              >
                <span>⚡</span>
                <span>Triage Console</span>
              </Link>
            </>
          )}
        </nav>

        {/* Company Role Switcher / User Profile */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all text-left shadow-sm"
          >
            <span className="text-xl">{user.avatar}</span>
            <div className="hidden sm:block">
              <p className="text-xs font-bold text-slate-200 leading-none">{user.name}</p>
              <p className="text-[10px] text-cyan-400 font-medium capitalize mt-0.5">
                {user.role} • {companyName}
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Switcher Dropdown */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-slate-900/95 border border-slate-800 shadow-2xl p-2 z-50 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-2 border-b border-slate-800 mb-1.5">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Switch Enterprise Persona
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Test Origin X portals as different team members
                </p>
              </div>

              <div className="space-y-1">
                {roles.map(({ role, label, desc, icon: Icon }) => (
                  <button
                    key={role}
                    onClick={() => {
                      setRole(role);
                      setDropdownOpen(false);
                    }}
                    className={`w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition-all ${
                      user.role === role
                        ? "bg-indigo-600/20 border border-indigo-500/40 text-white"
                        : "hover:bg-slate-800/60 text-slate-300"
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg ${user.role === role ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-400"}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold">{label}</span>
                        {user.role === role && (
                          <CheckCircle className="w-3 h-3 text-cyan-400 ml-auto" />
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">{desc}</p>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-2 pt-2 border-t border-slate-800/80 px-2 flex items-center justify-between text-[10px] text-slate-500">
                <span>Active: <strong className="text-slate-400">{user.email}</strong></span>
                <span className="text-emerald-400 font-semibold">● Online</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
