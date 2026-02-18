import { saveLead } from "@/lib/storage";

export async function saveLeadAction({
  merchant_email,
  processor_name,
  monthly_volume,
  annual_waste_found,
}: {
  merchant_email: string;
  processor_name?: string;
  monthly_volume?: number;
  annual_waste_found?: number;
}) {
  // Replace with DB logic if needed
  saveLead({
    merchantName: merchant_email,
    processorName: processor_name,
    monthlyVolume: monthly_volume,
    wasteAmount: annual_waste_found,
    createdAt: new Date().toISOString(),
  });
  return { success: true };
}
