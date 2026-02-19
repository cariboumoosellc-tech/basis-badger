import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

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
