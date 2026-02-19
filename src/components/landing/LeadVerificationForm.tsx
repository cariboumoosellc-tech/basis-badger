'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, FileText } from 'lucide-react';

export default function LeadVerificationForm() {
const router = useRouter();
const [file, setFile] = useState<File | null>(null);
const [isAnalyzing, setIsAnalyzing] = useState(false);
const [email, setEmail] = useState('');

// Helper: Convert file to clean Base64
const toBase64 = (file: File) => new Promise((resolve, reject) => {
const reader = new FileReader();
reader.readAsDataURL(file);
reader.onload = () => {
const result = reader.result as string;
// Remove 'data:application/pdf;base64,' prefix
resolve(result.split(',')[1]);
};
reader.onerror = error => reject(error);
});

const handleSubmit = async (e: React.FormEvent) => {
e.preventDefault();
if (!file) return;

setIsAnalyzing(true);
try {
  // 1. Prepare File
  const base64File = await toBase64(file);
  // 2. Call the Real Brain
  console.log("Sending to API...");
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fileData: base64File,
      fileType: file.type
    })
  });
  const data = await response.json();
    console.log("API Response:", data);
    // Check for Server Errors first
    if (data.error) {
      alert(`Server Error: ${data.error}`);
      setIsAnalyzing(false);
      return;
    }
    // Check for Empty Data
    if (!data || (data.totalFees === 0 && data.savingsFound === 0)) {
      alert("The Badger returned $0. This usually means the statement image was too blurry or the AI couldn't find the 'Total Fees' line.");
      setIsAnalyzing(false);
      return; 
    }
    // 4. Redirect with REAL Data
    router.push(`/preview?fees=${data.totalFees}&savings=${data.savingsFound}&issues=${data.redFlags?.length || 0}`);
} catch (error) {
  console.error("Critical Error:", error);
  alert("Connection failed. Please check your internet or try again.");
  setIsAnalyzing(false);
}
};

return (
<form onSubmit={handleSubmit} className="max-w-lg mx-auto p-8 shadow-lg rounded-3xl border border-amber-400 z-20 drop-shadow-2xl animate-fade-in bg-[#1A1A1A]" style={{ minWidth: 380, minHeight: 420 }}>
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
