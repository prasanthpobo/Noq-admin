import React, { useState, useMemo } from 'react';
import { HiSearch, HiBeaker, HiCheckCircle, HiClock, HiExclamation, HiUpload } from 'react-icons/hi';
import { Header } from '../components/layout/Header';
import { StatCard } from '../components/ui/StatCard';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';

interface LabOrder {
  id: string; orderNo: string; patient: string; patientId: string; doctor: string;
  tests: string[]; priority: 'routine' | 'urgent' | 'critical'; date: string;
  status: 'ordered' | 'sample-collected' | 'processing' | 'completed' | 'cancelled';
  result?: string; reportUrl?: string;
}

const ORDERS: LabOrder[] = [
  { id:'1', orderNo:'LAB-2026-0301', patient:'Aarav Sharma',   patientId:'P-1001', doctor:'Dr. Ananya Rao',   tests:['CBC','Blood glucose','Lipid profile'],          priority:'routine',  date:'2026-05-10', status:'completed', result:'WBC: 6.2 K/uL · RBC: 4.8 M/uL · HB: 13.5 g/dL · BS: 98 mg/dL (Normal)' },
  { id:'2', orderNo:'LAB-2026-0302', patient:'Suresh Patel',   patientId:'P-1003', doctor:'Dr. Vikram Mehta', tests:['ECG','Troponin-I','CK-MB'],                      priority:'urgent',   date:'2026-05-10', status:'processing' },
  { id:'3', orderNo:'LAB-2026-0303', patient:'Karthik Nair',   patientId:'P-1005', doctor:'Dr. Arjun Desai',  tests:['X-Ray right knee','MRI knee joint'],             priority:'routine',  date:'2026-05-10', status:'sample-collected' },
  { id:'4', orderNo:'LAB-2026-0304', patient:'Meera Iyer',     patientId:'P-1002', doctor:'Dr. Neha Sharma',  tests:['HbA1c','Thyroid profile','Urine R/E'],           priority:'routine',  date:'2026-05-10', status:'ordered' },
  { id:'5', orderNo:'LAB-2026-0305', patient:'Devansh Gupta',  patientId:'P-1008', doctor:'Dr. Vikram Mehta', tests:['2D Echo','Stress test'],                         priority:'critical', date:'2026-05-09', status:'completed', result:'EF: 45% (Mildly reduced). Regional wall motion abnormality noted.' },
  { id:'6', orderNo:'LAB-2026-0306', patient:'Tanvi Joshi',    patientId:'P-1007', doctor:'Dr. Priya Iyer',   tests:['Skin biopsy','Culture sensitivity'],             priority:'routine',  date:'2026-05-09', status:'completed', result:'No malignant cells. Culture: Normal flora.' },
  { id:'7', orderNo:'LAB-2026-0307', patient:'Rohan Singh',    patientId:'P-1006', doctor:'Dr. Ananya Rao',   tests:['Chest X-Ray','Sputum AFB'],                      priority:'urgent',   date:'2026-05-09', status:'processing' },
  { id:'8', orderNo:'LAB-2026-0308', patient:'Riya Kapoor',    patientId:'P-1004', doctor:'Dr. Rahul Khanna', tests:['CBC','CRP','ESR'],                               priority:'routine',  date:'2026-05-08', status:'completed', result:'CRP: 0.3 (Normal). ESR: 12 mm/hr (Normal). CBC: Within normal limits.' },
];

const FILTERS = ['All','ordered','sample-collected','processing','completed'];

const statusBadge = (s: string) => {
  if (s === 'completed')         return <Badge variant="success" dot>Completed</Badge>;
  if (s === 'processing')        return <Badge variant="warning" dot>Processing</Badge>;
  if (s === 'sample-collected')  return <Badge variant="info" dot>Sample collected</Badge>;
  if (s === 'ordered')           return <Badge variant="muted" dot>Ordered</Badge>;
  return <Badge variant="muted" dot>Cancelled</Badge>;
};

