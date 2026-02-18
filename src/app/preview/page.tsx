"use client";
import { useRouter, useSearchParams } from "next/navigation";
import CertificateOfFindingsSneakPeek from "@/components/CertificateOfFindingsSneakPeek";
import { Suspense } from "react";

function PreviewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const savings = searchParams.get('savings') || '184.50';
  const issues = parseInt(searchParams.get('issues') || '3', 10);
  const businessName = searchParams.get("business") || "Your Business";
  const date = searchParams.get("date") || new Date().toISOString().slice(0, 10);
  const effectiveRate = parseFloat(searchParams.get("rate") || "2.9");
  const status = searchParams.get("status") || "Audit Dispatched";

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0D0D0D]">
      <CertificateOfFindingsSneakPeek
        businessName={businessName}
        audit={{
          date,
          savings: parseFloat(savings),
          effectiveRate,
          status,
        }}
        issues={issues}
        onUnlock={() => router.push("/pricing")}
      />
    </div>
  );
}

export default function PreviewPage() {
  return (
    <Suspense>
      <PreviewContent />
    </Suspense>
  );
}
