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