import React, { useState, useMemo } from 'react';
import { HiSearch, HiClipboardList, HiCheckCircle, HiClock, HiExclamation } from 'react-icons/hi';
import { Header } from '../components/layout/Header';
import { StatCard } from '../components/ui/StatCard';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';

interface Drug { name: string; qty: string; dosage: string }
interface Prescription {
  id: string; rxNo: string; patient: string; patientId: string; doctor: string;
  date: string; drugs: Drug[]; status: 'pending' | 'dispensed' | 'partial' | 'returned';
  note?: string;
}

const PRESCRIPTIONS: Prescription[] = [
  { id:'1', rxNo:'RX-2026-0421', patient:'Aarav Sharma',   patientId:'P-1001', doctor:'Dr. Ananya Rao',   date:'2026-05-10', drugs:[{ name:'Paracetamol 500mg', qty:'10 tabs', dosage:'1-0-1' },{ name:'Cetirizine 10mg', qty:'5 tabs', dosage:'0-0-1' }], status:'dispensed' },
  { id:'2', rxNo:'RX-2026-0422', patient:'Meera Iyer',     patientId:'P-1002', doctor:'Dr. Vikram Mehta', date:'2026-05-10', drugs:[{ name:'Atorvastatin 40mg', qty:'30 tabs', dosage:'0-0-1' },{ name:'Metoprolol 25mg', qty:'30 tabs', dosage:'1-0-1' }], status:'pending' },
  { id:'3', rxNo:'RX-2026-0423', patient:'Suresh Patel',   patientId:'P-1003', doctor:'Dr. Neha Sharma',  date:'2026-05-10', drugs:[{ name:'Amoxicillin 500mg', qty:'21 caps', dosage:'1-1-1' }], status:'pending' },
  { id:'4', rxNo:'RX-2026-0424', patient:'Karthik Nair',   patientId:'P-1005', doctor:'Dr. Arjun Desai',  date:'2026-05-10', drugs:[{ name:'Diclofenac 50mg', qty:'10 tabs', dosage:'1-0-1' },{ name:'Pantoprazole 40mg', qty:'10 tabs', dosage:'1-0-0' }], status:'partial' },
  { id:'5', rxNo:'RX-2026-0425', patient:'Rohan Singh',    patientId:'P-1006', doctor:'Dr. Ananya Rao',   date:'2026-05-09', drugs:[{ name:'Azithromycin 500mg', qty:'3 tabs', dosage:'1-0-0' }], status:'dispensed' },
  { id:'6', rxNo:'RX-2026-0426', patient:'Tanvi Joshi',    patientId:'P-1007', doctor:'Dr. Priya Iyer',   date:'2026-05-09', drugs:[{ name:'Clotrimazole cream', qty:'1 tube', dosage:'Apply BD' }], status:'dispensed' },
  { id:'7', rxNo:'RX-2026-0427', patient:'Devansh Gupta',  patientId:'P-1008', doctor:'Dr. Vikram Mehta', date:'2026-05-09', drugs:[{ name:'Amlodipine 5mg', qty:'30 tabs', dosage:'0-0-1' }], status:'returned' },
];

const LOW_STOCK = [
  { name:'Metformin 500mg', stock:12, min:50 }, { name:'Insulin Glargine', stock:5, min:20 },
  { name:'Clopidogrel 75mg', stock:8, min:30 }, { name:'Losartan 50mg', stock:18, min:50 },
];

const FILTERS = ['All','pending','dispensed','partial','returned'];

const statusBadge = (s: string) => {
  if (s === 'dispensed') return <Badge variant="success" dot>Dispensed</Badge>;
  if (s === 'pending')   return <Badge variant="warning" dot>Pending</Badge>;
  if (s === 'partial')   return <Badge variant="info" dot>Partial</Badge>;
  return <Badge variant="muted" dot>Returned</Badge>;
};

