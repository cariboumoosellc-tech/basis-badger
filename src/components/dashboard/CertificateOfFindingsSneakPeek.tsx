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
  
  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  return (
    <div className="relative w-full h-full min-h-[600px] bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800">
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-6">
        <div className="bg-zinc-950/90 border border-amber-500/30 backdrop-blur-md p-8 rounded-2xl shadow-2xl max-w-md w-full text-center">
          <div className="mx-auto w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mb-6">
            <Lock className="w-8 h-8 text-amber-500" />
          </div>

          <h2 className="text-xl text-zinc-400 font-medium mb-2">Total Fees Detected</h2>
          <div className="text-3xl font-mono text-white mb-8">{formatCurrency(totalFees)}</div>

          <div className="border-t border-zinc-800 py-6 mb-6">
            <h3 className="text-amber-500 text-xs font-bold uppercase tracking-widest mb-2">Projected Annual Waste</h3>
            <div className="text-5xl font-black text-white">{formatCurrency(savings * 12)}</div>
            <p className="text-zinc-500 text-xs mt-3">Based on {issueCount} critical red flags</p>
          </div>

          <button onClick={() => window.location.href = '/signup'} className="w-full bg-amber-500 text-black font-bold py-4 rounded-lg">
            UNLOCK FULL FORENSIC REPORT
          </button>
        </div>
      </div>
    </div>
  );
}