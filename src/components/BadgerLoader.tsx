import React, { useEffect, useState } from 'react';
import Image from 'next/image';

const statusMessages = [
  'Scanning Interchange Rates...',
  'Identifying Fee Leakage...',
  'Cross-Referencing Industry Benchmarks...',
  'Preparing Forensic Report...'
];

export default function BadgerLoader() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % statusMessages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[200px]">
      <div className="animate-spin-slow mb-4">
        <Image src="/logo.png" alt="Loading" width={64} height={64} priority />
      </div>
      <div className="text-lg font-semibold text-[#F29C1F] text-center min-h-[2.5em]">
        {statusMessages[index]}
      </div>
      <style jsx global>{`
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 2s linear infinite;
        }
      `}</style>
    </div>
  );
}
