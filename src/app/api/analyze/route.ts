import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
interface AnalysisResult {
  totalFees: number;
  totalVolume: number;
  junkFees: number;
  redFlags: string[];
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
export async function POST(req: Request) {
  try {
    const body = await req.json();
  const { fileData, fileType } = body;

  if (!fileData) {
      return NextResponse.json({ error: "No file data" }, { status: 400 });
    }
    // UPGRADE: Use the Pro model for better OCR
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const prompt = `
      You are a Forensic Merchant Auditor.
  Analyze this statement image/PDF.
  Goal: Find the money.
  1. TOTAL FEES: Look for "Total Amount Due", "Total Debits", "Total Fees", or the largest monetary sum at the bottom.
      - If you cannot find an exact "Total Fees" line, sum up the largest visible fee amounts.
      - ESTIMATE if necessary.
    2. TOTAL VOLUME: Look for "Net Sales", "Total Volume", or "Gross Sales".
      - If missing, estimate volume as (Total Fees / 0.03).
    3. JUNK FEES: Look for:
      - "PCI" or "Non-Compliance"
         - "Annual Fee"
         - "Statement Fee"
         - "Batch Header"
      - "Surcharge"
    4. CALCULATION:
      - Sum the Junk Fees found.
      - Calculate Effective Rate = (Total Fees / Total Volume).
      - If Rate > 2.8%, add (Total Volume * (Rate - 0.028)) to the "junkFees" total (Label this as "Rate Overpayment").
    Return ONLY valid JSON:
      {
        "totalFees": number,
        "totalVolume": number,
        "junkFees": number,
        "redFlags": string[]
      }
    `;
    const result = await model.generateContent([
      prompt,
      { inlineData: { data: fileData, mimeType: fileType || "application/pdf" } },
    ]);
    const responseText = result.response.text();
  const jsonString = responseText.replace(/\`\`\`json|\`\`\`/g, "").trim();
  const parsed = JSON.parse(jsonString) as AnalysisResult;
  return NextResponse.json({
  totalFees: parsed.totalFees || 0,
  savingsFound: parsed.junkFees || 0,
  redFlags: parsed.redFlags || [],
    });
  } catch (error) {
    console.error("Gemini Error:", error);
    // Fallback: If AI fails, return 0s so frontend handles it, but log error
    return NextResponse.json({
      totalFees: 0,
  savingsFound: 0,
  redFlags: ["Error reading document"],
  debug: String(error)
    });
  }
}
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// 1. Define the Interface so TypeScript knows what to expect
interface AnalysisResult {
  totalFees: number;
  totalVolume: number;
  junkFees: number;
  redFlags: string[];
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fileData, fileType } = body;

    // Safety Check
    if (!fileData) {
      return NextResponse.json(
        { error: "No file data provided" },
        { status: 400 }
      );
    }

    // Initialize Model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Act as an expert Merchant Statement Auditor. Analyze this image/document.
      
      Extract or Estimate the following:
      1. "totalFees": The total amount debited/charged for the month.
      2. "totalVolume": The total sales volume processed.
      3. "junkFees": Identify specific waste (PCI Non-compliance, Statement Fees, Annual Fees, Surcharges).
      4. "redFlags": List the names of the bad fees found.

      Return ONLY valid JSON in this format:
      {
        "totalFees": number, 
        "totalVolume": number,
        "junkFees": number,
        "redFlags": string[]
      }
    `;

    const result = await model.generateContent([
      prompt,
      { inlineData: { data: fileData, mimeType: fileType || "application/pdf" } },
    ]);

    const responseText = result.response.text();
    
    // Clean the markdown ticks
    const jsonString = responseText.replace(/```json|```/g, "").trim();
    
    // 2. Cast the result to the Interface
    const parsed = JSON.parse(jsonString) as AnalysisResult;

    return NextResponse.json({
      totalFees: parsed.totalFees || 0,
      savingsFound: parsed.junkFees || 0,
      redFlags: parsed.redFlags || [],
    });

  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    // Return the specific error message to the frontend
    return NextResponse.json({ 
      totalFees: 0, 
      savingsFound: 0, 
      redFlags: [],
      error: error instanceof Error ? error.message : String(error)
    });
  }
}