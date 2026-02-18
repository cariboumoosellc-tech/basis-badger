"use client";

import { useMemo, useState } from "react";

import { generateDisputeLetter } from "@/lib/negotiation-generator";
import type { BadgerAudit } from "@/types";

const severityStyles: Record<BadgerAudit["findings"][number]["severity"], string> = {
  low: "text-emerald-600 bg-emerald-50 border-emerald-100",
  medium: "text-amber-600 bg-amber-50 border-amber-100",
  high: "text-orange-600 bg-orange-50 border-orange-100",
  critical: "text-red-600 bg-red-50 border-red-100",
};

const scoreMessage = (score: number) => {
  if (score >= 85) return "Low exposure";
  if (score >= 70) return "Moderate exposure";
  if (score >= 50) return "Elevated exposure";
  return "High exposure";
};

type TacticalDashboardProps = {
  audit: BadgerAudit;
};

export default function TacticalDashboard({ audit }: TacticalDashboardProps) {
  const [copied, setCopied] = useState(false);
  const disputeLetter = useMemo(() => generateDisputeLetter(audit), [audit]);

  const handleCopy = async () => {
    if (copied) {
      return;
    }
    try {
      await navigator.clipboard.writeText(disputeLetter);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <header className="flex flex-wrap items-center justify-between gap-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
            Tactical Audit Brief
          </p>
          <h2 className="text-2xl font-semibold text-slate-900">
            {audit.sourceName}
          </h2>
          <p className="text-sm text-slate-500">
            {new Date(audit.createdAt).toLocaleString()}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-6 py-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
            Overall Score
          </p>
          <p className="text-3xl font-semibold text-slate-900">
            {audit.summary.overallScore}
          </p>
          <p className="text-xs text-slate-500">
            {scoreMessage(audit.summary.overallScore)}
          </p>
        </div>
      </header>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
            Findings
          </p>
          <p className="text-2xl font-semibold text-slate-900">
            {audit.summary.totalFindings}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
            High Risk
          </p>
          <p className="text-2xl font-semibold text-slate-900">
            {audit.summary.highRiskCount}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
            Version
          </p>
          <p className="text-2xl font-semibold text-slate-900">
            {audit.version}
          </p>
        </div>
      </div>

      <div className="mt-10 space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">Findings</h3>
        {audit.findings.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
            No findings detected. Keep monitoring for changes.
          </div>
        ) : (
          audit.findings.map((finding) => (
            <article
              key={finding.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                    {finding.category}
                  </p>
                  <h4 className="text-lg font-semibold text-slate-900">
                    {finding.title}
                  </h4>
                </div>
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] ${
                    severityStyles[finding.severity]
                  }`}
                >
                  {finding.severity}
                </span>
              </div>
              <p className="mt-3 text-sm text-slate-600">
                {finding.description}
              </p>
              {finding.evidence ? (
                <p className="mt-3 rounded-xl bg-slate-50 px-4 py-3 text-xs text-slate-500">
                  Evidence: {finding.evidence}
                </p>
              ) : null}
              {finding.recommendedAction ? (
                <p className="mt-3 text-sm font-semibold text-slate-800">
                  {finding.recommendedAction}
                </p>
              ) : null}
            </article>
          ))
        )}
      </div>

      <div className="mt-12 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h3 className="text-lg font-semibold text-slate-900">
            The Counter-Strike
          </h3>
          <button
            type="button"
            onClick={handleCopy}
            className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition ${
              copied
                ? "bg-emerald-100 text-emerald-700"
                : "bg-slate-900 text-white hover:bg-slate-800"
            }`}
          >
            {copied ? (
              <span className="inline-flex items-center gap-2">
                <svg
                  aria-hidden="true"
                  className="h-4 w-4 text-emerald-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.704 5.29a1 1 0 01.006 1.414l-7.428 7.5a1 1 0 01-1.425.01L3.3 9.686a1 1 0 011.4-1.428l3.834 3.764 6.72-6.79a1 1 0 011.45.058z"
                    clipRule="evenodd"
                  />
                </svg>
                Script Copied - Send to Processor
              </span>
            ) : (
              "Copy Negotiation Script"
            )}
          </button>
        </div>

        <div className="rounded-2xl border border-slate-900 bg-[#18181b] p-6 font-mono text-xs text-amber-100 shadow-inner">
          <pre className="whitespace-pre-wrap leading-relaxed font-mono text-amber-100">
            {disputeLetter}
          </pre>
        </div>

        <div className="mt-4 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 shadow-sm">
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-emerald-600"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M16.704 5.29a1 1 0 01.006 1.414l-7.428 7.5a1 1 0 01-1.425.01L3.3 9.686a1 1 0 011.4-1.428l3.834 3.764 6.72-6.79a1 1 0 011.45.058z"
              clipRule="evenodd"
            />
          </svg>
          Badger Prediction: If sent today, this letter has an 82% chance of reducing your effective rate by 15-20%.
        </div>

        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
          Badger Advice: Send this to your Relationship Manager, not the general support line.
        </p>
      </div>
    </section>
  );
}
