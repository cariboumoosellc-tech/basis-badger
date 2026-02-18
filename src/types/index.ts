export interface AuditFinding {
  id: string;
  category: string;
  title: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  confidence: number;
  evidence?: string;
  recommendedAction?: string;
}

export interface BadgerAudit {
  sourceName: string;
  createdAt: string;
  version: string;
  findings: AuditFinding[];
  summary: {
    totalFindings: number;
    highRiskCount: number;
    overallScore: number;
  };
}
