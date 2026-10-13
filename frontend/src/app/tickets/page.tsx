"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ClipboardList,
  Send,
  RotateCcw,
  ShieldAlert,
  Clock,
  Sparkles,
  Info,
} from "lucide-react";
import {
  Button,
  Input,
  Textarea,
  FormField,
  Select,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Badge,
  PageHeader,
  Alert,
  MetricCard,
} from "@/components/ui";

export default function CreateTicketForm() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [category, setCategory] = useState("Software");
  const [status, setStatus] = useState<"idle" | "submitting" | "error" | "success">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ title?: string; description?: string }>({});

  const validate = () => {
    const errors: { title?: string; description?: string } = {};
    if (!title.trim()) {
      errors.title = "Ticket title is required";
    }
    if (!description.trim()) {
      errors.description = "Detailed problem description is required";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleReset = () => {
    setTitle("");
    setDescription("");
    setPriority("Medium");
    setCategory("Software");
    setFieldErrors({});
    setStatus("idle");
    setErrorMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      setStatus("error");
      setErrorMessage("Please complete all required fields before dispatching.");
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    try {
      const response = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, priority, category }),
      });

      if (!response.ok) {
        throw new Error((await response.text()) || "Failed to submit ticket.");
      }

      setStatus("success");
      setTimeout(() => {
        router.push("/history");
      }, 1500);
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred while communicating with the database.");
      setStatus("error");
    }
  };

  const getPriorityBadgeVariant = (p: string): "default" | "success" | "warning" | "error" | "neutral" => {
    switch (p.toLowerCase()) {
      case "critical":
      case "high":
        return "error";
      case "medium":
        return "warning";
      case "low":
        return "neutral";
      default:
        return "default";
    }
  };

  return (
    <div>
      {/* Consistent Enterprise Page Header & Breadcrumbs */}
      <PageHeader
        title="Manual Ticket Dispatch"
        description="Submit ad-hoc enterprise service desk tickets directly into the triage queue. Cognitive runbooks and routing policies are evaluated upon ingestion."
        badge={<Badge variant="default" dot>ITSM Standard</Badge>}
        breadcrumbs={[
          { label: "Operations", href: "/history" },
          { label: "Dispatch New Ticket" },
        ]}
      />

      {/* Top Telemetry / Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <MetricCard
          title="Triage Latency"
          value="< 45s"
          subtext="Autonomous NLP categorization active"
          icon={<Clock className="w-4 h-4" />}
        />
        <MetricCard
          title="Target SLA"
          value="4h 00m"
          change="Tier 1"
          trend="up"
          subtext="Assigned automatically based on priority"
          icon={<ShieldAlert className="w-4 h-4" />}
        />
        <MetricCard
          title="Self-Healing Engine"
          value="Ready"
          subtext="Runbooks auto-suggested on submission"
          icon={<Sparkles className="w-4 h-4" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Ticket Form (2 cols) */}
        <div className="lg:col-span-2">
          <Card padding="lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Ticket Information</CardTitle>
                  <CardDescription>
                    Provide accurate details to ensure rapid routing to the proper engineering tier.
                  </CardDescription>
                </div>
                <Badge variant={getPriorityBadgeVariant(priority)} dot>
                  {priority} Priority
                </Badge>
              </div>
            </CardHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Status Notifications */}
              {status === "error" && (
                <Alert
                  variant="error"
                  title="Submission Error"
                  onClose={() => setStatus("idle")}
                >
                  {errorMessage}
                </Alert>
              )}

              {status === "success" && (
                <Alert
                  variant="success"
                  title="Ticket Dispatched Successfully"
                >
                  Ticket ingested into the database. Redirecting to All Tickets view...
                </Alert>
              )}

              {/* Title Field */}
              <FormField
                label="Ticket Title"
                htmlFor="ticket-title"
                required
                error={fieldErrors.title}
                helperText="Summarize the core technical problem in one clear sentence."
              >
                <Input
                  id="ticket-title"
                  placeholder="e.g. Cisco AnyConnect VPN fails to authenticate on Windows 11"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (fieldErrors.title) setFieldErrors({ ...fieldErrors, title: undefined });
                  }}
                  disabled={status === "submitting" || status === "success"}
                  isError={Boolean(fieldErrors.title)}
                />
              </FormField>

              {/* Category & Priority Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Category" htmlFor="ticket-category" required>
                  <Select
                    id="ticket-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    disabled={status === "submitting" || status === "success"}
                    options={[
                      { value: "Software", label: "Software & Applications" },
                      { value: "Hardware", label: "Hardware & Peripherals" },
                      { value: "Network", label: "Network & VPN" },
                      { value: "Authentication", label: "Authentication & SSO" },
                      { value: "Billing", label: "Procurement & Billing" },
                      { value: "Cloud", label: "Cloud & Infrastructure" },
                    ]}
                  />
                </FormField>

                <FormField label="Priority Level" htmlFor="ticket-priority" required>
                  <Select
                    id="ticket-priority"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    disabled={status === "submitting" || status === "success"}
                    options={[
                      { value: "Low", label: "Low — Minor inconvenience" },
                      { value: "Medium", label: "Medium — Degraded workflow" },
                      { value: "High", label: "High — Critical blocker" },
                      { value: "Critical", label: "Critical — System-wide outage" },
                    ]}
                  />
                </FormField>
              </div>

              {/* Problem Description */}
              <FormField
                label="Problem Description"
                htmlFor="ticket-description"
                required
                error={fieldErrors.description}
                helperText="Include reproduction steps, exact error messages, hostnames, and business impact."
              >
                <Textarea
                  id="ticket-description"
                  rows={6}
                  placeholder="Provide detailed description of what happened, recent changes made, and expected behavior..."
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    if (fieldErrors.description) setFieldErrors({ ...fieldErrors, description: undefined });
                  }}
                  disabled={status === "submitting" || status === "success"}
                  isError={Boolean(fieldErrors.description)}
                />
              </FormField>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-brand-border flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  disabled={status === "submitting" || status === "success"}
                  leftIcon={<RotateCcw className="w-4 h-4" />}
                >
                  Reset Form
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={status === "submitting"}
                  leftIcon={<Send className="w-4 h-4" />}
                >
                  {status === "submitting" ? "Dispatching..." : "Dispatch Ticket"}
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Sidebar Information Panel (1 col) */}
        <div className="space-y-6">
          <Card padding="md">
            <CardHeader>
              <CardTitle className="text-sm">ITIL Dispatch Guidelines</CardTitle>
              <CardDescription>
                Ensuring SLA compliance and expedited resolution.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs text-brand-muted leading-relaxed">
              <div className="p-3 rounded-lg bg-slate-50 border border-brand-border space-y-1.5">
                <p className="font-semibold text-brand-navy flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-brand-blue" />
                  <span>Automated Audio Ingestion</span>
                </p>
                <p>
                  Prefer speech-to-text? You can also record voice memos in the{" "}
                  <strong className="text-brand-navy font-semibold">Voice Studio</strong> to extract tickets autonomously.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-blue mt-1.5 shrink-0" />
                  <span>
                    <strong className="text-brand-navy">P1/Critical:</strong> Page on-call SRE immediately for Sev-1 triage.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-blue mt-1.5 shrink-0" />
                  <span>
                    <strong className="text-brand-navy">Attachments & Logs:</strong> Can be Scrubbed in the Agent Console after creation.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-blue mt-1.5 shrink-0" />
                  <span>
                    <strong className="text-brand-navy">Runbook Match:</strong> Known error patterns trigger self-healing scripts.
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card padding="md" className="bg-slate-50/70">
            <CardHeader>
              <CardTitle className="text-xs uppercase tracking-wider text-slate-500 font-bold">
                Security & Compliance
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-brand-muted space-y-2">
              <p>
                All ticket data is encrypted at rest (AES-256) and during transit (TLS 1.3). PII redaction is applied to customer transcripts automatically.
              </p>
              <div className="pt-2 flex items-center gap-2 text-[11px] text-brand-success font-semibold">
                <span className="w-2 h-2 rounded-full bg-brand-success" />
                <span>Zero Trust Architecture Active</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
