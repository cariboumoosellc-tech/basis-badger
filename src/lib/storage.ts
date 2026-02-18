export type Lead = {
  merchantName: string;
  processorName?: string;
  monthlyVolume?: number;
  wasteAmount?: number;
  createdAt: string;
};

const leads: Lead[] = [];

export function saveLead(lead: Lead) {
  leads.push({ ...lead, createdAt: new Date().toISOString() });
}

export function getLeads(): Lead[] {
  return leads;
}
