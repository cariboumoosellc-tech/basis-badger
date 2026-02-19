import React from "react";

interface CertificateOfFindingsSneakPeekProps {
  savings: number;
  total: number;
  issues: number;
  onUnlock: () => void;
}

export default function CertificateOfFindingsSneakPeek({ savings, total, issues, onUnlock }: CertificateOfFindingsSneakPeekProps) {
  function formatCurrency(val: number) {
    return val.toLocaleString(undefined, { style: 'currency', currency: 'USD', minimumFractionDigits: 2 });
  }
  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Blurred certificate background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/80 to-zinc-200/90 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center pointer-events-none select-none" />
      {/* Forensic Summary Card Overlay */}
      <div className="absolute inset-0 flex items-center justify-center z-50">
        <div className="bg-zinc-900 border border-zinc-700 shadow-2xl p-8 rounded-2xl max-w-md w-full text-center flex flex-col items-center">
          {/* Top Section: Trust */}
          <div className="text-zinc-400 text-sm mb-1">Total Volume Analyzed</div>
          <div className="text-white text-xl font-mono mb-4">{formatCurrency(total)}</div>
          <div className="my-4 border-t border-zinc-800 w-full" />
          {/* Middle Section: The Pain */}
          <div className="text-amber-500 font-bold uppercase tracking-wider text-xs mb-1">Projected Annual Waste</div>
          <div className="text-4xl font-black text-white drop-shadow-lg mb-1">{formatCurrency(savings * 12)}</div>
          <div className="text-zinc-400 text-xs mt-1 mb-4">Based on {issues} critical red flags detected</div>
          {/* Bottom: The Hook */}
          <button
            className="mt-2 w-full py-4 rounded-full text-lg font-black uppercase tracking-wide bg-[#FFD700] text-zinc-900 shadow-lg hover:brightness-110 transition-all"
            onClick={onUnlock}
          >
            Unlock Full Forensic Report
          </button>
        </div>
      </div>
      {/* Spacer for layout */}
      <div className="opacity-0 select-none pointer-events-none" style={{height:320}} />
    </div>
  );
}
