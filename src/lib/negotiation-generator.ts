import type { BadgerAudit } from "@/types";

type FindingMatch = {
  hasTieredPricing: boolean;
  hasInterchangePadding: boolean;
};

const matchFindings = (audit: BadgerAudit): FindingMatch => {
  const normalizedTitles = audit.findings.map((finding) =>
    finding.title.toLowerCase()
  );

  return {
    hasTieredPricing: normalizedTitles.some((title) =>
      title.includes("tiered pricing")
    ),
    hasInterchangePadding: normalizedTitles.some((title) =>
      title.includes("interchange padding")
    ),
  };
};

export const generateDisputeLetter = (audit: BadgerAudit): string => {
  const { hasTieredPricing, hasInterchangePadding } = matchFindings(audit);
  const lines: string[] = [];

  lines.push("To whom it may concern,");
  lines.push("");
  lines.push(
    "We have completed a forensic review of our merchant processing statements. " +
      "This review surfaced material pricing and compliance concerns that require immediate remediation."
  );

  if (hasTieredPricing) {
    lines.push("");
    lines.push(
      "We have identified significant downgrades consistent with non-transparent tiered pricing structures."
    );
  }

  if (hasInterchangePadding) {
    lines.push("");
    lines.push(
      "Our internal forensic audit indicates markups exceeding standard interchange-plus benchmarks by [X] basis points."
    );
  }

  lines.push("");
  lines.push(
    "In light of these findings, we are demanding a Level 3 Optimization Audit and a move to True Interchange Plus 10bps pricing."
  );
  lines.push(
    "Additionally, we expect confirmation that your pricing and routing policies comply with the Durbin Amendment."
  );
  lines.push("");
  lines.push(
    "Please provide a written response within ten business days detailing corrective actions and a revised pricing schedule."
  );
  lines.push("");
  lines.push("Sincerely,");
  lines.push("Authorized Representative");

  return lines.join("\n");
};
