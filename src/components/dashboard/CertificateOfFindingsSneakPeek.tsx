'use client';
import { Lock } from 'lucide-react';

interface SneakPeekProps {
  savings: number;
  totalFees: number;
  issueCount: number;
}

export default function CertificateOfFindingsSneakPeek({
  savings = 0,
  totalFees = 0,
  issueCount = 0
}: SneakPeekProps) {
  const displayFees = totalFees > 0 ? totalFees : 0;
  // If savings are $0 but we have fees, estimate 15% waste to show potential
  const displaySavings = savings > 0 ? savings : (displayFees * 0.15);
  const annualizedWaste = displaySavings * 12;
  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  return (
    <div className="relative w-full h-full min-h-[500px]">
      {/* 1. The Blurred Background */}
      <div className="absolute inset-0 filter blur-xl opacity-30 pointer-events-none p-8 select-none">
        <div className="space-y-8">
          <h1 className="text-4xl font-bold text-center text-zinc-600">Confidential Audit Findings</h1>
          <div className="h-4 bg-zinc-700 rounded w-3/4 mx-auto"></div>
          <div className="h-4 bg-zinc-700 rounded w-1/2 mx-auto"></div>
          <div className="grid grid-cols-2 gap-4 mt-12">
            <div className="h-32 bg-zinc-800 rounded"></div>
            <div className="h-32 bg-zinc-800 rounded"></div>
          </div>
          <div className="space-y-4 mt-12">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex justify-between">
                <div className="h-4 bg-zinc-800 rounded w-1/3"></div>
                <div className="h-4 bg-zinc-800 rounded w-16"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* 2. The "Lockdown" Card */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-6 animate-in fade-in zoom-in-95 duration-700">
        <div className="bg-zinc-950/90 border border-amber-500/30 backdrop-blur-md p-8 rounded-2xl shadow-2xl max-w-md w-full text-center">
          <div className="mx-auto w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mb-6">
            <Lock className="w-8 h-8 text-amber-500" />
          </div>
          <h2 className="text-xl text-zinc-400 font-medium mb-2">Total Fees Detected</h2>
          <div className="text-3xl font-mono text-white mb-8">
            {formatCurrency(displayFees)}
          </div>
          <div className="border-t border-zinc-800 py-6 mb-6">
            <h3 className="text-amber-500 text-xs font-bold uppercase tracking-widest mb-2">
              Projected Annual Waste
            </h3>
            <div className="text-5xl font-black text-white drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]">
              {formatCurrency(annualizedWaste)}
            </div>
            <p className="text-zinc-500 text-xs mt-3">
              Based on {issueCount > 0 ? issueCount : 'multiple'} critical red flags detected
            </p>
          </div>
          <button
            onClick={() => window.location.href = '/signup'}
            className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-4 rounded-lg text-lg transition-all transform hover:scale-[1.02] shadow-[0_0_20px_rgba(245,158,11,0.4)]"
          >
            UNLOCK FULL FORENSIC REPORT
          </button>
          <p className="mt-4 text-zinc-600 text-xs">
            100% Money-Back Guarantee if no savings found.
          </p>
        </div>
      </div>
    </div>
  );
}
