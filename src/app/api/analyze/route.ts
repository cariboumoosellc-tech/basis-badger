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
    const { fileData, fileType } = await req.json();

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
    const jsonString = responseText.replace(/\`\`\`json|\`\`\`/g, "").trim();

    // 2. Cast the result to the Interface
    const parsed = JSON.parse(jsonString) as AnalysisResult;

    return NextResponse.json({
      totalFees: parsed.totalFees || 0,
      savingsFound: parsed.junkFees || 0, // Map junkFees to savingsFound
      redFlags: parsed.redFlags || [],
    });
  } catch (error) {
    console.error("Gemini Error:", error);
    // Return safe defaults on error
    return NextResponse.json({ totalFees: 0, savingsFound: 0, redFlags: [] });
  }
}

export async function POST(req: Request) {
  try {
    const { fileData, fileType } = await req.json();
    if (!fileData || !fileType) {
      return NextResponse.json({ error: "Missing file data or type." }, { status: 400 });
    }
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `Analyze this merchant statement. Extract: 1. totalFees (Total amount charged). 2. totalVolume (Total sales). 3. junkFees (Sum of any suspicious fees like PCI, Non-Compliance, Annual, or markups). 4. redFlags (List of strings naming the bad fees). Return ONLY raw JSON.`;
    // Gemini expects text, so decode base64 to string
    let statementText = "";
    if (fileType === "application/pdf") {
      // For now, just pass the base64 string as-is (Gemini can handle PDF text extraction)
      statementText = fileData;
    } else {
      statementText = fileData;
    }
    const result = await model.generateContent(prompt + "\n\n" + statementText);
    const response = await result.response;
    let text = response.text();
    // Remove markdown backticks if present
    text = text.replace(/^```json|```$/g, "").trim();
    let parsed = {};
    try {
      parsed = JSON.parse(text);
    } catch {
      return NextResponse.json({ error: "Gemini response could not be parsed." }, { status: 500 });
    }
    return NextResponse.json({
      totalFees: parsed.totalFees,
      savingsFound: parsed.junkFees,
      redFlags: parsed.redFlags || [],
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Unknown error" }, { status: 500 });
  }
}
