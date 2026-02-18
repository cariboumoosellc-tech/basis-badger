import React from "react";

interface CertificateOfFindingsSneakPeekProps {
  businessName: string;
  audit: {
    date: string;
    savings: number;
    effectiveRate: number;
    status: string;
  };
  onUnlock: () => void;
}

export default function CertificateOfFindingsSneakPeek({ businessName, audit, onUnlock }: CertificateOfFindingsSneakPeekProps) {
  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto bg-white text-black rounded-xl shadow-lg p-8 border border-amber-400/80 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-white/80 to-zinc-200/90 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center pointer-events-none select-none">
        <div className="text-2xl font-black mb-2" style={{ color: '#D4AF37' }}>Locked Preview</div>
        <div className="text-base text-zinc-500 mb-4">Upgrade to unlock full details</div>
      </div>
      <div className="flex items-center gap-4 mb-4">
        <img src="/logo.png" alt="Badger Den Logo" className="h-14 w-auto" />
        <span className="text-2xl font-black">{businessName}</span>
      </div>
      <div className="w-full flex flex-col items-center mb-8">
        <div className="text-3xl font-black tracking-tight mb-1" style={{ color: '#D4AF37' }}>
          Certificate of Findings
        </div>
        <div className="text-base text-zinc-500 mb-2">Audit Date: {audit.date}</div>
        <div className="text-lg font-semibold mb-2">
          Total Monthly Overcharge: <span style={{ color: '#D4AF37' }}>${audit.savings.toLocaleString()}</span>
        </div>
        <div className="text-base text-zinc-500 mb-2">Effective Rate: <span style={{ color: '#D4AF37' }}>{audit.effectiveRate}%</span></div>
        <div className="text-base font-bold mb-4">
          Rate Review Request Status: <span className="inline-flex items-center justify-center whitespace-nowrap min-w-[120px] border border-current px-3 py-1 rounded-full text-xs font-bold" style={{ color: '#D4AF37', borderColor: '#D4AF37' }}>{audit.status === 'Audit Dispatched' ? 'Counter-Strike Sent' : audit.status}</span>
        </div>
      </div>
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
