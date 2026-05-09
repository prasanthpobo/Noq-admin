import React, { useState, useEffect, useMemo } from 'react';
import { HiSearch, HiPencil, HiTrash, HiOfficeBuilding, HiCheckCircle, HiClock, HiXCircle } from 'react-icons/hi';
import { Header } from '../components/layout/Header';
import { StatCard } from '../components/ui/StatCard';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { clinicsAPI } from '../services/api';
import { avatarColor } from '../utils/helpers';

interface Clinic {
  _id: string; clinicId: string; name: string; type: string;
  address: { line1?: string; area?: string; city?: string; state?: string; pincode?: string };
  phone: string; email: string; status: 'active' | 'pending' | 'inactive';
  rating: number; established?: string; tokenPrefix?: string;
}

const SAMPLE: Clinic[] = [
  { _id:'1', clinicId:'C-001', name:'Sunshine Clinic', type:'Multi-specialty', address:{ area:'Koramangala', city:'Bengaluru', state:'Karnataka', pincode:'560095' }, phone:'+91 80 4567 1100', email:'hello@sunshine.health', status:'active', rating:4.7, established:'2014', tokenPrefix:'A' },
  { _id:'2', clinicId:'C-002', name:'City Heart Centre', type:'Cardiology', address:{ area:'Indiranagar', city:'Bengaluru', state:'Karnataka', pincode:'560038' }, phone:'+91 80 4567 2200', email:'info@cityheartcentre.in', status:'active', rating:4.9, established:'2011', tokenPrefix:'B' },
  { _id:'3', clinicId:'C-003', name:'Green Valley Hospital', type:'General', address:{ area:'Whitefield', city:'Bengaluru', state:'Karnataka', pincode:'560066' }, phone:'+91 80 4567 3300', email:'admin@greenvalley.in', status:'active', rating:4.5, established:'2018', tokenPrefix:'C' },
  { _id:'4', clinicId:'C-004', name:'MediCare Plus', type:'Pediatrics', address:{ area:'JP Nagar', city:'Bengaluru', state:'Karnataka', pincode:'560078' }, phone:'+91 80 4567 4400', email:'care@medicareplus.in', status:'pending', rating:4.3, established:'2022', tokenPrefix:'D' },
  { _id:'5', clinicId:'C-005', name:'Ortho Spine Centre', type:'Orthopedics', address:{ area:'Marathahalli', city:'Bengaluru', state:'Karnataka', pincode:'560037' }, phone:'+91 80 4567 5500', email:'hello@orthospine.in', status:'inactive', rating:4.1, established:'2016', tokenPrefix:'E' },
];

const FILTERS = ['All', 'active', 'pending', 'inactive'];

interface FormState { name:string; type:string; area:string; city:string; state:string; pincode:string; phone:string; email:string; tokenPrefix:string; established:string }
const empty: FormState = { name:'', type:'Multi-specialty', area:'', city:'', state:'', pincode:'', phone:'', email:'', tokenPrefix:'A', established:'' };

const statusBadge = (s: string) => {
  if (s === 'active')   return <Badge variant="success" dot>Active</Badge>;
  if (s === 'pending')  return <Badge variant="warning" dot>Pending</Badge>;
  return <Badge variant="muted" dot>Inactive</Badge>;
};

