
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LeadVerificationForm() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [email, setEmail] = useState('');

  // Helper to convert file to base64
  const toBase64 = (file: File) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data:application/pdf;base64, prefix
      resolve(result.split(',')[1]);
    };
    reader.onerror = error => reject(error);
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsAnalyzing(true);
    try {
      // 1. Prepare the file
      const base64File = await toBase64(file);
      // 2. Call the Brain
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileData: base64File,
          fileType: file.type
        })
      });
      if (!response.ok) throw new Error('Analysis failed');
      const data = await response.json();
      console.log("Forensic Data Received:", data);
      // 3. Redirect with REAL Data
      // We use encodeURIComponent to handle any weird characters
      const fees = data.totalFees || 0;
      const savings = data.savingsFound || 0;
      const issues = data.redFlags?.length || 0;
      router.push(`/preview?fees=${fees}&savings=${savings}&issues=${issues}`);
    } catch (error) {
      console.error("Scan Error:", error);
      alert("The Badger encountered an error reading that file. Please try a clear image or PDF.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto p-8 shadow-lg rounded-3xl border border-amber-400 z-20 drop-shadow-2xl animate-fade-in bg-[#1A1A1A]"
      style={{ minWidth: 380, minHeight: 420 }}
    >
      <h3 className="text-lg font-black text-amber-400 mb-6 uppercase tracking-wider text-center">
        Lead Verification
      </h3>
      <div className="flex flex-col gap-5">
        <input
          type="email"
          placeholder="Enter your email to unlock results"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-amber-500 outline-none"
          required
        />
        <input
          type="file"
          accept=".pdf,image/*"
          onChange={e => setFile(e.target.files?.[0] || null)}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-amber-500 outline-none"
          required
        />
        <button
          type="submit"
          disabled={!file || isAnalyzing}
          className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-black font-bold py-4 rounded-lg transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAnalyzing ? 'Running Forensic Scan...' : 'Release the Badger'}
        </button>
      </div>
    </form>
  );
}
