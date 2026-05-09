import React, { useState, useEffect, useMemo } from 'react';
import { HiSearch, HiPencil, HiTrash, HiUsers, HiUserAdd } from 'react-icons/hi';
import { Header } from '../components/layout/Header';
import { StatCard } from '../components/ui/StatCard';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Avatar } from '../components/ui/Avatar';
import { usersAPI } from '../services/api';
import { avatarColor } from '../utils/helpers';

interface Nurse {
  _id: string; name: string; email: string; phone?: string;
  department?: string; shift?: string; experience?: string;
  isActive: boolean; role: string; createdAt: string;
}

const SAMPLE: Nurse[] = [
  { _id:'1', name:'Anjali Sharma',   email:'anjali.s@noq.health',  phone:'+91 98765 21001', department:'General OPD',  shift:'Morning',   experience:'5 yrs',  isActive:true,  role:'nurse', createdAt:'' },
  { _id:'2', name:'Preethi Menon',   email:'preethi.m@noq.health', phone:'+91 98765 21002', department:'Cardiology',   shift:'Afternoon', experience:'8 yrs',  isActive:true,  role:'nurse', createdAt:'' },
  { _id:'3', name:'Sunita Rao',      email:'sunita.r@noq.health',  phone:'+91 98765 21003', department:'Pediatrics',   shift:'Morning',   experience:'3 yrs',  isActive:true,  role:'nurse', createdAt:'' },
  { _id:'4', name:'Kavitha Nair',    email:'kavitha.n@noq.health', phone:'+91 98765 21004', department:'Surgery',      shift:'Night',     experience:'10 yrs', isActive:false, role:'nurse', createdAt:'' },
  { _id:'5', name:'Deepa Krishnan',  email:'deepa.k@noq.health',   phone:'+91 98765 21005', department:'Orthopaedics', shift:'Morning',   experience:'6 yrs',  isActive:true,  role:'nurse', createdAt:'' },
  { _id:'6', name:'Renu Pandey',     email:'renu.p@noq.health',    phone:'+91 98765 21006', department:'Dermatology',  shift:'Afternoon', experience:'4 yrs',  isActive:true,  role:'nurse', createdAt:'' },
  { _id:'7', name:'Meghna Desai',    email:'meghna.d@noq.health',  phone:'+91 98765 21007', department:'Gynecology',   shift:'Morning',   experience:'7 yrs',  isActive:false, role:'nurse', createdAt:'' },
  { _id:'8', name:'Lalitha Varma',   email:'lalitha.v@noq.health', phone:'+91 98765 21008', department:'General OPD',  shift:'Night',     experience:'2 yrs',  isActive:true,  role:'nurse', createdAt:'' },
  { _id:'9', name:'Pooja Iyer',      email:'pooja.i@noq.health',   phone:'+91 98765 21009', department:'Cardiology',   shift:'Morning',   experience:'9 yrs',  isActive:true,  role:'nurse', createdAt:'' },
];

const SHIFTS = ['Morning', 'Afternoon', 'Evening', 'Night'];
const DEPTS = ['General OPD', 'Cardiology', 'Pediatrics', 'Surgery', 'Orthopaedics', 'Dermatology', 'Gynecology', 'Emergency'];

interface FormState { name:string; email:string; phone:string; department:string; shift:string; experience:string; password:string }
const empty: FormState = { name:'', email:'', phone:'', department:'General OPD', shift:'Morning', experience:'', password:'' };