export const Pharmacy = () => {
  const [prescriptions, setPrescriptions] = useState(PRESCRIPTIONS);
  const [filter, setFilter] = useState('All');
  const [q, setQ] = useState('');
  const [viewing, setViewing] = useState<Prescription | null>(null);

  const filtered = useMemo(() => prescriptions.filter(p => {
    const fm = filter === 'All' || p.status === filter;
    const qm = !q || p.patient.toLowerCase().includes(q.toLowerCase()) || p.rxNo.toLowerCase().includes(q.toLowerCase());
    return fm && qm;
  }), [prescriptions, filter, q]);

  const counts: Record<string,number> = {
    All: prescriptions.length,
    pending: prescriptions.filter(p=>p.status==='pending').length,
    dispensed: prescriptions.filter(p=>p.status==='dispensed').length,
    partial: prescriptions.filter(p=>p.status==='partial').length,
    returned: prescriptions.filter(p=>p.status==='returned').length,
  };

  const dispense = (id: string) => {
    setPrescriptions(ps => ps.map(p => p.id === id ? { ...p, status: 'dispensed' as const } : p));
    setViewing(null);
  };

  return (
    <div>
      <Header title="Pharmacy" crumbs="Prescription dispensing" />
      <div className="p-6 space-y-5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={HiClipboardList} tone="blue"  label="Prescriptions today" value={prescriptions.filter(p=>p.date==='2026-05-10').length} foot="all statuses" />
          <StatCard icon={HiCheckCircle}   tone="mint"  label="Dispensed"           value={counts.dispensed} foot="fulfilled" />
          <StatCard icon={HiClock}         tone="amber" label="Pending"             value={counts.pending + counts.partial} foot="awaiting dispensing" />
          <StatCard icon={HiExclamation}   tone="rose"  label="Low stock alerts"    value={LOW_STOCK.length} foot="needs reorder" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
          <div className="lg:col-span-3 bg-white rounded-2xl border border-[#E3EAF2] shadow-sm overflow-hidden">
            <div className="flex items-center flex-wrap gap-3 p-4 border-b border-[#E3EAF2]">
              <div className="flex items-center gap-2 bg-[#F5F8FC] border border-[#E3EAF2] rounded-xl px-3 py-2">
                <HiSearch size={15} className="text-[#A0AEC0]" />
                <input placeholder="Patient or Rx no…" value={q} onChange={e => setQ(e.target.value)} className="bg-transparent text-sm text-[#3D4A5B] outline-none w-44" />
              </div>
              <div className="flex items-center gap-1.5">
                {FILTERS.map(f => (
                  <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all capitalize ${filter === f ? 'brand-gradient text-white shadow-sm' : 'bg-[#F5F8FC] text-[#6B7C93] hover:bg-[#E8F1FD]'}`}>
                    {f} <span className="opacity-70">{counts[f]}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[10px] font-bold uppercase tracking-wider text-[#A0AEC0] bg-[#F5F8FC]">
                    <th className="px-4 py-3 text-left">Rx No.</th>
                    <th className="px-4 py-3 text-left">Patient</th>
                    <th className="px-4 py-3 text-left">Doctor</th>
                    <th className="px-4 py-3 text-left">Drugs</th>
                    <th className="px-4 py-3 text-left">Date</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EEF2F7]">
                  {filtered.map(p => (
                    <tr key={p.id} className="hover:bg-[#F5F8FC] transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-[#6B7C93]">{p.rxNo}</td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-[#1A1A1A]">{p.patient}</div>
                        <div className="text-xs text-[#6B7C93]">{p.patientId}</div>
                      </td>
                      <td className="px-4 py-3 text-[#3D4A5B]">{p.doctor}</td>
                      <td className="px-4 py-3">
                        <div className="space-y-0.5">
                          {p.drugs.slice(0,2).map((d,i) => <div key={i} className="text-xs text-[#6B7C93]">{d.name} · {d.qty}</div>)}
                          {p.drugs.length > 2 && <div className="text-xs text-[#A0AEC0]">+{p.drugs.length-2} more</div>}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-[#6B7C93]">{p.date}</td>
                      <td className="px-4 py-3">{statusBadge(p.status)}</td>
                      <td className="px-4 py-3 text-right">
                        {(p.status === 'pending' || p.status === 'partial') ? (
                          <button onClick={() => setViewing(p)} className="px-3 py-1.5 rounded-lg brand-gradient text-white text-xs font-semibold hover:opacity-90">Dispense</button>
                        ) : (
                          <button onClick={() => setViewing(p)} className="px-3 py-1.5 rounded-lg border border-[#E3EAF2] text-xs font-medium text-[#6B7C93] hover:bg-[#F5F8FC]">View</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#E3EAF2] shadow-sm p-5">
            <h3 className="font-bold text-[#1A1A1A] mb-1">Low stock alerts</h3>
            <p className="text-xs text-[#6B7C93] mb-4">Medicines needing reorder</p>
            <div className="space-y-3">
              {LOW_STOCK.map((item, i) => (
                <div key={i} className="p-3 bg-red-50 rounded-xl border border-red-100">
                  <div className="font-semibold text-[#1A1A1A] text-xs">{item.name}</div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-red-600 font-medium">Stock: {item.stock} units</span>
                    <span className="text-xs text-[#6B7C93]">Min: {item.min}</span>
                  </div>
                  <div className="h-1.5 bg-red-100 rounded-full mt-1.5 overflow-hidden">
                    <div className="h-full bg-red-500 rounded-full" style={{ width:`${(item.stock/item.min)*100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Modal open={!!viewing} onClose={() => setViewing(null)} title="Prescription details" subtitle={viewing?.rxNo} size="md"
        footer={<>
          <button onClick={() => setViewing(null)} className="px-4 py-2 rounded-xl border border-[#E3EAF2] text-sm font-medium text-[#6B7C93] hover:bg-[#F5F8FC]">Close</button>
          {viewing && (viewing.status === 'pending' || viewing.status === 'partial') && (
            <button onClick={() => dispense(viewing.id)} className="px-5 py-2 rounded-xl brand-gradient text-white text-sm font-semibold shadow-sm hover:opacity-90">Mark as Dispensed</button>
          )}
        </>}>
        {viewing && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {[['Patient', viewing.patient], ['Patient ID', viewing.patientId], ['Doctor', viewing.doctor], ['Date', viewing.date]].map(([l,v]) => (
                <div key={l}>
                  <div className="text-xs text-[#6B7C93] font-semibold uppercase tracking-wider">{l}</div>
                  <div className="font-medium text-[#1A1A1A] mt-0.5">{v}</div>
                </div>
              ))}
            </div>
            <div>
              <div className="text-xs text-[#6B7C93] font-semibold uppercase tracking-wider mb-2">Prescribed drugs</div>
              <div className="space-y-2">
                {viewing.drugs.map((d, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-[#F5F8FC] rounded-xl">
                    <div>
                      <div className="font-medium text-[#1A1A1A] text-sm">{d.name}</div>
                      <div className="text-xs text-[#6B7C93] mt-0.5">{d.dosage}</div>
                    </div>
                    <span className="text-sm font-semibold text-[#3D4A5B]">{d.qty}</span>
                  </div>
                ))}
              </div>
            </div>
            {viewing.note && <div className="p-3 bg-amber-50 rounded-xl text-xs text-amber-800">{viewing.note}</div>}
          </div>
        )}
      </Modal>
    </div>
  );
};
