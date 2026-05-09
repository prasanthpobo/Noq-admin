import React, { useState, useMemo } from 'react';
import { HiSearch, HiDownload, HiCurrencyRupee, HiCheckCircle, HiClock, HiExclamation } from 'react-icons/hi';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Header } from '../components/layout/Header';
import { StatCard } from '../components/ui/StatCard';
import { Badge } from '../components/ui/Badge';

interface Invoice {
  id: string; invoiceNo: string; patient: string; doctor: string; dept: string;
  date: string; amount: number; paid: number; status: 'paid' | 'pending' | 'partial' | 'refunded';
  type: string;
}

const INVOICES: Invoice[] = [
  { id:'1', invoiceNo:'INV-2026-0842', patient:'Aarav Sharma',   doctor:'Dr. Ananya Rao',   dept:'General OPD',  date:'2026-05-10', amount:400,  paid:400,  status:'paid',    type:'Consultation' },
  { id:'2', invoiceNo:'INV-2026-0843', patient:'Meera Iyer',     doctor:'Dr. Vikram Mehta', dept:'Cardiology',   date:'2026-05-10', amount:800,  paid:0,    status:'pending', type:'Consultation' },
  { id:'3', invoiceNo:'INV-2026-0844', patient:'Suresh Patel',   doctor:'Dr. Neha Sharma',  dept:'Gynecology',   date:'2026-05-10', amount:700,  paid:350,  status:'partial', type:'Consultation' },
  { id:'4', invoiceNo:'INV-2026-0845', patient:'Riya Kapoor',    doctor:'Dr. Rahul Khanna', dept:'Pediatrics',   date:'2026-05-10', amount:500,  paid:500,  status:'paid',    type:'Consultation' },
  { id:'5', invoiceNo:'INV-2026-0846', patient:'Karthik Nair',   doctor:'Dr. Arjun Desai',  dept:'Orthopedics',  date:'2026-05-10', amount:750,  paid:0,    status:'pending', type:'Consultation' },
  { id:'6', invoiceNo:'INV-2026-0847', patient:'Rohan Singh',    doctor:'Dr. Ananya Rao',   dept:'General OPD',  date:'2026-05-09', amount:400,  paid:400,  status:'paid',    type:'Consultation' },
  { id:'7', invoiceNo:'INV-2026-0848', patient:'Tanvi Joshi',    doctor:'Dr. Priya Iyer',   dept:'Dermatology',  date:'2026-05-09', amount:600,  paid:600,  status:'paid',    type:'Consultation' },
  { id:'8', invoiceNo:'INV-2026-0849', patient:'Devansh Gupta',  doctor:'Dr. Vikram Mehta', dept:'Cardiology',   date:'2026-05-09', amount:800,  paid:-200, status:'refunded',type:'Consultation' },
  { id:'9', invoiceNo:'INV-2026-0850', patient:'Ishaan Verma',   doctor:'Dr. Rahul Khanna', dept:'Pediatrics',   date:'2026-05-08', amount:500,  paid:500,  status:'paid',    type:'Consultation' },
  { id:'10',invoiceNo:'INV-2026-0851', patient:'Priya Nair',     doctor:'Dr. Arjun Desai',  dept:'Orthopedics',  date:'2026-05-08', amount:750,  paid:0,    status:'pending', type:'Consultation' },
];

const WEEKLY_REVENUE = [
  { day:'Mon', revenue:4200, target:5000 }, { day:'Tue', revenue:5800, target:5000 },
  { day:'Wed', revenue:3900, target:5000 }, { day:'Thu', revenue:6100, target:5000 },
  { day:'Fri', revenue:7200, target:5000 }, { day:'Sat', revenue:5500, target:5000 },
  { day:'Today', revenue:3150, target:5000 },
];

const STATUS_FILTERS = ['All', 'paid', 'pending', 'partial', 'refunded'];

const statusBadge = (s: string) => {
  if (s === 'paid')     return <Badge variant="success" dot>Paid</Badge>;
  if (s === 'pending')  return <Badge variant="warning" dot>Pending</Badge>;
  if (s === 'partial')  return <Badge variant="info" dot>Partial</Badge>;
  return <Badge variant="muted" dot>Refunded</Badge>;
};

