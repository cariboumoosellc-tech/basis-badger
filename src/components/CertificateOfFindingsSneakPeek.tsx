import React from "react";

interface CertificateOfFindingsSneakPeekProps {
  businessName: string;
  audit: {
    date: string;
    savings: number;
    effectiveRate: number;
    status: string;
  };
  issues?: number;
  totalFees?: number;
  volume?: number;
  junkFees?: number;
  onUnlock: () => void;
}

export default function CertificateOfFindingsSneakPeek({ businessName, audit, issues = 3, totalFees = 0, volume = 0, junkFees = 0, onUnlock }: CertificateOfFindingsSneakPeekProps) {
  // Calculate effective rate if not provided
  const effectiveRate = audit.effectiveRate || (volume > 0 ? (totalFees / volume) * 100 : 0);
  // Optimization Opportunity logic
  let optimizationValue = junkFees;
  let optimizationLabel = 'Optimization Opportunity';
  let hookRow = '';
  let isClean = false;
  if (junkFees <= 0 && volume > 0 && totalFees > 0) {
    // Calculate rate overpayment
    const marketRate = 2.5;
    const rateOver = effectiveRate - marketRate;
    optimizationValue = Math.max(0, Math.round(rateOver * 0.01 * volume * 100) / 100);
    isClean = optimizationValue <= 0;
    if (isClean) {
      optimizationValue = Math.round((effectiveRate - marketRate) * 0.01 * volume * 100) / 100;
    }
    hookRow = isClean
      ? `Your rate is ${(effectiveRate - marketRate).toFixed(1)}% above market standard. Unlock to negotiate.`
      : `No hidden junk fees detected, but your rate is above market.`;
  } else if (junkFees > 0) {
    hookRow = `Includes ${issues} Hidden Fees & Rate Padding`;
  }
  // Fallback if all else fails
  if (!hookRow) hookRow = 'Unlock to see your full forensic breakdown.';
  // Annualized for overlay
  const annualized = Math.round(optimizationValue * 12 * 100) / 100;
  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto bg-white text-black rounded-xl shadow-lg p-8 border border-amber-400/80 relative overflow-hidden">
      {/* High-contrast annualized overlay */}
      <div className="absolute left-1/2 top-8 -translate-x-1/2 z-20 flex flex-col items-center bg-gradient-to-b from-[#FFD700] to-[#F29C1F] rounded-2xl px-8 py-6 shadow-2xl border-4 border-amber-400" style={{minWidth:320}}>
        <div className="text-4xl font-black mb-2" style={{ color: '#B87333', letterSpacing: 1 }}>${annualized.toLocaleString()}</div>
        <div className="text-base font-bold text-zinc-900 mb-1">{optimizationLabel}</div>
        <div className="text-xs text-zinc-700 mb-2">(12-month extrapolation)</div>
        <span className="inline-block bg-red-600 text-white font-bold text-xs rounded-full px-4 py-1 mt-2 mb-1 shadow" style={{letterSpacing:1}}>{issues} Critical Red Flags Detected</span>
      </div>
      {/* Blurred certificate content */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/80 to-zinc-200/90 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center pointer-events-none select-none" />
      <div className="flex items-center gap-4 mb-4 mt-20">
        <img src="/logo.png" alt="Badger Den Logo" className="h-14 w-auto" />
        <span className="text-2xl font-black">{businessName}</span>
      </div>
      <div className="w-full flex flex-col items-center mb-8">
        <div className="text-3xl font-black tracking-tight mb-1" style={{ color: '#D4AF37' }}>
          Certificate of Findings
        </div>
        <div className="text-base text-zinc-500 mb-2">Audit Date: {audit.date}</div>
        <div className="text-lg font-semibold mb-2">
          Total Fees Paid: <span style={{ color: '#888' }}>${totalFees.toLocaleString()}</span>
        </div>
        <div className="text-base text-zinc-500 mb-2">Effective Rate: <span style={{ color: '#D4AF37' }}>{effectiveRate.toFixed(2)}%</span></div>
        <div className="text-base font-bold mb-4">
          Rate Review Request Status: <span className="inline-flex items-center justify-center whitespace-nowrap min-w-[120px] border border-current px-3 py-1 rounded-full text-xs font-bold" style={{ color: '#D4AF37', borderColor: '#D4AF37' }}>{audit.status === 'Audit Dispatched' ? 'Counter-Strike Sent' : audit.status}</span>
        </div>
        {/* Optimization Opportunity Row */}
        <div className="text-2xl font-black mb-2" style={{ color: '#F29C1F' }}>
          {optimizationLabel}: ${optimizationValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        {/* Hook Row */}
        <div className="text-base font-semibold text-zinc-700 mb-4 text-center">
          {hookRow}
        </div>
      </div>
      {/* Blurred red flag list (visual only) */}
      <div className="flex flex-col gap-2 w-full opacity-40 blur-sm pointer-events-none select-none">
        <div className="h-8 bg-zinc-300/60 rounded mb-2 w-3/4 mx-auto" />
        <div className="h-8 bg-zinc-300/60 rounded mb-2 w-2/3 mx-auto" />
        <div className="h-8 bg-zinc-300/60 rounded mb-2 w-1/2 mx-auto" />
      </div>
      <button
        className="mt-8 w-full py-4 rounded-full text-lg font-black uppercase tracking-wide bg-[#D4AF37] text-zinc-900 shadow-lg hover:brightness-110 transition-all z-20 relative"
        onClick={onUnlock}
      >
        Unlock Full Forensic Report
      </button>
    </div>
  );
}
