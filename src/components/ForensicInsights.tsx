"use client";

import React, { useState } from "react";

interface RedFlag {
  name: string;
  amount: number;
  reasoning?: string;
}

interface Benchmark {
  category: string;
  merchantValue: number;
  industryAvg: number;
  unit: string;
}

interface LiveAlert {
  message: string;
  severity: "warning" | "critical";
}

interface ForensicInsightsProps {
  userTier: "free" | "pro";
  isPro?: boolean;
  redFlags?: RedFlag[];
  benchmarks?: Benchmark[];
  liveAlerts?: LiveAlert[];
  onViewCertificate?: () => void;
}

const ForensicInsights: React.FC<ForensicInsightsProps> = ({
  userTier,
  isPro = false,
  redFlags = [
    { name: "PCI Non-Compliance", amount: 29.95 },
    { name: "Interchange Padding", amount: 14.2 },
    { name: "Statement Fee", amount: 9.99 },
  ],
  benchmarks = [
    { category: "Effective Rate", merchantValue: 3.12, industryAvg: 2.65, unit: "%" },
    { category: "Monthly Fees", merchantValue: 89.99, industryAvg: 54.50, unit: "$" },
  ],
  liveAlerts = [
    { message: "PCI compliance deadline in 7 days.", severity: "warning" },
    { message: "Processor fee increase effective next month.", severity: "critical" },
  ],
  onViewCertificate,
}) => {
  const [state, setState] = useState<0 | 1 | 2>(0);
  const states = ["Red Flags", "Benchmarking", "Live Alerts"];

  const handleNext = () => setState((prev) => ((prev + 1) % 3) as 0 | 1 | 2);

  return (
    <div
      className="w-full bg-zinc-900/60 rounded-2xl shadow-lg p-8 border-2 animate-redFlagPulse relative"
      style={{
        borderColor: "rgba(239,68,68,0.5)",
        boxShadow: "0 0 15px 0 rgba(239,68,68,0.1)",
        minHeight: 220,
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="text-lg font-black flex items-center gap-2">
          <span className="text-red-500">🚩</span> Forensic Intelligence: {states[state]}
        </div>
        <button
          className="text-xs text-amber-400 hover:text-[#D4AF37] px-2 py-1 rounded transition-all flex items-center gap-1"
          onClick={handleNext}
          aria-label="Next insight"
        >
          Next <span className="material-icons" style={{fontSize:'1.1rem'}}>&#8594;</span>
        </button>
      </div>
      {state === 0 && (
        <ul className="mb-3">
          {redFlags.slice(0, 3).map(function(flag: RedFlag, i: number) {
            return (
              <li key={i} className="flex flex-col gap-0 mb-2">
                <div className="flex items-center gap-2 text-base">
                  <span className="text-red-400">🚩</span>
                  {isPro ? (
                    <>
                      <span>{flag.name}</span>:
                      <span className="font-bold text-[#D4AF37]">${flag.amount.toFixed(2)}</span>
                    </>
                  ) : (
                    <>
                      <span className="flex items-center gap-1 text-zinc-400 select-none"><span className="material-icons" style={{fontSize:'1rem'}}>&#x1f512;</span>[Locked] Upgrade to reveal</span>:
                      <span className="font-bold text-[#D4AF37]">${flag.amount.toFixed(2)}</span>
                    </>
                  )}
                </div>
                {flag.reasoning && (
                  isPro ? (
                    <div className="text-zinc-500 text-xs ml-7 mt-0.5">{flag.reasoning}</div>
                  ) : (
                    <div className="text-zinc-500 text-xs ml-7 mt-0.5 blur-sm select-none">Upgrade to Pro to view forensic reasoning</div>
                  )
                )}
              </li>
            );
          })}
        </ul>
      )}
      {state === 1 && (
        <div className="mb-3">
          {benchmarks.map((b, i) => (
            <div key={i} className="flex items-center gap-2 text-base mb-1">
              <span className="text-blue-400">📊</span>
              <span>{b.category}:</span>
              <span className="font-bold text-[#D4AF37]">{b.merchantValue}{b.unit}</span>
              <span className="text-slate-400 text-xs">(Industry Avg: {b.industryAvg}{b.unit})</span>
            </div>
          ))}
        </div>
      )}
      {state === 2 && (
        <div className="mb-3">
          {liveAlerts.map((alert, i) => (
            <div key={i} className={`flex items-center gap-2 text-base mb-1 ${alert.severity === 'critical' ? 'text-red-400' : 'text-amber-400'}`}>
              <span>{alert.severity === 'critical' ? '⚠️' : '⏰'}</span>
              <span>{alert.message}</span>
            </div>
          ))}
        </div>
      )}
      <a
        className="block text-xs text-amber-400 underline hover:text-[#D4AF37] mt-2 text-right cursor-pointer"
        onClick={onViewCertificate}
      >
        View Forensic Breakdown &rarr;
      </a>
      <span className="absolute top-2 right-4 text-xs text-rose-400 font-bold animate-pulse-slow">Action Required</span>
    </div>
  );
};

export default ForensicInsights;
