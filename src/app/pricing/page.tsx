"use client";

import { useState } from "react";

export default function PricingPage() {
  const [plan, setPlan] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white flex flex-col items-center py-16 px-4">
      <div className="w-full max-w-md mx-auto bg-zinc-900/80 rounded-2xl shadow-lg p-8">
        {/* Toggle */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <button
            className={`px-6 py-2 rounded-full font-bold text-sm transition-all border border-zinc-700 ${plan === 'monthly' ? 'bg-[#D4AF37] text-zinc-900 border-[#D4AF37]' : 'bg-transparent text-slate-300 hover:bg-[#D4AF37]/10'}`}
            onClick={() => setPlan('monthly')}
          >
            Monthly
          </button>
          <button
            className={`px-6 py-2 rounded-full font-bold text-sm transition-all border border-zinc-700 flex items-center gap-2 ${plan === 'yearly' ? 'bg-[#D4AF37] text-zinc-900 border-[#D4AF37]' : 'bg-transparent text-slate-300 hover:bg-[#D4AF37]/10'}`}
            onClick={() => setPlan('yearly')}
          >
            Yearly
            {plan === 'yearly' && (
              <span className="ml-1 px-2 py-0.5 rounded-full text-xs font-bold bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]">Save 25%</span>
            )}
          </button>
        </div>
        {/* Pricing */}
        <div className="flex flex-col items-center mb-8">
          {plan === 'monthly' ? (
            <>
              <div className="text-5xl font-black mb-2" style={{ color: '#D4AF37' }}>$20</div>
              <div className="text-lg font-semibold text-slate-300 mb-1">per month</div>
            </>
          ) : (
            <>
              <div className="text-5xl font-black mb-2" style={{ color: '#D4AF37' }}>$15</div>
              <div className="text-lg font-semibold text-slate-300 mb-1">per month</div>
              <div className="text-xs text-slate-400">Billed as $180/year</div>
            </>
          )}
        </div>
        {/* CTA */}
        <button className="w-full mt-4 py-4 rounded-full text-lg font-black uppercase tracking-wide bg-[#D4AF37] text-zinc-900 shadow-lg hover:brightness-110 transition-all">
          Unlock Full Forensic Report
        </button>
      </div>
    </div>
  );
}
