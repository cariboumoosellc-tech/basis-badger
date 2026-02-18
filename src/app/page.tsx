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
    <div className="min-h-screen bg-[#0D0D0D] text-white relative overflow-x-hidden">
      {/* Fixed Site Header */}
      <header className="fixed top-0 left-0 right-0 w-full z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800 flex items-center px-6 py-4" style={{minHeight:'64px'}}>
        {/* Logo Far Left with Aurora Glow */}
        <div className="flex-1 flex items-center relative">
          <span className="aurora-glow" aria-hidden="true"></span>
          <img src="/logo.png" alt="Basis Badger Logo" className="h-12 w-auto relative z-10" />
        </div>
        {/* Center Nav Links */}
        <nav className="flex-1 flex justify-center gap-8">
          <a href="/#how-it-works" className="text-sm font-semibold text-slate-300 hover:text-[#F29C1F] transition-all">How it Works</a>
          <a href="/#pricing" className="text-sm font-semibold text-slate-300 hover:text-[#F29C1F] transition-all">Pricing</a>
        </nav>
        {/* Sign In Far Right */}
        <div className="flex-1 flex justify-end">
          <a href="/dashboard" className="rounded-full px-5 py-2 text-sm font-bold border border-[#F29C1F] text-[#F29C1F] bg-transparent hover:bg-[#F29C1F]/10 transition-all shadow-sm">
            Sign In
          </a>
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-20 px-6 pt-32 pb-20 relative">
        {/* Hero Section */}
        <section className="relative flex flex-col items-center justify-center text-center gap-6 mt-8">
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white drop-shadow-lg" style={{letterSpacing:'-0.03em', lineHeight:1.1}}>
            Tactical Audit Intelligence
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-2xl text-slate-300 font-medium">
            Stop letting credit card processors bleed your margins. Our Badger-led forensic engine hunts down the hidden fees they hope you never see.
          </p>
          <button
            className="mt-6 px-10 py-4 rounded-full bg-[#F29C1F] text-zinc-950 font-extrabold text-lg shadow-lg hover:bg-[#D4AF37] transition-all focus:outline-none focus:ring-2 focus:ring-[#F29C1F]/60 focus:ring-offset-2"
            onClick={() => setStatus('lead')}
          >
            Release the Badger
          </button>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="w-full max-w-5xl mx-auto flex flex-col items-center gap-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-8 flex flex-col items-center text-center shadow-lg">
              <div className="mb-4 text-4xl">📤</div>
              <h3 className="font-bold text-lg mb-2">Phase 1: Upload</h3>
              <p className="text-slate-400">Drop your merchant statement PDF into the Den.</p>
            </div>
            <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-8 flex flex-col items-center text-center shadow-lg">
              <div className="mb-4 text-4xl">🔬</div>
              <h3 className="font-bold text-lg mb-2">Phase 2: Dissect</h3>
              <p className="text-slate-400">Our AI hunts for Interchange plus-plus markup and junk fees.</p>
            </div>
            <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-8 flex flex-col items-center text-center shadow-lg">
              <div className="mb-4 text-4xl">⚡️</div>
              <h3 className="font-bold text-lg mb-2">Phase 3: Strike</h3>
              <p className="text-slate-400">We generate a 'Certificate of Findings' to force a rate reduction or switch providers.</p>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="w-full max-w-4xl mx-auto flex flex-col items-center gap-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
            {/* Annual Plan */}
            <div className="relative bg-zinc-950 border-2 border-[#F29C1F] rounded-2xl p-8 flex flex-col items-start shadow-xl">
              <span className="absolute -top-4 left-4 bg-[#F29C1F] text-zinc-950 text-xs font-bold px-4 py-1 rounded-full shadow">Most Popular / Best Value</span>
              <h3 className="text-xl font-bold mb-1">Pro Badger (Annual)</h3>
              <div className="flex items-end gap-2 mb-2">
                <span className="text-4xl font-black">$180</span>
                <span className="text-base text-slate-400 font-semibold">/ year</span>
              </div>
              <div className="text-sm text-slate-400 mb-2">($15 per month)</div>
              <ul className="mb-4 space-y-1 text-slate-200">
                <li>✔️ Unlimited Audits</li>
                <li>✔️ Full Forensic Reports</li>
                <li>✔️ 24/7 Monitoring</li>
              </ul>
              <button className="mt-auto px-6 py-2 rounded-full bg-[#F29C1F] text-zinc-950 font-bold shadow hover:bg-[#D4AF37] transition-all w-full">Get Pro Badger</button>
            </div>
            {/* Monthly Plan */}
            <div className="bg-zinc-950 border-2 border-zinc-800 rounded-2xl p-8 flex flex-col items-start shadow-xl">
              <h3 className="text-xl font-bold mb-1">Tactical (Monthly)</h3>
              <div className="flex items-end gap-2 mb-2">
                <span className="text-4xl font-black">$20</span>
                <span className="text-base text-slate-400 font-semibold">/ month</span>
              </div>
              <ul className="mb-4 space-y-1 text-slate-200">
                <li>✔️ Single Statement Audits</li>
                <li>✔️ Basic Fee Detection</li>
              </ul>
              <button className="mt-auto px-6 py-2 rounded-full bg-zinc-800 text-[#F29C1F] font-bold border border-[#F29C1F] shadow hover:bg-[#F29C1F] hover:text-zinc-950 transition-all w-full">Get Tactical</button>
            </div>
          </div>
        </section>

        {/* Upload/Scanner/Lead Modal Logic (hidden, but still functional) */}
        <div className="hidden">
          {status === "idle" ? (
            <UploadZone onFileSelected={handleFileSelected} />
          ) : null}
          {status !== "idle" ? <BadgerScanner previewUrl={previewUrl ?? undefined} /> : null}
          {isLead && auditData ? (
            <LeadCapture
              initialData={{
                processorName: auditData.sourceName,
                totalVolume: auditData.summary?.totalFindings,
                annualWaste: auditData.summary?.highRiskCount,
              }}
              onSuccess={() => {
                if (auditData) {
                  localStorage.setItem('badger-latest-audit', JSON.stringify({
                    date: auditData.createdAt || new Date().toISOString().slice(0, 10),
                    savings: auditData.summary?.overallScore || 0,
                    effectiveRate: 2.9,
                    status: 'Completed',
                  }));
                }
                window.location.href = '/dashboard?from=lead';
              }}
              modal
            />
          ) : null}
        </div>
      </main>
    </div>
  );
}
