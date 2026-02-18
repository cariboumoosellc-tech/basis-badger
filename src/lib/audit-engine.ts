
import { GoogleGenerativeAI } from "@google/generative-ai";

export interface AuditFinding {
  name: string;
  amount: number;
  reasoning: string;
}

export interface BadgerAudit {
  findings: AuditFinding[];
  createdAt: string;
  sourceName: string;
  version: string;
}

export async function runAudit(input: { text: string; sourceName: string }): Promise<BadgerAudit> {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const prompt = `You are a senior forensic merchant services auditor. Analyze this text for hidden markups, junk fees, and surcharges. Be aggressive. Return a valid JSON array of objects with the keys: \"name\", \"amount\", and \"reasoning\".`;
  const fullPrompt = `${prompt}\n\n${input.text}`;
  let findings: AuditFinding[] = [];
  try {
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();
    // Try to extract JSON from the response (no /s flag)
    const jsonMatch = text.match(/\[([\s\S]*?)\]/);
    if (jsonMatch) {
      findings = JSON.parse('[' + jsonMatch[1] + ']');
    } else {
      findings = [];
    }
  } catch (e) {
    findings = [];
  }
  return {
    findings,
    createdAt: new Date().toISOString(),
    sourceName: input.sourceName,
    version: "gemini-1.5-flash"
  };
}
