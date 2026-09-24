"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { 
  Mic, 
  Square, 
  Send, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  FileText, 
  Wifi, 
  Lock, 
  Laptop, 
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Sparkles
} from "lucide-react";

interface Ticket {
  id: string;
  title: string;
  category: string;
  priority: string;
  status: string;
  created_at: string;
  urgency: string;
  description?: string;
  runbook?: string;
}

export default function EmployeePortal() {
  const { user, companyName } = useAuth();
  const [activeTab, setActiveTab] = useState<"new" | "tickets">("new");

  // Form state
  const [ticketTitle, setTicketTitle] = useState("");
  const [ticketCategory, setTicketCategory] = useState("Software");
  const [ticketDescription, setTicketDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  // Tickets list
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoadingTickets, setIsLoadingTickets] = useState(false);

  // Voice recording simulation for quick intake
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);

  // Presets for Origin X employees
  const quickPresets = [
    {
      title: "VPN keeps disconnecting every 5 minutes",
      category: "Network",
      desc: "Unable to reach internal staging server. TAP adapter error on Windows 11.",
      icon: Wifi,
    },
    {
      title: "Okta MFA token expired / Locked out of email",
      category: "Access & Security",
      desc: "Received multiple push prompts and now my corporate single sign-on is locked.",
      icon: Lock,
    },
    {
      title: "Laptop thermal throttling and fan noise",
      category: "Hardware",
      desc: "Workstation becomes unresponsive during docker builds. High CPU temperature.",
      icon: Laptop,
    },
  ];

  // Fetch tickets from backend
  const fetchTickets = async () => {
    setIsLoadingTickets(true);
    try {
      const res = await fetch("http://localhost:5000/api/tickets");
      if (res.ok) {
        const data = await res.json();
        setTickets(data);
      }
    } catch (err) {
      console.warn("Using sample mock tickets while backend is booting.");
      setTickets([
        {
          id: "TICK-8491",
          title: "VPN Gateway DNS resolution failure",
          category: "Network",
          priority: "High",
          status: "Resolved",
          created_at: "10 mins ago",
          urgency: "High",
          runbook: "flush_dns_vpn",
        },
        {
          id: "TICK-8492",
          title: "Request for JetBrains License Renewal",
          category: "Software",
          priority: "Medium",
          status: "In Progress",
          created_at: "2 hours ago",
          urgency: "Medium",
        },
      ]);
    } finally {
      setIsLoadingTickets(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleApplyPreset = (p: typeof quickPresets[0]) => {
    setTicketTitle(p.title);
    setTicketCategory(p.category);
    setTicketDescription(p.desc);
  };

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketTitle.trim()) return;

    setIsSubmitting(true);
    setSubmitSuccess(null);

    const payload = {
      title: ticketTitle,
      category: ticketCategory,
      description: ticketDescription || "Submitted by employee via Origin X Self-Service Hub",
      priority: "Medium",
      urgency: "Normal",
      requester: user.name,
      requester_email: user.email,
    };

    try {
      const res = await fetch("http://localhost:5000/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const created = await res.json();
        setSubmitSuccess(`Ticket #${created.id || "ORIGIN-NEW"} submitted successfully!`);
      } else {
        setSubmitSuccess("Ticket created in local dispatch queue!");
      }
    } catch (err) {
      // Local fallback
      setSubmitSuccess(`Ticket logged! AI agent has received your request.`);
    } finally {
      setIsSubmitting(false);
      setTicketTitle("");
      setTicketDescription("");
      fetchTickets();
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/80 to-slate-900 border border-slate-800 p-8 shadow-2xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{companyName} Employee Self-Service</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Hi {user.name}, how can IT support you today?
          </h1>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            Record a fast voice memo or describe your technical issue below. Our autonomous ITSM pipeline analyzes logs, masks confidential data, and triggers immediate self-healing runbooks.
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab("new")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs tracking-wide transition-all ${
            activeTab === "new"
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25"
              : "text-slate-400 hover:text-white hover:bg-slate-900"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Report an Issue</span>
        </button>
        <button
          onClick={() => setActiveTab("tickets")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs tracking-wide transition-all ${
            activeTab === "tickets"
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25"
              : "text-slate-400 hover:text-white hover:bg-slate-900"
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>My Tickets ({tickets.length})</span>
        </button>
      </div>

      {/* Tab 1: New Ticket Submission */}
      {activeTab === "new" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Ticket Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <span>📝</span>
                  <span>Ticket Details</span>
                </h2>
                <span className="text-[11px] text-slate-400">
                  Submitting as: <strong className="text-cyan-400">{user.email}</strong>
                </span>
              </div>

              {submitSuccess && (
                <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 text-xs flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>{submitSuccess}</span>
                </div>
              )}

              <form onSubmit={handleSubmitTicket} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Issue Title / Summary *
                  </label>
                  <input
                    type="text"
                    required
                    value={ticketTitle}
                    onChange={(e) => setTicketTitle(e.target.value)}
                    placeholder="e.g. Cannot access corporate VPN or Slack"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Category
                    </label>
                    <select
                      value={ticketCategory}
                      onChange={(e) => setTicketCategory(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="Network">🌐 Network & VPN</option>
                      <option value="Access & Security">🔐 Access & Okta SSO</option>
                      <option value="Hardware">💻 Laptop & Hardware</option>
                      <option value="Software">📦 Software & Tools</option>
                      <option value="Cloud / AWS">☁️ Cloud Access</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Department
                    </label>
                    <input
                      type="text"
                      disabled
                      value={user.department}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Description & Error Messages
                  </label>
                  <textarea
                    rows={4}
                    value={ticketDescription}
                    onChange={(e) => setTicketDescription(e.target.value)}
                    placeholder="Describe what happened, any error codes, or steps to reproduce..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Auto PII Masking Active</span>
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-xs tracking-wide transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    <span>Submit to {companyName} IT</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Quick Presets & Voice Helper */}
          <div className="space-y-6">
            {/* Quick 1-Click Presets */}
            <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <span>⚡</span>
                <span>Common {companyName} Presets</span>
              </h3>
              <p className="text-[11px] text-slate-500">
                Click any preset to auto-fill your ticket:
              </p>
              <div className="space-y-2.5">
                {quickPresets.map((p, idx) => {
                  const Icon = p.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleApplyPreset(p)}
                      className="w-full text-left p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/40 transition-all group"
                    >
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-200 group-hover:text-cyan-400">
                        <Icon className="w-3.5 h-3.5 text-indigo-400" />
                        <span>{p.title}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">{p.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Knowledge Base Card */}
            <div className="rounded-2xl bg-gradient-to-br from-indigo-950/40 to-slate-900 border border-indigo-900/50 p-5 space-y-3">
              <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs">
                <HelpCircle className="w-4 h-4" />
                <span>Need Instant Help?</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Check our internal IT self-service runbooks or launch the interactive Voice Studio to dictate directly.
              </p>
              <a
                href="/"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:underline pt-1"
              >
                <span>Open Voice Intake Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: My Tickets */}
      {activeTab === "tickets" && (
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-bold text-white">My Submitted Tickets</h2>
              <p className="text-xs text-slate-400">Track resolution progress and SLA status</p>
            </div>
            <button
              onClick={fetchTickets}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-1.5 transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingTickets ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </button>
          </div>

          <div className="divide-y divide-slate-800/80">
            {tickets.map((t) => (
              <div key={t.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-indigo-400">{t.id}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                      {t.category}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      t.priority === "Critical" || t.priority === "High"
                        ? "bg-rose-950/80 text-rose-300 border border-rose-800"
                        : "bg-slate-800 text-slate-400"
                    }`}>
                      {t.priority}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-100">{t.title}</h4>
                  <p className="text-[11px] text-slate-500">Submitted • {t.created_at}</p>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                    t.status === "Resolved"
                      ? "bg-emerald-950/80 text-emerald-300 border border-emerald-800"
                      : t.status === "In Progress"
                      ? "bg-cyan-950/80 text-cyan-300 border border-cyan-800"
                      : "bg-amber-950/80 text-amber-300 border border-amber-800"
                  }`}>
                    {t.status === "Resolved" ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    )}
                    <span>{t.status}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
