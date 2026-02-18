
"use client";
import { useRouter } from "next/navigation";
// @ts-ignore
let signOutGlobal: ((opts: any) => Promise<void>) | undefined = undefined;
try { signOutGlobal = require('next-auth/react').signOut; } catch {}

import { useEffect, useMemo, useState } from "react";
import { useRef } from "react";
import { Archive, FileUp, ScanSearch, Microscope, ShieldAlert, Gavel } from "lucide-react";

import BadgerScanner from "@/components/BadgerScanner";
import TacticalDashboard from "@/components/TacticalDashboard";
import UploadZone from "@/components/UploadZone";
import LeadCapture from "@/components/LeadCapture";
import type { BadgerAudit } from "@/types";

type AuditStatus = "idle" | "scanning" | "lead" | "completed";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function Home() {
      function handleFileSelected(file: File) {
        if (file) {
          const url = URL.createObjectURL(file);
          setPreviewUrl(url);
          setStatus('scanning');
        }
      }
    const router = useRouter();

    async function handleLogout() {
      if (typeof window !== 'undefined') {
        localStorage.clear();
        sessionStorage.clear();
        if (typeof signOutGlobal === 'function') {
          await signOutGlobal({ callbackUrl: '/', redirect: true });
        } else {
          router.replace('/');
        }
        setIsLoggedIn(false);
      }
    }
  const [status, setStatus] = useState<AuditStatus>("idle");
  const [auditData, setAuditData] = useState<BadgerAudit | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [leadSaved, setLeadSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isScanning = status === "scanning";
  const isLead = status === "lead";
  const isCompleted = status === "completed";
  const [pricingMode, setPricingMode] = useState<'annual' | 'monthly'>("annual");
  const [showQuickAudit, setShowQuickAudit] = useState(false);
  const [quickAuditStep, setQuickAuditStep] = useState<'email' | 'upload' | 'scanning'>("email");
  const [quickAuditEmail, setQuickAuditEmail] = useState('');
  const [quickAuditFile, setQuickAuditFile] = useState<File | null>(null);
  const scanningTimeout = useRef<NodeJS.Timeout | null>(null);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const email = localStorage.getItem('user_email');
      setIsLoggedIn(!!email);
    }
  }, []);

  useEffect(() => {
    // ...existing effect logic...
  }, [previewUrl]);

  // Remove login redirect: homepage is always public
  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white relative overflow-x-hidden">
      {/* Fixed Site Header */}
      <header className="den-header fixed top-0 left-0 right-0 w-full z-50 flex items-center px-6 py-4" style={{minHeight:'64px'}}>
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
        {/* Auth Buttons Far Right */}
        <div className="flex-1 flex justify-end gap-2">
          {isLoggedIn ? (
            <>
              <a
                href="/dashboard"
                className="rounded-full px-5 py-2 text-sm font-bold border border-[#F29C1F] text-[#F29C1F] bg-transparent hover:bg-[#F29C1F]/10 transition-all shadow-sm"
              >
                Dashboard
              </a>
              <button
                className="rounded-full px-5 py-2 text-sm font-bold border border-[#F29C1F] text-[#F29C1F] bg-transparent hover:bg-[#F29C1F]/10 transition-all shadow-sm"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <a
              href="/login"
              className="rounded-full px-5 py-2 text-sm font-bold border border-[#F29C1F] text-[#F29C1F] bg-transparent hover:bg-[#F29C1F]/10 transition-all shadow-sm"
            >
              Sign In
            </a>
          )}
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
              <Archive className="mb-4 text-4xl w-12 h-12 copper-glow" />
              <h3 className="font-bold text-lg mb-2">Phase 1: Upload</h3>
              <p className="text-slate-400">Drop your merchant statement PDF into the Den.</p>
            </div>
            <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-8 flex flex-col items-center text-center shadow-lg">
              <ScanSearch className="mb-4 text-4xl w-12 h-12 copper-glow" />
              <h3 className="font-bold text-lg mb-2">Phase 2: Dissect</h3>
              <p className="text-slate-400">Our AI hunts for Interchange plus-plus markup and junk fees.</p>
            </div>
            <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-8 flex flex-col items-center text-center shadow-lg">
              <ShieldAlert className="mb-4 text-4xl w-12 h-12 copper-glow" />
              <h3 className="font-bold text-lg mb-2">Phase 3: Strike</h3>
              <p className="text-slate-400">We generate a 'Certificate of Findings' to force a rate reduction or switch providers.</p>
            </div>
          </div>
        </section>
        {/* Pricing Section */}
        <section id="pricing" className="w-full max-w-xl mx-auto flex flex-col items-center gap-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">Pricing</h2>
          {/* Toggle Switch */}
          <div className="flex items-center gap-4 mb-4">
            <span className={`font-bold text-sm ${pricingMode==='annual' ? 'text-[#F29C1F]' : 'text-slate-400'}`}>Annual</span>
            <button
              className={`relative w-14 h-8 bg-zinc-800 rounded-full border-2 border-zinc-700 flex items-center transition-colors duration-200 focus:outline-none`}
              onClick={() => setPricingMode(pricingMode === 'annual' ? 'monthly' : 'annual')}
              aria-label="Toggle pricing mode"
            >
              <span className={`absolute left-1 top-1 w-6 h-6 rounded-full bg-[#F29C1F] shadow transition-transform duration-200 ${pricingMode==='annual' ? '' : 'translate-x-6'}`}></span>
            </button>
            <span className={`font-bold text-sm ${pricingMode==='monthly' ? 'text-[#F29C1F]' : 'text-slate-400'}`}>Monthly</span>
          </div>
          {/* Single Pricing Card */}
          <div className="relative bg-zinc-950 border-2 border-[#F29C1F] rounded-2xl p-10 flex flex-col items-center shadow-xl w-full max-w-md">
            {pricingMode === 'annual' && (
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#F29C1F] text-zinc-950 text-xs font-bold px-4 py-1 rounded-full shadow">Most Popular / Best Value</span>
            )}
            <h3 className="text-xl font-bold mb-1">Tactical Dashboard</h3>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-4xl font-black">
                {pricingMode === 'annual' ? '$180' : '$20'}
              </span>
              <span className="text-base text-slate-400 font-semibold">
                {pricingMode === 'annual' ? '/ year' : '/ month'}
              </span>
            </div>
            {pricingMode === 'annual' && (
              <div className="text-sm text-slate-400 mb-2">($15 per month)</div>
            )}
            <ul className="mb-4 space-y-1 text-slate-200 text-center">
              <li>✔️ Full Forensic Audits</li>
              <li>✔️ Interchange++ Detection</li>
              <li>✔️ Strike Report Generation</li>
            </ul>
            <button className="mt-2 px-8 py-3 rounded-full bg-[#F29C1F] text-zinc-950 font-bold shadow hover:bg-[#D4AF37] transition-all w-full">Get Started</button>
            <button
              className="mt-4 text-sm text-[#F29C1F] underline underline-offset-2 hover:text-[#D4AF37] transition-all"
              onClick={() => { setShowQuickAudit(true); setQuickAuditStep('email'); setQuickAuditEmail(''); setQuickAuditFile(null); }}
            >
              Just want a sneak peek? Try a Free Audit
            </button>
          </div>
        </section>
        {/* Quick Audit Modal */}
        {showQuickAudit && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl p-8 w-full max-w-md flex flex-col items-center relative">
              <button className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-200 text-2xl font-bold" onClick={() => setShowQuickAudit(false)} aria-label="Close">×</button>
              {quickAuditStep === 'email' && (
                <>
                  <h3 className="text-xl font-bold mb-2">Try a Free Audit</h3>
                  <p className="text-slate-400 mb-4 text-center">Enter your email to get started:</p>
                  <input
                    type="email"
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 mb-4 text-white focus:outline-none focus:ring-2 focus:ring-[#F29C1F]"
                    placeholder="you@email.com"
                    value={quickAuditEmail}
                    onChange={e => setQuickAuditEmail(e.target.value)}
                  />
                  <button
                    className="w-full rounded-full bg-[#F29C1F] text-zinc-950 font-bold py-3 hover:bg-[#D4AF37] transition-all"
                    disabled={!quickAuditEmail || !quickAuditEmail.includes('@')}
                    onClick={() => setQuickAuditStep('upload')}
                  >Continue</button>
                </>
              )}
              {quickAuditStep === 'upload' && (
                <>
                  <h3 className="text-xl font-bold mb-2">Upload Your Statement</h3>
                  <p className="text-slate-400 mb-4 text-center">PDF only. No spam, ever.</p>
                  <input
                    type="file"
                    accept="application/pdf"
                    className="mb-4"
                    onChange={e => {
                      if (e.target.files && e.target.files[0]) {
                        setQuickAuditFile(e.target.files[0]);
                      }
                    }}
                  />
                  <button
                    className="w-full rounded-full bg-[#F29C1F] text-zinc-950 font-bold py-3 hover:bg-[#D4AF37] transition-all"
                    disabled={!quickAuditFile}
                    onClick={() => {
                      setQuickAuditStep('scanning');
                      scanningTimeout.current = setTimeout(() => {
                        setShowQuickAudit(false);
                        // Redirect to /preview with savings, issues, totalFees, volume, junkFees
                        const savings = auditData?.summary?.overallScore || 0;
                        const issues = auditData?.summary?.highRiskCount || 3;
                        const business = auditData?.sourceName || '';
                        const date = auditData?.createdAt || new Date().toISOString().slice(0, 10);
                        // Fallbacks: try to infer or default
                        let totalFees = 0;
                        let volume = 0;
                        let junkFees = 0;
                        if (auditData && 'summary' in auditData) {
                          // Try to infer from findings if possible
                          if (Array.isArray(auditData.findings)) {
                            const findingsAny = auditData.findings as any[];
                            totalFees = findingsAny.reduce((sum, f) => {
                              if (typeof f.amount === 'number') return sum + f.amount;
                              if (typeof f.confidence === 'number') return sum + f.confidence;
                              return sum;
                            }, 0);
                            // Junk fees: count or sum of findings with 'junk' in title/category/description
                            junkFees = findingsAny.filter(f => (f.title || f.category || f.description || '').toLowerCase().includes('junk')).reduce((sum, f) => {
                              if (typeof f.amount === 'number') return sum + f.amount;
                              if (typeof f.confidence === 'number') return sum + f.confidence;
                              return sum;
                            }, 0);
                          }
                          // Use totalFindings as volume fallback if plausible
                          volume = auditData.summary.totalFindings || 0;
                        }
                        window.location.href = `/preview?savings=${encodeURIComponent(savings)}&issues=${encodeURIComponent(issues)}&business=${encodeURIComponent(business)}&date=${encodeURIComponent(date)}&rate=2.9&status=Audit%20Dispatched&totalFees=${encodeURIComponent(totalFees)}&volume=${encodeURIComponent(volume)}&junkFees=${encodeURIComponent(junkFees)}`;
                      }, 5000);
                    }}
                  >Scan Now</button>
                </>
              )}
              {quickAuditStep === 'scanning' && (
                <>
                  <h3 className="text-xl font-bold mb-4">Scanning...</h3>
                  <div className="w-20 h-20 rounded-full border-4 border-[#F29C1F] border-t-transparent animate-spin mb-4 mx-auto"></div>
                  <p className="text-slate-400 text-center">The Badger is analyzing your statement. This will only take a moment.</p>
                </>
              )}
            </div>
          </div>
        )}
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
                // Redirect to /preview with savings, issues, totalFees, volume, junkFees
                const savings = auditData?.summary?.overallScore || 0;
                const issues = auditData?.summary?.highRiskCount || 3;
                const business = auditData?.sourceName || '';
                const date = auditData?.createdAt || new Date().toISOString().slice(0, 10);
                // Fallbacks: try to infer or default
                let totalFees = 0;
                let volume = 0;
                let junkFees = 0;
                if (auditData && 'summary' in auditData) {
                  if (Array.isArray(auditData.findings)) {
                    const findingsAny = auditData.findings as any[];
                    totalFees = findingsAny.reduce((sum, f) => {
                      if (typeof f.amount === 'number') return sum + f.amount;
                      if (typeof f.confidence === 'number') return sum + f.confidence;
                      return sum;
                    }, 0);
                    junkFees = findingsAny.filter(f => (f.title || f.category || f.description || '').toLowerCase().includes('junk')).reduce((sum, f) => {
                      if (typeof f.amount === 'number') return sum + f.amount;
                      if (typeof f.confidence === 'number') return sum + f.confidence;
                      return sum;
                    }, 0);
                  }
                  volume = auditData.summary.totalFindings || 0;
                }
                window.location.href = `/preview?savings=${encodeURIComponent(savings)}&issues=${encodeURIComponent(issues)}&business=${encodeURIComponent(business)}&date=${encodeURIComponent(date)}&rate=2.9&status=Completed&totalFees=${encodeURIComponent(totalFees)}&volume=${encodeURIComponent(volume)}&junkFees=${encodeURIComponent(junkFees)}`;
              }}
              modal
            />
          ) : null}
        </div>
      </main>
    </div>
  );
}