const priorityBadge = (p: string) => {
  if (p === 'critical') return <Badge variant="danger">Critical</Badge>;
  if (p === 'urgent')   return <Badge variant="warning">Urgent</Badge>;
  return <Badge variant="muted">Routine</Badge>;
};

export const Lab = () => {
  const [filter, setFilter] = useState('All');
  const [q, setQ] = useState('');
  const [orders, setOrders] = useState(ORDERS);
  const [viewing, setViewing] = useState<LabOrder | null>(null);
  const [resultText, setResultText] = useState('');
  const [uploadModal, setUploadModal] = useState<LabOrder | null>(null);

  const filtered = useMemo(() => orders.filter(o => {
    const fm = filter === 'All' || o.status === filter;
    const qm = !q || o.patient.toLowerCase().includes(q.toLowerCase()) || o.orderNo.toLowerCase().includes(q.toLowerCase());
    return fm && qm;
  }), [orders, filter, q]);

  const counts: Record<string,number> = {
    All: orders.length,
    ordered: orders.filter(o=>o.status==='ordered').length,
    'sample-collected': orders.filter(o=>o.status==='sample-collected').length,
    processing: orders.filter(o=>o.status==='processing').length,
    completed: orders.filter(o=>o.status==='completed').length,
  };

  const saveResult = () => {
    if (!uploadModal) return;
    setOrders(os => os.map(o => o.id === uploadModal.id ? { ...o, status:'completed' as const, result: resultText } : o));
    setUploadModal(null);
    setResultText('');
  };

  return (
    <div>
      <Header title="Lab" crumbs="Lab orders & results" />
      <div className="p-6 space-y-5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={HiBeaker}      tone="blue"  label="Tests today"      value={orders.filter(o=>o.date==='2026-05-10').length} foot="ordered" />
          <StatCard icon={HiClock}       tone="amber" label="In progress"      value={counts.processing + counts['sample-collected']} foot="pending results" />
          <StatCard icon={HiCheckCircle} tone="mint"  label="Completed"        value={counts.completed} foot="results ready" />
          <StatCard icon={HiExclamation} tone="rose"  label="Critical priority" value={orders.filter(o=>o.priority==='critical').length} foot="immediate attention" />
        </div>

        <div className="bg-white rounded-2xl border border-[#E3EAF2] shadow-sm overflow-hidden">
          <div className="flex items-center flex-wrap gap-3 p-4 border-b border-[#E3EAF2]">
            <div className="flex items-center gap-2 bg-[#F5F8FC] border border-[#E3EAF2] rounded-xl px-3 py-2">
              <HiSearch size={15} className="text-[#A0AEC0]" />
              <input placeholder="Patient or order no…" value={q} onChange={e => setQ(e.target.value)} className="bg-transparent text-sm text-[#3D4A5B] outline-none w-44" />
            </div>
            <div className="flex items-center gap-1.5">
              {FILTERS.map(f => (
                <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all capitalize ${filter === f ? 'brand-gradient text-white shadow-sm' : 'bg-[#F5F8FC] text-[#6B7C93] hover:bg-[#E8F1FD]'}`}>
                  {f.replace('-',' ')} <span className="opacity-70">{counts[f]}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[10px] font-bold uppercase tracking-wider text-[#A0AEC0] bg-[#F5F8FC]">
                  <th className="px-4 py-3 text-left">Order No.</th>
                  <th className="px-4 py-3 text-left">Patient</th>
                  <th className="px-4 py-3 text-left">Doctor</th>
                  <th className="px-4 py-3 text-left">Tests</th>
                  <th className="px-4 py-3 text-left">Priority</th>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEF2F7]">
                {filtered.map(o => (
                  <tr key={o.id} className="hover:bg-[#F5F8FC] transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-[#6B7C93]">{o.orderNo}</td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-[#1A1A1A]">{o.patient}</div>
                      <div className="text-xs text-[#6B7C93]">{o.patientId}</div>
                    </td>
                    <td className="px-4 py-3 text-[#3D4A5B] text-xs">{o.doctor}</td>
                    <td className="px-4 py-3">
                      <div className="space-y-0.5">
                        {o.tests.slice(0,2).map((t,i) => <div key={i} className="text-xs text-[#6B7C93]">{t}</div>)}
                        {o.tests.length > 2 && <div className="text-xs text-[#A0AEC0]">+{o.tests.length-2} more</div>}
                      </div>
                    </td>
                    <td className="px-4 py-3">{priorityBadge(o.priority)}</td>
                    <td className="px-4 py-3 text-xs text-[#6B7C93]">{o.date}</td>
                    <td className="px-4 py-3">{statusBadge(o.status)}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {o.status === 'completed' && (
                          <button onClick={() => setViewing(o)} className="px-3 py-1.5 rounded-lg border border-[#E3EAF2] text-xs font-medium text-[#6B7C93] hover:bg-[#F5F8FC]">View</button>
                        )}
                        {(o.status === 'processing' || o.status === 'sample-collected') && (
                          <button onClick={() => { setUploadModal(o); setResultText(''); }} className="px-3 py-1.5 rounded-lg brand-gradient text-white text-xs font-semibold hover:opacity-90 flex items-center gap-1">
                            <HiUpload size={11} /> Upload
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-[#EEF2F7] text-sm text-[#6B7C93]">
            Showing <b className="text-[#1A1A1A]">{filtered.length}</b> of {orders.length}
          </div>
        </div>
      </div>

      <Modal open={!!viewing} onClose={() => setViewing(null)} title="Lab result" subtitle={`${viewing?.patient} · ${viewing?.orderNo}`} size="md"
        footer={<button onClick={() => setViewing(null)} className="px-4 py-2 rounded-xl border border-[#E3EAF2] text-sm font-medium text-[#6B7C93] hover:bg-[#F5F8FC]">Close</button>}>
        {viewing && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[['Patient',viewing.patient],['Doctor',viewing.doctor],['Tests ordered',viewing.tests.join(', ')],['Date',viewing.date]].map(([l,v]) => (
                <div key={l} className={l==='Tests ordered'?'col-span-2':''}>
                  <div className="text-xs text-[#6B7C93] font-semibold uppercase tracking-wider">{l}</div>
                  <div className="font-medium text-[#1A1A1A] mt-0.5">{v}</div>
                </div>
              ))}
            </div>
            {viewing.result && (
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                <div className="text-xs text-emerald-700 font-bold uppercase tracking-wider mb-2">Result summary</div>
                <div className="text-sm text-[#1A1A1A] leading-relaxed">{viewing.result}</div>
              </div>
            )}
          </div>
        )}
      </Modal>

      <Modal open={!!uploadModal} onClose={() => setUploadModal(null)} title="Upload result" subtitle={uploadModal?.orderNo} size="md"
        footer={<>
          <button onClick={() => setUploadModal(null)} className="px-4 py-2 rounded-xl border border-[#E3EAF2] text-sm font-medium text-[#6B7C93] hover:bg-[#F5F8FC]">Cancel</button>
          <button onClick={saveResult} className="px-5 py-2 rounded-xl brand-gradient text-white text-sm font-semibold shadow-sm hover:opacity-90">Save result</button>
        </>}>
        <div className="space-y-4">
          <p className="text-sm text-[#6B7C93]">Enter the result summary for <b className="text-[#1A1A1A]">{uploadModal?.patient}</b></p>
          <textarea rows={5} value={resultText} onChange={e => setResultText(e.target.value)} placeholder="Enter test results, values, and interpretation…" className="w-full px-3 py-3 border border-[#E3EAF2] rounded-xl text-sm bg-white text-[#1A1A1A] resize-none outline-none focus:border-[#2C6ED5]" />
        </div>
      </Modal>
    </div>
  );
};
