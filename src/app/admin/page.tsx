
"use client";
import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShieldAlert, Download, ArrowUpDown, TrendingDown } from "lucide-react";

const MOCK_LEADS = [
  { id: '1', createdAt: '2026-02-15T10:00:00Z', merchantName: 'Jane Doe', company: 'Acme Corp', phone: '(555) 123-4567', businessEmail: 'jane@acme.com', processorName: 'Fiserv', monthlyVolume: 45000, wasteAmount: 850, redFlags: 4, effectiveRate: 3.8, is_pro: false },
  { id: '2', createdAt: '2026-02-16T14:20:00Z', merchantName: 'John Doe', company: 'Acme Corp', phone: '(555) 987-6543', businessEmail: 'john@acme.com', processorName: 'Chase', monthlyVolume: 120000, wasteAmount: 2100, redFlags: 7, effectiveRate: 4.1, is_pro: false },
  { id: '3', createdAt: '2026-02-17T08:45:00Z', merchantName: 'Alex Lee', company: 'Acme Corp', phone: '(555) 000-0000', businessEmail: 'alex@acme.com', processorName: 'Stripe', monthlyVolume: 15000, wasteAmount: 120, redFlags: 2, effectiveRate: 2.9, is_pro: true },
  { id: '4', createdAt: '2026-01-01T08:00:00Z', merchantName: 'Head Badger', company: 'Basis Badger', phone: '(555) 111-2222', businessEmail: 'basisbadgerllc@gmail.com', processorName: 'Stripe', monthlyVolume: 100000, wasteAmount: 5000, redFlags: 10, effectiveRate: 2.5, is_pro: true },
];

export default function AdminPage() {
  const [leads, setLeads] = useState(MOCK_LEADS);
  const [user, setUser] = useState<{ email: string | null } | null>(null);
  const router = useRouter();
  useEffect(() => {
    const loggedInUser = { email: typeof window !== 'undefined' ? localStorage.getItem('user_email') : null };
    setUser(loggedInUser);
    if (loggedInUser.email !== "basisbadgerllc@gmail.com") {
      router.replace("/");
    }
  }, [router]);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  const stats = useMemo(() => {
    const totalWaste = leads.reduce((sum, lead) => sum + (lead.wasteAmount || 0), 0);
    const avgRate = (leads.reduce((sum, lead) => sum + (lead.effectiveRate || 0), 0) / (leads.length || 1)).toFixed(2);
    const processors = leads.map(l => l.processorName);
    const topPredator = processors.sort((a,b) =>
      processors.filter(v => v===a).length - processors.filter(v=>v===b).length
    ).pop();
    return { totalWaste, avgRate, topPredator };
  }, [leads]);

  const sortedLeads = useMemo(() => {
    let sortableLeads = [...leads];
    if (sortConfig !== null) {
      sortableLeads.sort((a: any, b: any) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableLeads;
  }, [leads, sortConfig]);

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig?.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Email,Processor,Volume,Waste,Flags\n" + 
      leads.map(l => `${l.merchantName},${l.processorName},${l.monthlyVolume},${l.wasteAmount},${l.redFlags}`).join("\n");
    window.open(encodeURI(csvContent));
  };

  if (!user || user.email !== "basisbadgerllc@gmail.com") {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white font-sans p-8">
      <main className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div className="flex items-center gap-3">
            <img src="/badger.svg" alt="Basis Badger Logo" width={36} height={36} />
            <h1 className="text-4xl font-black" style={{ color: '#F29C1F' }}>COMMAND CENTER</h1>
          </div>
          <p className="text-zinc-500 mt-1 uppercase text-xs tracking-[0.2em]">Forensic Lead Intelligence</p>
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 text-black px-6 py-2 rounded font-bold hover:brightness-110 transition-all text-sm"
            style={{ background: '#F29C1F' }}
          >
            <Download size={16} /> EXPORT CSV
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatCard title="Total Waste Exposed" value={`$${stats.totalWaste.toLocaleString()}`} icon={<TrendingDown className="text-red-500" />} accent="#F29C1F" />
          <StatCard title="Avg. Effective Rate" value={`${stats.avgRate}%`} icon={<ShieldAlert style={{ color: '#F29C1F' }} />} accent="#F29C1F" />
          <StatCard title="Top Predator" value={stats.topPredator || 'N/A'} icon={<ShieldAlert style={{ color: '#F29C1F' }} />} accent="#F29C1F" />
        </div>
        <div className="bg-[#1A1A1A] border border-zinc-800 rounded-lg overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/50 text-zinc-500 text-xs uppercase tracking-widest border-b border-zinc-800">
                <TableHead label="Merchant Name" onClick={() => requestSort('merchantName')} />
                <TableHead label="Company" onClick={() => requestSort('company')} />
                <TableHead label="Phone" onClick={() => requestSort('phone')} />
                <TableHead label="Business Email" onClick={() => requestSort('businessEmail')} />
                <TableHead label="Processor" onClick={() => requestSort('processorName')} />
                <TableHead label="Mo. Volume" onClick={() => requestSort('monthlyVolume')} />
                <TableHead label="Annual Waste" onClick={() => requestSort('wasteAmount')} />
                <TableHead label="Red Flags" onClick={() => requestSort('redFlags')} />
                <TableHead label="Subscription" onClick={() => requestSort('is_pro')} />
                <TableHead label="" onClick={() => {}} />
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {sortedLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-zinc-800/30 transition-colors">
                  <td className="p-4 font-medium">{lead.merchantName}</td>
                  <td className="p-4 text-zinc-400">{lead.company}</td>
                  <td className="p-4 text-zinc-400">{lead.phone}</td>
                  <td className="p-4 text-zinc-400">{lead.businessEmail}</td>
                  <td className="p-4 text-zinc-400">{lead.processorName}</td>
                  <td className="p-4 text-zinc-400">${lead.monthlyVolume.toLocaleString()}</td>
                  <td className="p-4 font-bold" style={{ color: '#F29C1F' }}>${lead.wasteAmount.toLocaleString()}</td>
                  <td className="p-4">
                    <span className="bg-red-500/10 text-red-500 px-2 py-1 rounded text-xs font-bold border border-red-500/20">
                      {lead.redFlags} FLAGS
                    </span>
                  </td>
                  <td className="p-4">
                    {lead.is_pro ? (
                      <span className="text-green-400 font-bold">Pro</span>
                    ) : (
                      <span className="text-zinc-400">Free</span>
                    )}
                  </td>
                  <td className="p-4">
                    {!lead.is_pro && (
                      <button
                        className="px-4 py-2 rounded-full bg-amber-500 text-zinc-900 font-bold hover:bg-amber-400 transition-all shadow"
                        onClick={() => {
                          setLeads(leads => leads.map(l => l.id === lead.id ? { ...l, is_pro: true } : l));
                        }}
                      >
                        Grant Forensic Access
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, icon, accent }: { title: string; value: string; icon: React.ReactNode; accent?: string }) {
  return (
    <div className="bg-[#1A1A1A] p-6 border border-zinc-800 rounded-lg shadow-xl">
      <div className="flex justify-between items-start mb-4">
        <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">{title}</span>
        {icon}
      </div>
      <p className="text-4xl font-black tracking-tighter" style={accent ? { color: accent } : {}}>{value}</p>
    </div>
  );
}

function TableHead({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <th className="p-4 cursor-pointer hover:text-white transition-colors group" onClick={onClick}>
      <div className="flex items-center gap-2">
        {label} <ArrowUpDown size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </th>
  );
}