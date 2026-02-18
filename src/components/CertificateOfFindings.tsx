import React from "react";

interface CertificateOfFindingsProps {
  businessName: string;
  audit: {
    date: string;
    savings: number;
    effectiveRate: number;
    status: string;
  };
  onBack: () => void;
}

export default function CertificateOfFindings({ businessName, audit, onBack }: CertificateOfFindingsProps) {
  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto bg-white text-black rounded-xl shadow-lg p-8 border border-amber-400 print:bg-white print:text-black">
      <div className="flex items-center gap-4 mb-4">
        <img src="/logo.png" alt="Badger Den Logo" className="h-14 w-auto" />
        <span className="text-2xl font-black">{businessName}</span>
      </div>
      <div className="w-full flex flex-col items-center mb-8">
        <div className="text-3xl font-black tracking-tight mb-1" style={{ color: '#F29C1F' }}>
          Certificate of Findings
        </div>
        <div className="text-base text-zinc-500 mb-2">Audit Date: {audit.date}</div>
        <div className="text-lg font-semibold mb-2">
          Total Monthly Overcharge: <span style={{ color: '#F29C1F' }}>${audit.savings.toLocaleString()}</span>
        </div>
        <div className="text-base text-zinc-500 mb-2">Effective Rate: <span style={{ color: '#F29C1F' }}>{audit.effectiveRate}%</span></div>
        <div className="text-base font-bold mb-4">
          Rate Review Request Status: <span style={{ color: '#F29C1F' }}>{audit.status === 'Audit Dispatched' ? 'Counter-Strike Sent' : audit.status}</span>
        </div>
      </div>
      <div className="flex gap-4 print:hidden">
        <button
          className="rounded-full text-black font-bold uppercase px-6 py-3 text-base shadow-lg border border-amber-400 hover:brightness-110 transition-all"
          style={{ background: '#F29C1F' }}
          onClick={() => window.print()}
        >
          Download PDF
        </button>
        <button
          className="rounded-full text-black font-bold uppercase px-6 py-3 text-base shadow-lg border border-amber-400 hover:bg-amber-400/10 transition-all"
          style={{ background: 'white', color: '#F29C1F', borderColor: '#F29C1F' }}
          onClick={onBack}
        >
          Back to the Den
        </button>
      </div>
    </div>
  );
}
