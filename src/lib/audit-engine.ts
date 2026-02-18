import type { AuditFinding, BadgerAudit } from "@/types";

export interface AuditInput {
  sourceName: string;
  text: string;
}

export interface RiskWeights {
  low: number;
  medium: number;
  high: number;
  critical: number;
}

const DEFAULT_WEIGHTS: RiskWeights = {
  low: 1,
  medium: 2,
  high: 4,
  critical: 7,
};

const CLUE_PATTERNS: Array<{
  id: string;
  category: string;
  title: string;
  severity: AuditFinding["severity"];
  pattern: RegExp;
  description: string;
  recommendedAction: string;
  confidence: number;
}> = [
  {
    id: "risk-unlimited-liability",
    category: "Liability",
    title: "Unlimited liability language",
    severity: "high",
    pattern: /unlimited liability|liability without limit/i,
    description: "The document appears to remove liability caps.",
    recommendedAction: "Negotiate a liability cap aligned with contract value.",
    confidence: 0.72,
  },
  {
    id: "risk-auto-renew",
    category: "Renewal",
    title: "Auto-renewal without notice",
    severity: "medium",
    pattern: /auto-?renew|renews automatically/i,
    description: "Auto-renewal may trigger unintended commitments.",
    recommendedAction: "Add renewal notice requirements and opt-out window.",
    confidence: 0.63,
  },
  {
    id: "risk-governing-law",
    category: "Jurisdiction",
    title: "Unfavorable governing law",
    severity: "low",
    pattern: /governed by the laws of/i,
    description: "Governing law clause may need alignment with policy.",
    recommendedAction: "Confirm governing law matches internal policy.",
    confidence: 0.51,
  },
];

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

const computeScore = (findings: AuditFinding[], weights: RiskWeights) => {
  const weightTotal = findings.reduce(
    (total, finding) => total + weights[finding.severity],
    0
  );
  const maxWeight = findings.length * weights.critical;
  if (maxWeight === 0) {
    return 100;
  }
  const normalized = 1 - weightTotal / maxWeight;
  return Math.round(clamp(normalized * 100, 0, 100));
};

const buildFinding = (
  finding: (typeof CLUE_PATTERNS)[number],
  evidence: string | undefined
): AuditFinding => ({
  id: finding.id,
  category: finding.category,
  title: finding.title,
  description: finding.description,
  severity: finding.severity,
  confidence: finding.confidence,
  evidence,
  recommendedAction: finding.recommendedAction,
});

export const runAudit = (
  input: AuditInput,
  weights: RiskWeights = DEFAULT_WEIGHTS
): BadgerAudit => {
  const findings = CLUE_PATTERNS.flatMap((clue) => {
    const match = input.text.match(clue.pattern);
    if (!match) {
      return [];
    }
    return [buildFinding(clue, match[0])];
  });

  // Processor dictionary for clean mapping
  const processorDictionary: Array<{ pattern: RegExp; name: string }> = [
    { pattern: /Member of Wells Fargo/i, name: "Wells Fargo" },
    { pattern: /Powered by First Data/i, name: "Fiserv/Clover" },
    { pattern: /Fiserv/i, name: "Fiserv" },
    { pattern: /Worldpay/i, name: "Worldpay" },
    { pattern: /Global Payments/i, name: "Global Payments" },
    { pattern: /Heartland/i, name: "Heartland" },
    { pattern: /Square/i, name: "Square" },
    { pattern: /Toast/i, name: "Toast" },
    { pattern: /Elavon/i, name: "Elavon" },
  ];

  let detectedProcessor = input.sourceName;
  for (const entry of processorDictionary) {
    if (entry.pattern.test(input.text)) {
      detectedProcessor = entry.name;
      break;
    }
  }

  const highRiskCount = findings.filter(
    (finding) => finding.severity === "high" || finding.severity === "critical"
  ).length;

  const audit: BadgerAudit = {
    sourceName: detectedProcessor,
    createdAt: new Date().toISOString(),
    version: "1.0",
    findings,
    summary: {
      totalFindings: findings.length,
      highRiskCount,
      overallScore: computeScore(findings, weights),
    },
  };

  return audit;
};
