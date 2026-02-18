"use client";

import { useEffect, useMemo, useState } from "react";

import BadgerScanner from "@/components/BadgerScanner";
import TacticalDashboard from "@/components/TacticalDashboard";
import UploadZone from "@/components/UploadZone";
import LeadCapture from "@/components/LeadCapture";
import type { BadgerAudit } from "@/types";

type AuditStatus = "idle" | "scanning" | "lead" | "completed";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function Home() {
  const [status, setStatus] = useState<AuditStatus>("idle");
  const [auditData, setAuditData] = useState<BadgerAudit | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [leadSaved, setLeadSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isScanning = status === "scanning";
  const isLead = status === "lead";
  const isCompleted = status === "completed";

  const backgroundStyle = useMemo(
    () => ({
      background: "radial-gradient(circle at top, #1a1a1a 0%, #0D0D0D 55%)",
    }),
    []
  );

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileSelected = async (file: File) => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setError(null);
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);
    setStatus("scanning");
    setAuditData(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/audit", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Badger lost the scent");
      const result = await response.json();
      await delay(2000);
      setAuditData(result.audit || result); // support both {audit} and direct
      setStatus("lead");
    } catch (err) {
      setStatus("idle");
      setError("[ERROR] Badger lost the scent. Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white" style={backgroundStyle}>
      {/* Fixed Site Header */}
      <header className="fixed top-0 left-0 right-0 w-full z-40 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800 flex items-center px-6 py-4" style={{minHeight:'64px'}}>
        {/* Logo Far Left */}
        <div className="flex-1 flex items-center">
          <img src="/logo.png" alt="Basis Badger Logo" className="h-10 w-auto" />
        </div>
        {/* Center Nav Links */}
        <nav className="flex-1 flex justify-center gap-8">
          <a href="#how-it-works" className="text-sm font-semibold text-slate-300 hover:text-[#D4AF37] transition-all">How it Works</a>
          <a href="#pricing" className="text-sm font-semibold text-slate-300 hover:text-[#D4AF37] transition-all">Pricing</a>
        </nav>
        {/* Sign In Far Right */}
        <div className="flex-1 flex justify-end">
          <a href="/dashboard" className="rounded-full px-5 py-2 text-sm font-bold border border-[#D4AF37] text-[#D4AF37] bg-transparent hover:bg-[#D4AF37]/10 transition-all shadow-sm">
            Sign In
          </a>
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-20 pt-24">
        {/* Main Hero Section */}
        <section className="space-y-4 flex items-center gap-3 mt-8">
          <h1 className="max-w-3xl text-4xl font-semibold text-white">
            Tactical audit intelligence for merchant processing statements.
          </h1>
          <p className="max-w-2xl text-sm text-slate-400">
            Upload a PDF to run a rapid forensic scan and surface revenue leaks.
          </p>
        </section>

        {status === "idle" ? (
          <>
            {error && (
              <div className="mb-6 rounded-xl border border-red-400 bg-red-950/80 px-6 py-4 font-mono text-sm text-red-200 shadow">
                {error}
              </div>
            )}
            <UploadZone onFileSelected={handleFileSelected} />
          </>
        ) : null}

        <div
          className={`transition-opacity duration-700 ${
            isCompleted || isLead ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          {status !== "idle" ? <BadgerScanner previewUrl={previewUrl ?? undefined} /> : null}
        </div>

        {/* TacticalDashboard blurred background with modal overlay for LeadCapture */}
        {isLead && auditData ? (
          <>
            {/* Scroll lock on modal open */}
            <style>{`body { overflow: hidden !important; }`}</style>
            <div className="relative">
              <div className="pointer-events-none select-none">
                <div className="fixed inset-0 z-0">
                  <div className="h-full w-full">
                    <div className="h-full w-full blur-lg">
                      <TacticalDashboard audit={auditData} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
                <LeadCapture
                  initialData={{
                    processorName: auditData.sourceName,
                    totalVolume: auditData.summary?.totalFindings,
                    annualWaste: auditData.summary?.highRiskCount,
                  }}
                  onSuccess={() => {
                    // Save the audit data to localStorage for dashboard handoff
                    if (auditData) {
                      localStorage.setItem('badger-latest-audit', JSON.stringify({
                        date: auditData.createdAt || new Date().toISOString().slice(0, 10),
                        savings: auditData.summary?.overallScore || 0,
                        effectiveRate: 2.9, // fallback or extract if available
                        status: 'Completed',
                      }));
                    }
                    window.location.href = '/dashboard?from=lead';
                  }}
                  modal
                />
              </div>
            </div>
          </>
        ) : null}

        {/* Unblurred TacticalDashboard after unlock */}
        <div
          className={`transition-opacity duration-700 ${
            isCompleted ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          {auditData && leadSaved ? <TacticalDashboard audit={auditData} /> : null}
        </div>
      </main>
    </div>
  );
}
