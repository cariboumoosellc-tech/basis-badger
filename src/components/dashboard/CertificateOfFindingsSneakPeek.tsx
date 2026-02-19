'use client';

import { Lock } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

export default function CertificateOfFindingsSneakPeek() {
  const searchParams = useSearchParams();
  
  // Look directly at the URL parameters sent by the API
  const urlFees = searchParams.get('fees') || searchParams.get('totalFees');
  const urlSavings = searchParams.get('savings');
  const urlIssues = searchParams.get('issues');

  // If URL is empty, fallback to the real demo numbers (NEVER $450.25)
  const displayFees = urlFees ? parseFloat(urlFees) : 1250.50;
  const displaySavings = urlSavings ? parseFloat(urlSavings) : 345.20;
  const issueCount = urlIssues ? parseInt(urlIssues) : 3;

  const annualizedWaste = displaySavings * 12;

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  return (
    <div className="relative w-full h-full min-h-[600px] bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800">
      
      {/* Blurred Background */}
      <div className="absolute inset-0 filter blur-xl opacity-30 pointer-events-none p-8 select-none">
         <div className="space-y-8">
            <h1 className="text-4xl font-bold text-center text-zinc-600">Confidential Audit Findings</h1>
            <div className="h-4 bg-zinc-700 rounded w-3/4 mx-auto"></div>
            <div className="grid grid-cols-2 gap-4 mt-12">
                <div className="h-32 bg-zinc-800 rounded"></div>
                <div className="h-32 bg-zinc-800 rounded"></div>
            </div>
         </div>
      </div>

      {/* The Lockdown Card */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-6">
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
              Based on {issueCount} critical red flags detected
            </p>
          </div>

          <button 
            onClick={() => window.location.href = '/signup'}
            className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-4 rounded-lg text-lg"
          >
            UNLOCK FULL FORENSIC REPORT
          </button>
        </div>
      </div>
    </div>
  );
}
