"use client";
import { useRouter, useSearchParams } from "next/navigation";
import CertificateOfFindingsSneakPeek from "@/components/CertificateOfFindingsSneakPeek";
import { Suspense } from "react";

function PreviewContent() {
  const router = useRouter();
  const params = useSearchParams();
  const savings = parseFloat(params.get("savings") || "0");
  const businessName = params.get("business") || "Your Business";
  const date = params.get("date") || new Date().toISOString().slice(0, 10);
  const effectiveRate = parseFloat(params.get("rate") || "2.9");
  const status = params.get("status") || "Audit Dispatched";

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0D0D0D]">
      <CertificateOfFindingsSneakPeek
        businessName={businessName}
        audit={{
          date,
          savings,
          effectiveRate,
          status,
        }}
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
