import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import AppNavbar from "@/components/AppNavbar";

export const metadata: Metadata = {
  title: "Origin X | Cognitive ITSM & Autonomous Support Desk",
  description: "Enterprise AI-driven audio transcription, autonomous runbooks, and ITSM control console for Origin X.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased min-h-screen flex flex-col font-sans selection:bg-indigo-500 selection:text-white bg-slate-950 text-slate-100">
        <AuthProvider>
          {/* Top Enterprise Navigation Header */}
          <AppNavbar />

          {/* Page Content Container */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-6 py-8">
            {children}
          </main>

          {/* Enterprise Footer */}
          <footer className="border-t border-slate-900/80 bg-slate-950/60 py-6 text-center text-xs text-slate-500 flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto px-6 w-full gap-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-300">Origin X Internal IT Platform</span>
              <span>•</span>
              <span>Zero-Touch Autonomous Self-Healing Support</span>
            </div>
            <div className="flex items-center gap-4 text-slate-500 text-[11px]">
              <span>ITIL v4 & SOC2 Compliant</span>
              <span>•</span>
              <span>Open Source Enterprise Edition</span>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