export const Billing = () => {
  const [filter, setFilter] = useState('All');
  const [q, setQ] = useState('');

  const filtered = useMemo(() => INVOICES.filter(i => {
    const fm = filter === 'All' || i.status === filter;
    const qm = !q || i.patient.toLowerCase().includes(q.toLowerCase()) || i.invoiceNo.toLowerCase().includes(q.toLowerCase());
    return fm && qm;
  }), [filter, q]);

  const todayRevenue = INVOICES.filter(i => i.date === '2026-05-10' && i.status === 'paid').reduce((s,i) => s+i.paid, 0);
  const pending     = INVOICES.filter(i => i.status === 'pending').reduce((s,i) => s+i.amount, 0);
  const collected   = INVOICES.filter(i => i.status === 'paid').reduce((s,i) => s+i.paid, 0);
  const refunded    = INVOICES.filter(i => i.status === 'refunded').length;

  const counts: Record<string,number> = { All: INVOICES.length, paid: INVOICES.filter(i=>i.status==='paid').length, pending: INVOICES.filter(i=>i.status==='pending').length, partial: INVOICES.filter(i=>i.status==='partial').length, refunded: INVOICES.filter(i=>i.status==='refunded').length };

  return (
    <div>
      <Header title="Billing" crumbs="Today's consultation invoices" />
      <div className="p-6 space-y-5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={HiCurrencyRupee} tone="blue"  label="Today's revenue"  value={`₹${todayRevenue.toLocaleString()}`} delta="+8%" up foot="collected today" />
          <StatCard icon={HiCheckCircle}   tone="mint"  label="Total collected"  value={`₹${collected.toLocaleString()}`} foot={`${counts.paid} invoices`} />
          <StatCard icon={HiClock}         tone="amber" label="Pending amount"   value={`₹${pending.toLocaleString()}`} foot={`${counts.pending} unpaid`} />
          <StatCard icon={HiExclamation}   tone="rose"  label="Refunds"          value={refunded} foot="this month" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E3EAF2] shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-[#1A1A1A]">Weekly revenue</h3>
                <p className="text-xs text-[#6B7C93]">Daily collections vs target</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={WEEKLY_REVENUE} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F4FA" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize:11, fill:'#6B7C93' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize:11, fill:'#6B7C93' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: any) => [`₹${Number(v).toLocaleString()}`, '']} contentStyle={{ borderRadius:12, border:'1px solid #E3EAF2', fontSize:12 }} />
                <Bar dataKey="revenue" fill="#2C6ED5" radius={[6,6,0,0]} />
                <Bar dataKey="target" fill="#E3EAF2" radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white rounded-2xl border border-[#E3EAF2] shadow-sm p-5">
            <h3 className="font-bold text-[#1A1A1A] mb-4">Revenue by department</h3>
            <div className="space-y-3">
              {[['General OPD',38,'#2C6ED5'],['Cardiology',24,'#1FA3A8'],['Orthopedics',18,'#1E4FA3'],['Pediatrics',12,'#6366F1'],['Dermatology',8,'#EC4899']].map(([dept,pct,color]) => (
                <div key={dept as string}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-[#3D4A5B]">{dept}</span>
                    <span className="text-[#6B7C93]">{pct}%</span>
                  </div>
                  <div className="h-2 bg-[#EEF2F7] rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width:`${pct}%`, background: color as string }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E3EAF2] shadow-sm overflow-hidden">
          <div className="flex items-center flex-wrap gap-3 p-4 border-b border-[#E3EAF2]">
            <div className="flex items-center gap-2 bg-[#F5F8FC] border border-[#E3EAF2] rounded-xl px-3 py-2">
              <HiSearch size={15} className="text-[#A0AEC0]" />
              <input placeholder="Patient or invoice no…" value={q} onChange={e => setQ(e.target.value)} className="bg-transparent text-sm text-[#3D4A5B] outline-none w-44" />
            </div>
            <div className="flex items-center gap-1.5">
              {STATUS_FILTERS.map(f => (
                <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all capitalize ${filter === f ? 'brand-gradient text-white shadow-sm' : 'bg-[#F5F8FC] text-[#6B7C93] hover:bg-[#E8F1FD]'}`}>
                  {f} <span className="opacity-70">{counts[f]}</span>
                </button>
              ))}
            </div>
            <div className="ml-auto">
              <button className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[#E3EAF2] text-sm font-medium text-[#6B7C93] hover:bg-[#F5F8FC]">
                <HiDownload size={14} /> Export
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[10px] font-bold uppercase tracking-wider text-[#A0AEC0] bg-[#F5F8FC]">
                  <th className="px-4 py-3 text-left">Invoice</th>
                  <th className="px-4 py-3 text-left">Patient</th>
                  <th className="px-4 py-3 text-left">Doctor</th>
                  <th className="px-4 py-3 text-left">Dept</th>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                  <th className="px-4 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEF2F7]">
                {filtered.map(inv => (
                  <tr key={inv.id} className="hover:bg-[#F5F8FC] transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-[#6B7C93]">{inv.invoiceNo}</td>
                    <td className="px-4 py-3 font-semibold text-[#1A1A1A]">{inv.patient}</td>
                    <td className="px-4 py-3 text-[#3D4A5B]">{inv.doctor}</td>
                    <td className="px-4 py-3 text-[#6B7C93]">{inv.dept}</td>
                    <td className="px-4 py-3 text-xs text-[#6B7C93]">{inv.date}</td>
                    <td className="px-4 py-3 text-right">
                      <span className="font-bold text-[#1A1A1A]">₹{inv.amount}</span>
                      {inv.status === 'partial' && <span className="text-xs text-[#6B7C93] ml-1">(₹{inv.paid} paid)</span>}
                    </td>
                    <td className="px-4 py-3">{statusBadge(inv.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-[#EEF2F7] text-sm text-[#6B7C93]">
            Showing <b className="text-[#1A1A1A]">{filtered.length}</b> of {INVOICES.length} invoices
          </div>
        </div>
      </div>
    </div>
  );
};
