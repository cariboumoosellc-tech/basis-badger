"use client";
import { useRouter, useSearchParams } from "next/navigation";
import CertificateOfFindingsSneakPeek from "@/components/CertificateOfFindingsSneakPeek";
import { Suspense } from "react";

function PreviewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const savings = parseFloat(searchParams.get('savings') || '184.50');
  const fees = parseFloat(searchParams.get('fees') || '450.25'); // Default to a realistic fee amount
  const issues = parseInt(searchParams.get('issues') || '3', 10);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0D0D0D]">
      <CertificateOfFindingsSneakPeek
        savings={savings}
        totalFees={fees}
        issueCount={issues}
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