export const Clinics = () => {
  const [clinics, setClinics] = useState<Clinic[]>(SAMPLE);
  const [filter, setFilter] = useState('All');
  const [q, setQ] = useState('');
  const [modal, setModal] = useState<'create' | 'edit' | null>(null);
  const [editing, setEditing] = useState<Clinic | null>(null);
  const [form, setForm] = useState<FormState>(empty);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    clinicsAPI.list().then(r => { if (r.data?.data?.length) setClinics(r.data.data); }).catch(() => {});
  }, []);

  const counts = useMemo(() => ({
    All: clinics.length,
    active: clinics.filter(c => c.status === 'active').length,
    pending: clinics.filter(c => c.status === 'pending').length,
    inactive: clinics.filter(c => c.status === 'inactive').length,
  }), [clinics]);

  const filtered = useMemo(() => clinics.filter(c => {
    const sm = filter === 'All' || c.status === filter;
    const qm = !q || c.name.toLowerCase().includes(q.toLowerCase()) || c.clinicId.toLowerCase().includes(q.toLowerCase()) || (c.address?.city || '').toLowerCase().includes(q.toLowerCase());
    return sm && qm;
  }), [clinics, filter, q]);

  const openCreate = () => { setEditing(null); setForm(empty); setModal('create'); };
  const openEdit = (c: Clinic) => {
    setEditing(c);
    setForm({ name:c.name, type:c.type, area:c.address?.area||'', city:c.address?.city||'', state:c.address?.state||'', pincode:c.address?.pincode||'', phone:c.phone, email:c.email, tokenPrefix:c.tokenPrefix||'A', established:c.established||'' });
    setModal('edit');
  };
  const upd = (k: keyof FormState, v: string) => setForm(p => ({ ...p, [k]: v }));

  const save = async () => {
    setSaving(true);
    const payload = { name:form.name, type:form.type, address:{ area:form.area, city:form.city, state:form.state, pincode:form.pincode }, phone:form.phone, email:form.email, tokenPrefix:form.tokenPrefix, established:form.established };
    try {
      if (editing) {
        await clinicsAPI.update(editing._id, payload);
        setClinics(cs => cs.map(c => c._id === editing._id ? { ...c, ...payload } : c));
      } else {
        const r = await clinicsAPI.create(payload);
        setClinics(cs => [r.data.data, ...cs]);
      }
      setModal(null);
    } catch {
      if (!editing) {
        const nc: Clinic = { _id: Date.now().toString(), clinicId:'C-NEW', status:'active', rating:4.5, ...payload };
        setClinics(cs => [nc, ...cs]);
      }
      setModal(null);
    } finally { setSaving(false); }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try { await clinicsAPI.delete(deleteId); } catch {}
    setClinics(cs => cs.filter(c => c._id !== deleteId));
    setDeleteId(null);
  };

  const COLORS: Record<string, string> = { 'Multi-specialty':'bg-blue-100 text-blue-700', 'Cardiology':'bg-rose-100 text-rose-700', 'General':'bg-emerald-100 text-emerald-700', 'Pediatrics':'bg-amber-100 text-amber-700', 'Orthopedics':'bg-purple-100 text-purple-700', 'Dermatology':'bg-pink-100 text-pink-700', 'Gynecology':'bg-teal-100 text-teal-700' };
  const typeColor = (t: string) => COLORS[t] || 'bg-gray-100 text-gray-600';

  return (
    <div>
      <Header title="Clinic management" crumbs={`${clinics.length} clinics · ${counts.active} active`} onAdd={openCreate} addLabel="Add clinic" />
      <div className="p-6 space-y-5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={HiOfficeBuilding} tone="blue"  label="Total clinics"  value={counts.All}      foot="all branches" />
          <StatCard icon={HiCheckCircle}   tone="mint"  label="Active"          value={counts.active}   foot="operational" />
          <StatCard icon={HiClock}         tone="amber" label="Pending review"  value={counts.pending}  foot="awaiting approval" />
          <StatCard icon={HiXCircle}       tone="rose"  label="Inactive"        value={counts.inactive} foot="not in service" />
        </div>

        <div className="bg-white rounded-2xl border border-[#E3EAF2] shadow-sm overflow-hidden">
          <div className="flex items-center flex-wrap gap-3 p-4 border-b border-[#E3EAF2]">
            <div className="flex items-center gap-2 bg-[#F5F8FC] border border-[#E3EAF2] rounded-xl px-3 py-2">
              <HiSearch size={15} className="text-[#A0AEC0]" />
              <input placeholder="Clinic name or city…" value={q} onChange={e => setQ(e.target.value)} className="bg-transparent text-sm text-[#3D4A5B] outline-none w-44" />
            </div>
            <div className="flex items-center gap-1.5">
              {FILTERS.map(f => (
                <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${filter === f ? 'brand-gradient text-white shadow-sm' : 'bg-[#F5F8FC] text-[#6B7C93] hover:bg-[#E8F1FD]'}`}>
                  {f.charAt(0).toUpperCase() + f.slice(1)} <span className="opacity-70">{counts[f as keyof typeof counts]}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[10px] font-bold uppercase tracking-wider text-[#A0AEC0] bg-[#F5F8FC]">
                  <th className="px-4 py-3 text-left">Clinic</th>
                  <th className="px-4 py-3 text-left">ID</th>
                  <th className="px-4 py-3 text-left">Type</th>
                  <th className="px-4 py-3 text-left">City</th>
                  <th className="px-4 py-3 text-left">Phone</th>
                  <th className="px-4 py-3 text-left">Rating</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEF2F7]">
                {filtered.map(c => {
                  const tone = avatarColor(c.name);
                  const tones: Record<string,string> = { blue:'bg-blue-100 text-blue-800', pink:'bg-pink-100 text-pink-800', amber:'bg-amber-100 text-amber-800', mint:'bg-emerald-100 text-emerald-800', indigo:'bg-indigo-100 text-indigo-800', plum:'bg-purple-100 text-purple-800', rose:'bg-rose-100 text-rose-800', teal:'bg-teal-100 text-teal-800' };
                  return (
                    <tr key={c._id} className="hover:bg-[#F5F8FC] transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0 ${tones[tone] || tones.blue}`}>
                            {c.name.split(' ').map(n => n[0]).slice(0,2).join('')}
                          </div>
                          <div>
                            <div className="font-semibold text-[#1A1A1A]">{c.name}</div>
                            <div className="text-xs text-[#6B7C93]">{c.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-[#6B7C93]">{c.clinicId}</td>
                      <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${typeColor(c.type)}`}>{c.type}</span></td>
                      <td className="px-4 py-3 text-[#3D4A5B]">{c.address?.city || '—'}</td>
                      <td className="px-4 py-3 text-xs text-[#6B7C93] tabular-nums">{c.phone}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <span className="text-amber-500 font-bold text-sm">★</span>
                          <span className="font-semibold text-[#1A1A1A]">{c.rating}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">{statusBadge(c.status)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg hover:bg-[#E8F1FD] text-[#6B7C93] hover:text-[#1E4FA3] transition-colors"><HiPencil size={14}/></button>
                          <button onClick={() => setDeleteId(c._id)} className="p-1.5 rounded-lg hover:bg-red-50 text-[#6B7C93] hover:text-red-600 transition-colors"><HiTrash size={14}/></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-[#EEF2F7] text-sm text-[#6B7C93]">
            Showing <b className="text-[#1A1A1A]">{filtered.length}</b> of {clinics.length} clinics
          </div>
        </div>
      </div>

      <Modal open={!!modal} onClose={() => setModal(null)} title={modal === 'create' ? 'Add clinic' : 'Edit clinic'} subtitle={editing?.name}
        footer={<>
          <button onClick={() => setModal(null)} className="px-4 py-2 rounded-xl border border-[#E3EAF2] text-sm font-medium text-[#6B7C93] hover:bg-[#F5F8FC]">Cancel</button>
          <button onClick={save} disabled={saving} className="px-5 py-2 rounded-xl brand-gradient text-white text-sm font-semibold shadow-sm hover:opacity-90 disabled:opacity-60">{saving ? 'Saving…' : modal === 'create' ? 'Add clinic' : 'Save changes'}</button>
        </>}>
        <div className="grid grid-cols-2 gap-4">
          {([['name','Clinic name'],['type','Type'],['phone','Phone'],['email','Email'],['tokenPrefix','Token prefix'],['established','Est. year']] as [keyof FormState,string][]).map(([k,label]) => (
            <div key={k} className={k === 'name' ? 'col-span-2' : ''}>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B7C93] mb-1.5">{label}</label>
              <input value={form[k]} onChange={e => upd(k, e.target.value)} className="w-full px-3 py-2.5 border border-[#E3EAF2] rounded-xl text-sm bg-white text-[#1A1A1A]" />
            </div>
          ))}
          <div className="col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B7C93] mb-1.5">Area / Address</label>
            <input value={form.area} onChange={e => upd('area', e.target.value)} className="w-full px-3 py-2.5 border border-[#E3EAF2] rounded-xl text-sm bg-white text-[#1A1A1A]" />
          </div>
          {([['city','City'],['state','State'],['pincode','Pincode']] as [keyof FormState,string][]).map(([k,label]) => (
            <div key={k}>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B7C93] mb-1.5">{label}</label>
              <input value={form[k]} onChange={e => upd(k, e.target.value)} className="w-full px-3 py-2.5 border border-[#E3EAF2] rounded-xl text-sm bg-white text-[#1A1A1A]" />
            </div>
          ))}
        </div>
      </Modal>

      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete clinic" size="md"
        footer={<>
          <button onClick={() => setDeleteId(null)} className="px-4 py-2 rounded-xl border border-[#E3EAF2] text-sm font-medium text-[#6B7C93] hover:bg-[#F5F8FC]">Cancel</button>
          <button onClick={confirmDelete} className="px-5 py-2 rounded-xl bg-red-600 text-white text-sm font-semibold shadow-sm hover:bg-red-700">Delete</button>
        </>}>
        <p className="text-sm text-[#6B7C93]">This will permanently remove the clinic and cannot be undone.</p>
      </Modal>
    </div>
  );
};
