import React, { useState, useEffect, useMemo } from 'react';
import { HiSearch, HiPencil, HiTrash, HiDesktopComputer, HiUsers } from 'react-icons/hi';
import { Header } from '../components/layout/Header';
import { StatCard } from '../components/ui/StatCard';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Avatar } from '../components/ui/Avatar';
import { usersAPI } from '../services/api';
import { avatarColor, formatDate } from '../utils/helpers';

interface FDUser {
  _id: string; name: string; email: string; phone?: string;
  department?: string; shift?: string; isActive: boolean;
  lastLogin?: string; role: string; createdAt: string;
}

const SAMPLE: FDUser[] = [
  { _id:'1', name:'Ramesh Kumar',    email:'ramesh.k@noq.health',  phone:'+91 98765 31001', department:'OPD Reception',  shift:'Morning',   isActive:true,  lastLogin:'2026-05-09T08:10:00Z', role:'front_desk', createdAt:'' },
  { _id:'2', name:'Divya Suresh',    email:'divya.s@noq.health',   phone:'+91 98765 31002', department:'Emergency',     shift:'Morning',   isActive:true,  lastLogin:'2026-05-09T09:00:00Z', role:'front_desk', createdAt:'' },
  { _id:'3', name:'Arun Pillai',     email:'arun.p@noq.health',    phone:'+91 98765 31003', department:'Pharmacy',      shift:'Afternoon', isActive:true,  lastLogin:'2026-05-08T14:00:00Z', role:'front_desk', createdAt:'' },
  { _id:'4', name:'Shalini Thomas',  email:'shalini.t@noq.health', phone:'+91 98765 31004', department:'OPD Reception',  shift:'Night',     isActive:false, lastLogin:'2026-05-07T22:00:00Z', role:'front_desk', createdAt:'' },
  { _id:'5', name:'Vinod Babu',      email:'vinod.b@noq.health',   phone:'+91 98765 31005', department:'Lab',           shift:'Morning',   isActive:true,  lastLogin:'2026-05-09T07:45:00Z', role:'front_desk', createdAt:'' },
  { _id:'6', name:'Nisha George',    email:'nisha.g@noq.health',   phone:'+91 98765 31006', department:'Billing',       shift:'Afternoon', isActive:true,  lastLogin:'2026-05-09T13:20:00Z', role:'front_desk', createdAt:'' },
  { _id:'7', name:'Manoj Shetty',    email:'manoj.s@noq.health',   phone:'+91 98765 31007', department:'OPD Reception',  shift:'Morning',   isActive:true,  lastLogin:'2026-05-09T08:30:00Z', role:'front_desk', createdAt:'' },
];

const DEPTS = ['OPD Reception','Emergency','Pharmacy','Lab','Billing','Radiology'];
const SHIFTS = ['Morning','Afternoon','Evening','Night'];

interface FormState { name:string; email:string; phone:string; department:string; shift:string; password:string }
const empty: FormState = { name:'', email:'', phone:'', department:'OPD Reception', shift:'Morning', password:'' };

