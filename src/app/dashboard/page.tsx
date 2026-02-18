"use client";

import React, { useState } from "react";
import CertificateOfFindingsSneakPeek from "@/components/CertificateOfFindingsSneakPeek";
import CertificateOfFindings from "@/components/CertificateOfFindings";
import Head from "next/head";
import Image from "next/image";
import ForensicInsights from "@/components/ForensicInsights";

// Mock user and audit data
const MOCK_USER = {
  businessName: "Acme Corp",
};

// Utility: Extract statement month from file name or fallback to date
function getStatementMonth(fileName: string, date: string) {
  const match = fileName.match(/_(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)_\d{4}/i);
  if (match) return match[0].replace(/_/g, '').replace('.pdf', '');
  const d = new Date(date);
  return d.toLocaleString('default', { month: 'short', year: 'numeric' });
}
const MOCK_AUDITS = [
  {
    id: 1,
    fileName: "Merchant_Statement_Jan_2026.pdf",
    date: "2026-01-31",
    savings: 142.50,
    effectiveRate: 2.9,
    status: "Audit Dispatched"
  },
  {
    id: 2,
    fileName: "Merchant_Statement_Dec_2025.pdf",
    date: "2025-12-31",
    savings: 198.20,
    effectiveRate: 3.1,
    status: "Savings Verified"
  },
  {
    id: 3,
    fileName: "Merchant_Statement_Nov_2025.pdf",
    date: "2025-11-30",
    savings: 155.00,
    effectiveRate: 3.0,
    status: "Historical"
  }
];

