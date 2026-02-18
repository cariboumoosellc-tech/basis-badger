"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveLeadAction } from "@/app/actions/leads";

export type LeadCaptureInitialData = {
  processorName?: string;
  totalVolume?: number;
  annualWaste?: number;
};

type LeadCaptureProps = {
  initialData?: LeadCaptureInitialData;
  onSuccess: () => void;
  modal?: boolean;
};

export default function LeadCapture({ initialData, onSuccess, modal }: LeadCaptureProps) {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  // Hidden intelligence
  const [processorName] = useState(initialData?.processorName || "");
  const [monthlyVolume] = useState(initialData?.totalVolume || "");
  const [annualWaste] = useState(initialData?.annualWaste || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");
    // Validate required fields
    if (!fullName.trim()) {
      setError("Full Name is required.");
      setIsSaving(false);
      return;
    }
    if (!businessName.trim()) {
      setError("Business Name is required.");
      setIsSaving(false);
      return;
    }
    if (!businessEmail.trim()) {
      setError("Business Email is required.");
      setIsSaving(false);
      return;
    }
    if (!consent) {
      setError("Consent is required for us to contact you and release your forensic breakdown.");
      setIsSaving(false);
      return;
    }
    try {
      const result = await saveLeadAction({
        merchant_email: businessEmail,
        processor_name: processorName,
        monthly_volume: Number(monthlyVolume),
        annual_waste_found: Number(annualWaste),
      });
      if (result.success) {
        // Store audit results in localStorage for dashboard hydration
        const auditResults = {
          businessName,
          processorName,
          monthlyVolume,
          annualWaste,
        };
        if (typeof window !== 'undefined') {
          localStorage.setItem('badger_audit_results', JSON.stringify(auditResults));
        }
        router.push('/dashboard');
      } else {
        setError("Failed to save lead.");
      }
    } catch {
      setError("Failed to save lead.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`max-w-lg mx-auto p-8 shadow-lg rounded-3xl border ${modal ? "border-amber-400 z-20 drop-shadow-2xl animate-fade-in" : "border-slate-200"} bg-[#1A1A1A]`}
      style={modal ? { minWidth: 380, minHeight: 420 } : {}}
    >
      <h3 className="text-lg font-black text-amber-400 mb-6 uppercase tracking-wider text-center">
        Lead Verification
      </h3>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-white" htmlFor="fullName">Full Name</label>
          <input
            id="fullName"
            type="text"
            required
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            placeholder="e.g. Jane Smith"
            className="rounded-lg border border-slate-600 px-4 py-2 bg-[#232323] text-white focus:border-amber-400 focus:ring-amber-400"
            autoComplete="name"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-white" htmlFor="businessName">Business Name</label>
          <input
            id="businessName"
            type="text"
            required
            value={businessName}
            onChange={e => setBusinessName(e.target.value)}
            placeholder="e.g. Acme Corp"
            className="rounded-lg border border-slate-600 px-4 py-2 bg-[#232323] text-white focus:border-amber-400 focus:ring-amber-400"
            autoComplete="organization"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-white" htmlFor="businessEmail">Business Email</label>
          <input
            id="businessEmail"
            type="email"
            required
            value={businessEmail}
            onChange={e => setBusinessEmail(e.target.value)}
            placeholder="e.g. jane@acme.com"
            className="rounded-lg border border-slate-600 px-4 py-2 bg-[#232323] text-white focus:border-amber-400 focus:ring-amber-400"
            autoComplete="email"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-white" htmlFor="phone">Phone Number <span className="text-xs text-slate-400">(Optional)</span></label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="(555) 000-0000"
            className="rounded-lg border border-slate-600 px-4 py-2 bg-[#232323] text-white focus:border-amber-400 focus:ring-amber-400"
          />
        </div>
        {/* Hidden intelligence fields */}
        <input type="hidden" name="processorName" value={processorName} />
        <input type="hidden" name="monthlyVolume" value={monthlyVolume} />
        <input type="hidden" name="annualWaste" value={annualWaste} />
        <div className="flex items-center mt-2">
          <input
            id="consent"
            type="checkbox"
            checked={consent}
            onChange={e => setConsent(e.target.checked)}
            className="mr-2 accent-amber-400 w-4 h-4 rounded"
            required
          />
          <label htmlFor="consent" className="text-xs text-slate-200 select-none">
            I consent to receive a forensic breakdown of these results via phone or email.
          </label>
        </div>
        {error && <p className="text-xs text-red-400 mt-2">{error}</p>}
        <button
          type="submit"
          disabled={isSaving}
          className="w-full rounded-full"
          style={{ background: '#F29C1F', color: '#1A1A1A', fontWeight: 900, textTransform: 'uppercase', fontSize: '1rem', padding: '0.75rem 1.5rem', boxShadow: '0 2px 8px 0 #0002', letterSpacing: '0.05em' }}
        >
          {isSaving ? "Saving..." : "RELEASE THE BADGER"}
        </button>
      </div>
    </form>
  );
}