export const FrontDesk = () => {
  const [staff, setStaff] = useState<FDUser[]>(SAMPLE);
  const [q, setQ] = useState('');
  const [modal, setModal] = useState<'create' | 'edit' | null>(null);
  const [editing, setEditing] = useState<FDUser | null>(null);
  const [form, setForm] = useState<FormState>(empty);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    usersAPI.list({ role: 'front_desk' }).then(r => { if (r.data?.data?.length) setStaff(r.data.data); }).catch(() => {});
  }, []);

  const filtered = useMemo(() => staff.filter(s => !q || s.name.toLowerCase().includes(q.toLowerCase()) || s.email.toLowerCase().includes(q.toLowerCase())), [staff, q]);
  const active = staff.filter(s => s.isActive).length;

  const openCreate = () => { setEditing(null); setForm(empty); setModal('create'); };
  const openEdit = (s: FDUser) => {
    setEditing(s);
    setForm({ name:s.name, email:s.email, phone:s.phone||'', department:s.department||'', shift:s.shift||'Morning', password:'' });
    setModal('edit');
  };
  const upd = (k: keyof FormState, v: string) => setForm(p => ({ ...p, [k]: v }));

  const save = async () => {
    setSaving(true);
    const payload = { ...form, role: 'front_desk' };
    try {
      if (editing) {
        await usersAPI.update(editing._id, payload);
        setStaff(ss => ss.map(s => s._id === editing._id ? { ...s, ...payload } : s));
      } else {
        const r = await usersAPI.create(payload);
        setStaff(ss => [r.data.data, ...ss]);
      }
      setModal(null);
    } catch {
      if (!editing) setStaff(ss => [{ _id:Date.now().toString(), isActive:true, createdAt:'', ...payload }, ...ss]);
      setModal(null);
    } finally { setSaving(false); }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try { await usersAPI.delete(deleteId); } catch {}
    setStaff(ss => ss.filter(s => s._id !== deleteId));
    setDeleteId(null);
  };

  const shiftColor: Record<string,string> = { Morning:'bg-amber-100 text-amber-700', Afternoon:'bg-blue-100 text-blue-700', Evening:'bg-purple-100 text-purple-700', Night:'bg-indigo-100 text-indigo-700' };
  const deptColor: Record<string,string> = { 'OPD Reception':'bg-blue-100 text-blue-700', 'Emergency':'bg-red-100 text-red-700', 'Pharmacy':'bg-emerald-100 text-emerald-700', 'Lab':'bg-teal-100 text-teal-700', 'Billing':'bg-amber-100 text-amber-700', 'Radiology':'bg-purple-100 text-purple-700' };

  return (
    <div>
      <Header title="Front desk management" crumbs={`${staff.length} staff · ${active} active`} onAdd={openCreate} addLabel="Add staff" />
      <div className="p-6 space-y-5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={HiDesktopComputer} tone="blue"   label="Total staff"    value={staff.length} />
          <StatCard icon={HiUsers}           tone="mint"   label="Active today"   value={active} />
          <StatCard icon={HiDesktopComputer} tone="amber"  label="Morning shift"  value={staff.filter(s=>s.shift==='Morning').length} />
          <StatCard icon={HiDesktopComputer} tone="indigo" label="Night shift"    value={staff.filter(s=>s.shift==='Night').length} />
        </div>

        <div className="bg-white rounded-2xl border border-[#E3EAF2] shadow-sm overflow-hidden">
          <div className="flex items-center gap-3 p-4 border-b border-[#E3EAF2]">
            <div className="flex items-center gap-2 bg-[#F5F8FC] border border-[#E3EAF2] rounded-xl px-3 py-2">
              <HiSearch size={15} className="text-[#A0AEC0]" />
              <input placeholder="Name or email…" value={q} onChange={e => setQ(e.target.value)} className="bg-transparent text-sm text-[#3D4A5B] outline-none w-44" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[10px] font-bold uppercase tracking-wider text-[#A0AEC0] bg-[#F5F8FC]">
                  <th className="px-4 py-3 text-left">Staff member</th>
                  <th className="px-4 py-3 text-left">Department</th>
                  <th className="px-4 py-3 text-left">Shift</th>
                  <th className="px-4 py-3 text-left">Phone</th>
                  <th className="px-4 py-3 text-left">Last login</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEF2F7]">
                {filtered.map(s => (
                  <tr key={s._id} className="hover:bg-[#F5F8FC] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={s.name} tone={avatarColor(s.name)} size="sm" />
                        <div>
                          <div className="font-semibold text-[#1A1A1A]">{s.name}</div>
                          <div className="text-xs text-[#6B7C93]">{s.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${deptColor[s.department||''] || 'bg-gray-100 text-gray-600'}`}>{s.department||'—'}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${shiftColor[s.shift||'Morning']||'bg-gray-100 text-gray-600'}`}>{s.shift||'—'}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-[#6B7C93] tabular-nums">{s.phone||'—'}</td>
                    <td className="px-4 py-3 text-xs text-[#6B7C93]">{s.lastLogin ? formatDate(s.lastLogin) : '—'}</td>
                    <td className="px-4 py-3">{s.isActive ? <Badge variant="success" dot>Active</Badge> : <Badge variant="muted" dot>Inactive</Badge>}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(s)} className="p-1.5 rounded-lg hover:bg-[#E8F1FD] text-[#6B7C93] hover:text-[#1E4FA3] transition-colors"><HiPencil size={14}/></button>
                        <button onClick={() => setDeleteId(s._id)} className="p-1.5 rounded-lg hover:bg-red-50 text-[#6B7C93] hover:text-red-600 transition-colors"><HiTrash size={14}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-[#EEF2F7] text-sm text-[#6B7C93]">
            Showing <b className="text-[#1A1A1A]">{filtered.length}</b> of {staff.length}
          </div>
        </div>
      </div>

      <Modal open={!!modal} onClose={() => setModal(null)} title={modal==='create'?'Add front desk staff':'Edit staff'} subtitle={editing?.name}
        footer={<>
          <button onClick={() => setModal(null)} className="px-4 py-2 rounded-xl border border-[#E3EAF2] text-sm font-medium text-[#6B7C93] hover:bg-[#F5F8FC]">Cancel</button>
          <button onClick={save} disabled={saving} className="px-5 py-2 rounded-xl brand-gradient text-white text-sm font-semibold shadow-sm hover:opacity-90 disabled:opacity-60">{saving?'Saving…':modal==='create'?'Add staff':'Save changes'}</button>
        </>}>
        <div className="grid grid-cols-2 gap-4">
          {([['name','Full name'],['email','Email'],['phone','Phone']] as [keyof FormState,string][]).map(([k,label]) => (
            <div key={k} className={k==='name'?'col-span-2':''}>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B7C93] mb-1.5">{label}</label>
              <input value={form[k]} onChange={e=>upd(k,e.target.value)} className="w-full px-3 py-2.5 border border-[#E3EAF2] rounded-xl text-sm bg-white text-[#1A1A1A]" />
            </div>
          ))}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B7C93] mb-1.5">Department</label>
            <select value={form.department} onChange={e=>upd('department',e.target.value)} className="w-full px-3 py-2.5 border border-[#E3EAF2] rounded-xl text-sm bg-white">
              {DEPTS.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B7C93] mb-1.5">Shift</label>
            <select value={form.shift} onChange={e=>upd('shift',e.target.value)} className="w-full px-3 py-2.5 border border-[#E3EAF2] rounded-xl text-sm bg-white">
              {SHIFTS.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          {modal === 'create' && (
            <div className="col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B7C93] mb-1.5">Password</label>
              <input type="password" value={form.password} onChange={e=>upd('password',e.target.value)} className="w-full px-3 py-2.5 border border-[#E3EAF2] rounded-xl text-sm bg-white text-[#1A1A1A]" />
            </div>
          )}
        </div>
      </Modal>

      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Remove staff" size="md"
        footer={<>
          <button onClick={() => setDeleteId(null)} className="px-4 py-2 rounded-xl border border-[#E3EAF2] text-sm font-medium text-[#6B7C93] hover:bg-[#F5F8FC]">Cancel</button>
          <button onClick={confirmDelete} className="px-5 py-2 rounded-xl bg-red-600 text-white text-sm font-semibold shadow-sm hover:bg-red-700">Remove</button>
        </>}>
        <p className="text-sm text-[#6B7C93]">This will permanently remove this staff account.</p>
      </Modal>
    </div>
  );
};