export default function BadgerDen() {
  // Check for redirect from lead and load audit if present
  const [audits, setAudits] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('badger-latest-audit');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          return [...MOCK_AUDITS, parsed];
        } catch {}
      }
    }
    return MOCK_AUDITS;
  });
  const businessName = MOCK_USER.businessName;
  const [view, setView] = useState(() => {
    if (typeof window !== 'undefined' && window.location.search.includes('from=lead')) {
      return 'certificate';
    }
    return 'overview';
  });
  const [latestAudit, setLatestAudit] = useState<any | null>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('badger-latest-audit');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {}
      }
    }
    return null;
  });
  const [userTier, setUserTier] = useState<'free' | 'pro'>('free');

  // Move these state hooks to the top-level to fix reference errors
  const [highlightedRows, setHighlightedRows] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  // Branding: logo and title always visible
  // Metrics
  const totalWaste = audits.reduce((sum, a) => sum + a.savings, 0);
  const verifiedSavings = audits.filter(a => a.status === 'Savings Verified').reduce((sum, a) => sum + a.savings, 0);
    const [showVerifyModal, setShowVerifyModal] = useState<{ open: boolean, audit: any | null }>({ open: false, audit: null });
    const [showConfetti, setShowConfetti] = useState(false);
  const activeNegotiations = audits.filter(a => a.status === 'Audit Dispatched' || a.status === 'In Progress').length;
  // Scanner state
  const [isScanning, setIsScanning] = useState(false);

  // Simulate scan completion and add a new audit
  const handleAuditNewStatement = async () => {
    setView('scanner');
    setIsScanning(true);
    // Simulate scan delay
    setTimeout(() => {
      const newAudit = {
        id: audits.length + 1,
        fileName: `Merchant_Statement_${Date.now()}.pdf`,
        date: new Date().toISOString().slice(0, 10),
        savings: Math.floor(Math.random() * 2000) + 500,
        effectiveRate: parseFloat((Math.random() * 2 + 2).toFixed(2)),
        status: 'Completed',
      };
      setAudits([...audits, newAudit]);
      setLatestAudit(newAudit);
      setIsScanning(false);
      setView('certificate');
    }, 2500);
  };

  // Handle viewing a certificate for a specific audit
  const handleViewCertificate = (audit: any) => {
    setLatestAudit(audit);
    setView('certificate');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-slate-200 font-sans p-0">
      <Head>
        <title>The Badger Den</title>
        <meta name="description" content="The Badger Den: Forensic Audit Portal" />
      </Head>
        {/* The rest of the dashboard content remains unchanged */}
        {/* High-end Blurred Header */}
        <header className="flex items-center justify-between px-8 py-5 bg-zinc-900/50 backdrop-blur-md border-b border-zinc-800 shadow-lg">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Copper Badger Logo" className="h-10 w-auto" />
            <span className="text-2xl font-black tracking-tight" style={{ color: '#F29C1F' }}>The Badger Den</span>
          </div>
          <button className="rounded-full px-5 py-2 font-bold text-sm bg-zinc-800/80 text-slate-200 border border-zinc-700 hover:bg-zinc-900/80 transition-all shadow" style={{letterSpacing:2}}>
            Logout
          </button>
        </header>
        {/* Hero Row: 3 Cards + Red Flags */}
        <section className="max-w-6xl mx-auto py-10 px-4">
          <div className="flex flex-col md:flex-row gap-6 justify-center items-stretch w-full">
            {/* Card 1: The Mission */}
            <div className="flex-1 flex items-center justify-center">
              <button
                className="w-full md:w-auto px-10 py-8 rounded-2xl font-black text-xl uppercase tracking-wider bg-zinc-950 border-4 border-amber-500 animate-pulse border-opacity-60 shadow-lg text-amber-400 hover:bg-zinc-900/80 hover:border-amber-400 transition-all"
                style={{ boxShadow: '0 0 0 2px #F29C1F33' }}
                onClick={handleAuditNewStatement}
              >
                New Forensic Audit
              </button>
            </div>
            {/* Card 2: The Target */}
            <div
              className="flex-1 flex flex-col items-center justify-center bg-zinc-900/60 rounded-2xl shadow-lg p-8 cursor-pointer transition-all hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:ring-2 hover:ring-[#D4AF37] relative"
              onClick={() => {
                const auditHistory = document.getElementById('audit-history');
                if (auditHistory) {
                  window.scrollTo({ top: auditHistory.offsetTop - 100, behavior: 'smooth' });
                }
                setHighlightedRows(true);
                setTimeout(() => setHighlightedRows(false), 1800);
              }}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <div className="text-xs font-bold uppercase tracking-widest mb-2 text-slate-400">Identified Annual Waste</div>
              <div className="text-4xl md:text-5xl font-black mb-1" style={{ color: '#F29C1F' }}>
                ${totalWaste.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              {showTooltip && (
                <div className="absolute bottom-2 right-2 bg-zinc-800 text-xs text-amber-400 px-3 py-1 rounded shadow-lg animate-fadeIn">
                  Click to see details
                </div>
              )}
            </div>
            {/* Card 3: Forensic Insights (Dynamic) */}
            <div className="flex-1 flex flex-col items-center justify-center">
              <ForensicInsights
                userTier={userTier}
                onViewCertificate={() => setView('certificate')}
              />
            </div>
            {/* Card 4: The Status */}
            <div className="flex-1 flex flex-col items-center justify-center bg-zinc-900/60 rounded-2xl shadow-lg p-8">
              <div className="text-xs font-bold uppercase tracking-widest mb-2 text-slate-400">Active Negotiations</div>
              <span className="inline-block px-5 py-2 rounded-full font-bold text-base bg-emerald-900/40 text-emerald-400 border border-emerald-700 tracking-wide">
                {activeNegotiations}
              </span>
            </div>
          </div>
        </section>
      {/* Red Flag Pulse Animation */}
      <style>{`
        @keyframes redFlagPulse {
          0% { box-shadow: 0 0 15px 0 rgba(239,68,68,0.08); }
          50% { box-shadow: 0 0 30px 0 rgba(239,68,68,0.18); }
          100% { box-shadow: 0 0 15px 0 rgba(239,68,68,0.08); }
        }
        .animate-redFlagPulse {
          animation: redFlagPulse 3.5s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulse 2.5s cubic-bezier(0.4,0,0.6,1) infinite;
        }
      `}</style>
      {/* Vault: Audit History List */}
      <main className="max-w-3xl mx-auto px-4 pb-16">
        <div className="text-lg font-bold text-slate-200 mb-2 mt-2">Vault</div>
        {/* Quick Filters */}
        <div className="flex gap-2 mb-4">
          {["All", "Verified", "In Progress"].map((filter) => (
            <button
              key={filter}
              className={
                "px-4 py-2 rounded-full text-xs font-bold border border-zinc-700 bg-transparent text-slate-300 transition-all " +
                (activeFilter === filter
                  ? "bg-[#D4AF37] text-zinc-900 border-[#D4AF37]"
                  : "hover:bg-[#D4AF37]/10 hover:text-[#D4AF37]")
              }
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
        <div
          id="audit-history"
          className="divide-y divide-zinc-800 bg-zinc-950/80 rounded-xl overflow-hidden shadow-lg"
        >
          <div className="grid grid-cols-4 gap-2 px-6 py-3 text-xs font-bold uppercase tracking-widest text-slate-400 bg-zinc-900/60">
            <div>Date</div>
            <div>Business</div>
            <div>Potential Savings</div>
            <div>Status</div>
          </div>
          {audits
            .filter((audit) => {
              if (activeFilter === "All") return true;
              if (activeFilter === "Verified") return audit.status === "Savings Verified";
              if (activeFilter === "In Progress") return audit.status === "In Progress";
              return true;
            })
            .map((audit) => (
              <div
                key={audit.id}
                className={
                  "grid grid-cols-4 items-center hover:bg-zinc-800/30 transition-colors" +
                  (highlightedRows &&
                  (audit.status === "Audit Dispatched" || audit.status === "Savings Verified")
                    ? " animate-copperPulse bg-[#D4AF37]/10"
                    : "")
                }
              >
                <div className="p-4 text-zinc-400">{audit.date}</div>
                <div className="p-4 font-medium">
                  {getStatementMonth(audit.fileName, audit.date)}
                </div>
                <div className="p-4 font-bold" style={{ color: "#F29C1F" }}>
                  ${audit.savings.toLocaleString()}
                </div>
                <div className="p-4 flex gap-2 items-center">
                  {/* Status Badge Logic */}
                  {(() => {
                    let statusLabel = audit.status;
                    let badgeClass =
                      "inline-flex items-center justify-center whitespace-nowrap min-w-[120px] border px-3 py-1 rounded-full text-xs font-medium ";
                    let badgeStyle = {};
                    let tooltip = null;
                    if (audit.status === "Savings Verified") {
                      statusLabel = "Savings Verified";
                      badgeClass +=
                        " border-[#D4AF37] text-[#D4AF37] bg-[#D4AF37]/10";
                      badgeStyle = {
                        borderColor: "#D4AF37",
                        color: "#D4AF37",
                        background: "rgba(212,175,55,0.10)",
                      };
                    } else if (
                      audit.status === "Audit Dispatched" ||
                      audit.status === "In Progress"
                    ) {
                      statusLabel = "Negotiation Active";
                      badgeClass +=
                        " border-blue-400 text-blue-400 bg-blue-400/10 animate-pulse";
                      badgeStyle = {
                        borderColor: "#60A5FA",
                        color: "#60A5FA",
                        background: "rgba(96,165,250,0.10)",
                      };
                    } else if (audit.status === "Verification Failed") {
                      statusLabel = "Contact Processor";
                      badgeClass +=
                        " border-amber-500 text-amber-500 bg-amber-100/10";
                      badgeStyle = {
                        borderColor: "#f59e42",
                        color: "#f59e42",
                        background: "rgba(251,191,36,0.10)",
                      };
                      tooltip =
                        "The rate drop was not confirmed. Please contact your processor or escalate the dispute.";
                    } else if (
                      audit.status === "Historical" ||
                      audit.status === "Completed"
                    ) {
                      if (audit.savings > 0) {
                        statusLabel = "Savings Identified";
                        badgeClass +=
                          " border-amber-400 text-amber-400 bg-amber-400/10";
                        badgeStyle = {
                          borderColor: "#F29C1F",
                          color: "#F29C1F",
                          background: "rgba(242,156,31,0.10)",
                        };
                        tooltip = `The Badger has identified $${audit.savings.toFixed(
                          2
                        )} in overcharges. Click View Certificate to start the recovery process.`;
                      } else {
                        statusLabel = "Audit Sealed";
                        badgeClass +=
                          " border-zinc-400 text-zinc-400 bg-zinc-400/10";
                        badgeStyle = {
                          borderColor: "#a1a1aa",
                          color: "#a1a1aa",
                          background: "rgba(161,161,170,0.10)",
                        };
                      }
                    } else {
                      statusLabel = audit.status;
                      badgeClass +=
                        " border-zinc-400 text-zinc-400 bg-zinc-400/10";
                      badgeStyle = {
                        borderColor: "#a1a1aa",
                        color: "#a1a1aa",
                        background: "rgba(161,161,170,0.10)",
                      };
                    }
                    return (
                      <>
                        <span className={badgeClass} style={badgeStyle}>
                          {statusLabel}
                        </span>
                        {tooltip && (
                          <span className="relative group cursor-pointer ml-1">
                            <span className="w-4 h-4 flex items-center justify-center rounded-full bg-zinc-200 text-zinc-700 text-xs font-bold border border-zinc-400">
                              i
                            </span>
                            <span className="absolute left-1/2 -translate-x-1/2 mt-2 w-64 bg-black text-white text-xs rounded p-2 opacity-0 group-hover:opacity-100 pointer-events-none z-50 transition-opacity duration-200 shadow-lg">
                              {tooltip}
                            </span>
                          </span>
                        )}
                      </>
                    );
                  })()}
                  <button
                    className="rounded-full text-xs font-bold px-4 py-2 border border-amber-400 text-amber-400 hover:bg-amber-400/10 transition-all"
                    onClick={() => handleViewCertificate(audit)}
                  >
                    {audit.status === "Verification Failed"
                      ? "Escalate Dispute"
                      : "View Certificate"}
                  </button>
                  {audit.status === "Audit Dispatched" && (
                    <button
                      className="rounded-full text-xs font-bold px-4 py-2 border border-green-500 text-green-500 hover:bg-green-500/10 transition-all"
                      onClick={() => setShowVerifyModal({ open: true, audit })}
                    >
                      Confirm Rate Drop
                    </button>
                  )}
                </div>
              </div>
            ))}
          {/* Highlight state hooks moved to top-level */}
          <style>{`
            @keyframes copperPulse {
              0% { background: transparent; }
              50% { background: #D4AF3733; }
              100% { background: transparent; }
            }
            .animate-copperPulse {
              animation: copperPulse 1.2s ease-in-out 2;
            }
            .animate-fadeIn {
              animation: fadeIn 0.3s ease;
            }
          `}</style>
        </div>
      </main>
      {/* Verification Modal (still available for confirm flow) */}
      {showVerifyModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white text-black rounded-xl shadow-xl p-8 max-w-sm w-full flex flex-col items-center relative">
            {/* X Close Button */}
            <button
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-700 text-2xl font-bold focus:outline-none"
              aria-label="Close"
              onClick={() => setShowVerifyModal({ open: false, audit: null })}
            >
              ×
            </button>
            <div className="text-xl font-bold mb-4">Did your processor confirm the rate adjustment?</div>
            <div className="flex gap-4 mt-2">
              <button
                className="rounded-full bg-green-500 text-white font-bold px-6 py-2 hover:bg-green-600 transition-all"
                onClick={() => {
                  setAudits(audits => audits.map(a => a.id === showVerifyModal.audit.id ? { ...a, status: 'Savings Verified' } : a));
                  setShowVerifyModal({ open: false, audit: null });
                  setShowConfetti(true);
                  setTimeout(() => setShowConfetti(false), 2000);
                }}
              >
                Yes
              </button>
              <button
                className="rounded-full bg-amber-400 text-black font-bold px-6 py-2 hover:bg-amber-500 transition-all"
                onClick={() => {
                  // Set status to Verification Failed for follow-up
                  setAudits(audits => audits.map(a => a.id === showVerifyModal.audit.id ? { ...a, status: 'Verification Failed' } : a));
                  setShowVerifyModal({ open: false, audit: null });
                }}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <img src="/confetti.gif" alt="Confetti" className="w-80 h-80" />
        </div>
      )}
    </div>
  );
}