export const Nurses = () => {
  const [nurses, setNurses] = useState<Nurse[]>(SAMPLE);
  const [q, setQ] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [modal, setModal] = useState<'create' | 'edit' | null>(null);
  const [editing, setEditing] = useState<Nurse | null>(null);
  const [form, setForm] = useState<FormState>(empty);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    usersAPI.list({ role: 'nurse' }).then(r => { if (r.data?.data?.length) setNurses(r.data.data); }).catch(() => {});
  }, []);

  const allDepts = useMemo(() => ['All', ...Array.from(new Set(nurses.map(n => n.department || '')))], [nurses]);

  const filtered = useMemo(() => nurses.filter(n => {
    const dm = deptFilter === 'All' || n.department === deptFilter;
    const qm = !q || n.name.toLowerCase().includes(q.toLowerCase()) || (n.phone || '').includes(q);
    return dm && qm;
  }), [nurses, deptFilter, q]);

  const onDuty = nurses.filter(n => n.isActive).length;

  const openCreate = () => { setEditing(null); setForm(empty); setModal('create'); };
  const openEdit = (n: Nurse) => {
    setEditing(n);
    setForm({ name:n.name, email:n.email, phone:n.phone||'', department:n.department||'', shift:n.shift||'Morning', experience:n.experience||'', password:'' });
    setModal('edit');
  };
  const upd = (k: keyof FormState, v: string) => setForm(p => ({ ...p, [k]: v }));

  const save = async () => {
    setSaving(true);
    const payload = { ...form, role: 'nurse' };
    try {
      if (editing) {
        await usersAPI.update(editing._id, payload);
        setNurses(ns => ns.map(n => n._id === editing._id ? { ...n, ...payload } : n));
      } else {
        const r = await usersAPI.create(payload);
        setNurses(ns => [r.data.data, ...ns]);
      }
      setModal(null);
    } catch {
      if (!editing) {
        const nn: Nurse = { _id:Date.now().toString(), isActive:true, createdAt:'', ...payload };
        setNurses(ns => [nn, ...ns]);
      }
      setModal(null);
    } finally { setSaving(false); }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try { await usersAPI.delete(deleteId); } catch {}
    setNurses(ns => ns.filter(n => n._id !== deleteId));
    setDeleteId(null);
  };

  const shiftColor: Record<string,string> = { Morning:'bg-amber-100 text-amber-700', Afternoon:'bg-blue-100 text-blue-700', Evening:'bg-purple-100 text-purple-700', Night:'bg-indigo-100 text-indigo-700' };

  return (
    <div>
      <Header title="Nurse management" crumbs={`${nurses.length} nurses · ${onDuty} on duty`} onAdd={openCreate} addLabel="Add nurse" />
      <div className="p-6 space-y-5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={HiUsers}   tone="blue"  label="Total nurses"  value={nurses.length} delta="+2%" up foot="registered" />
          <StatCard icon={HiUserAdd} tone="mint"  label="On duty"       value={onDuty} foot="active today" />
          <StatCard icon={HiUsers}   tone="amber" label="Morning shift"  value={nurses.filter(n=>n.shift==='Morning').length} foot="8am – 2pm" />
          <StatCard icon={HiUsers}   tone="indigo" label="Night shift"   value={nurses.filter(n=>n.shift==='Night').length} foot="10pm – 6am" />
        </div>

        <div className="bg-white rounded-2xl border border-[#E3EAF2] shadow-sm overflow-hidden">
          <div className="flex items-center flex-wrap gap-3 p-4 border-b border-[#E3EAF2]">
            <div className="flex items-center gap-2 bg-[#F5F8FC] border border-[#E3EAF2] rounded-xl px-3 py-2">
              <HiSearch size={15} className="text-[#A0AEC0]" />
              <input placeholder="Name or phone…" value={q} onChange={e => setQ(e.target.value)} className="bg-transparent text-sm text-[#3D4A5B] outline-none w-40" />
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {allDepts.map(d => (
                <button key={d} onClick={() => setDeptFilter(d)} className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${deptFilter === d ? 'brand-gradient text-white shadow-sm' : 'bg-[#F5F8FC] text-[#6B7C93] hover:bg-[#E8F1FD]'}`}>
                  {d}
                </button>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[10px] font-bold uppercase tracking-wider text-[#A0AEC0] bg-[#F5F8FC]">
                  <th className="px-4 py-3 text-left">Nurse</th>
                  <th className="px-4 py-3 text-left">Department</th>
                  <th className="px-4 py-3 text-left">Shift</th>
                  <th className="px-4 py-3 text-left">Experience</th>
                  <th className="px-4 py-3 text-left">Phone</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEF2F7]">
                {filtered.map(n => (
                  <tr key={n._id} className="hover:bg-[#F5F8FC] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={n.name} tone={avatarColor(n.name)} size="sm" />
                        <div>
                          <div className="font-semibold text-[#1A1A1A]">{n.name}</div>
                          <div className="text-xs text-[#6B7C93]">{n.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[#3D4A5B]">{n.department || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${shiftColor[n.shift||'Morning'] || 'bg-gray-100 text-gray-600'}`}>{n.shift || '—'}</span>
                    </td>
                    <td className="px-4 py-3 text-[#6B7C93]">{n.experience || '—'}</td>
                    <td className="px-4 py-3 text-xs text-[#6B7C93] tabular-nums">{n.phone || '—'}</td>
                    <td className="px-4 py-3">
                      {n.isActive ? <Badge variant="success" dot>Active</Badge> : <Badge variant="muted" dot>Inactive</Badge>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(n)} className="p-1.5 rounded-lg hover:bg-[#E8F1FD] text-[#6B7C93] hover:text-[#1E4FA3] transition-colors"><HiPencil size={14}/></button>
                        <button onClick={() => setDeleteId(n._id)} className="p-1.5 rounded-lg hover:bg-red-50 text-[#6B7C93] hover:text-red-600 transition-colors"><HiTrash size={14}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-[#EEF2F7] text-sm text-[#6B7C93]">
            Showing <b className="text-[#1A1A1A]">{filtered.length}</b> of {nurses.length}
          </div>
        </div>
      </div>

      <Modal open={!!modal} onClose={() => setModal(null)} title={modal === 'create' ? 'Add nurse' : 'Edit nurse'} subtitle={editing?.name}
        footer={<>
          <button onClick={() => setModal(null)} className="px-4 py-2 rounded-xl border border-[#E3EAF2] text-sm font-medium text-[#6B7C93] hover:bg-[#F5F8FC]">Cancel</button>
          <button onClick={save} disabled={saving} className="px-5 py-2 rounded-xl brand-gradient text-white text-sm font-semibold shadow-sm hover:opacity-90 disabled:opacity-60">{saving ? 'Saving…' : modal === 'create' ? 'Add nurse' : 'Save changes'}</button>
        </>}>
        <div className="grid grid-cols-2 gap-4">
          {([['name','Full name'],['email','Email'],['phone','Phone'],['experience','Experience']] as [keyof FormState,string][]).map(([k,label]) => (
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

      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Remove nurse" size="md"
        footer={<>
          <button onClick={() => setDeleteId(null)} className="px-4 py-2 rounded-xl border border-[#E3EAF2] text-sm font-medium text-[#6B7C93] hover:bg-[#F5F8FC]">Cancel</button>
          <button onClick={confirmDelete} className="px-5 py-2 rounded-xl bg-red-600 text-white text-sm font-semibold shadow-sm hover:bg-red-700">Remove</button>
        </>}>
        <p className="text-sm text-[#6B7C93]">This will permanently remove the nurse account.</p>
      </Modal>
    </div>
  );
};
