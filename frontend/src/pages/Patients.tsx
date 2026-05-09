import React, { useState, useEffect, useMemo } from 'react';
import { HiSearch, HiDownload, HiPencil, HiDotsHorizontal } from 'react-icons/hi';
import { Header } from '../components/layout/Header';
import { StatCard } from '../components/ui/StatCard';
import { Badge, tagBadge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { Modal } from '../components/ui/Modal';
import { Patient } from '../types';
import { patientsAPI } from '../services/api';
import { avatarColor } from '../utils/helpers';
import { HiUserGroup, HiUser, HiBell, HiShieldCheck } from 'react-icons/hi';

const SAMPLE: Patient[] = [
  { _id:'1', patientId:'P-1042', firstName:'Aarav',   lastName:'Sharma',       gender:'M', age:34, bloodGroup:'O+',  phone:'+91 98765 11001', email:'aarav.s@email.com',   tag:'active',    visits:4,  createdAt:'' },
  { _id:'2', patientId:'P-1043', firstName:'Meera',   lastName:'Iyer',         gender:'F', age:28, bloodGroup:'A+',  phone:'+91 98765 11002', email:'meera.i@email.com',   tag:'active',    visits:2,  createdAt:'' },
  { _id:'3', patientId:'P-1044', firstName:'Suresh',  lastName:'Patel',        gender:'M', age:52, bloodGroup:'B+',  phone:'+91 98765 11003', email:'suresh.p@email.com',  tag:'critical',  visits:9,  createdAt:'' },
  { _id:'4', patientId:'P-1045', firstName:'Riya',    lastName:'Kapoor',       gender:'F', age:6,  bloodGroup:'O-',  phone:'+91 98765 11004', email:'guardian@email.com',  tag:'new',       visits:1,  createdAt:'' },
  { _id:'5', patientId:'P-1046', firstName:'Karthik', lastName:'Nair',         gender:'M', age:45, bloodGroup:'AB+', phone:'+91 98765 11005', email:'karthik.n@email.com', tag:'active',    visits:6,  createdAt:'' },
  { _id:'6', patientId:'P-1047', firstName:'Ishaan',  lastName:'Verma',        gender:'M', age:31, bloodGroup:'A-',  phone:'+91 98765 11006', email:'ishaan.v@email.com',  tag:'active',    visits:3,  createdAt:'' },
  { _id:'7', patientId:'P-1031', firstName:'Rohan',   lastName:'Singh',        gender:'M', age:40, bloodGroup:'B+',  phone:'+91 98765 11008', email:'rohan.s@email.com',   tag:'follow-up', visits:8,  createdAt:'' },
  { _id:'8', patientId:'P-1029', firstName:'Tanvi',   lastName:'Joshi',        gender:'F', age:36, bloodGroup:'A+',  phone:'+91 98765 11009', email:'tanvi.j@email.com',   tag:'active',    visits:5,  createdAt:'' },
  { _id:'9', patientId:'P-1018', firstName:'Devansh', lastName:'Gupta',        gender:'M', age:58, bloodGroup:'O+',  phone:'+91 98765 11010', email:'devansh.g@email.com', tag:'follow-up', visits:12, createdAt:'' },
];

const FILTERS = ['All', 'active', 'follow-up', 'critical', 'new'];

interface PatientFormState { firstName:string; lastName:string; gender:string; age:string; bloodGroup:string; phone:string; email:string; tag:string }
const emptyForm: PatientFormState = { firstName:'', lastName:'', gender:'M', age:'', bloodGroup:'', phone:'', email:'', tag:'new' };

export const Patients = () => {
  const [patients, setPatients] = useState<Patient[]>(SAMPLE);
  const [filter, setFilter] = useState('All');
  const [q, setQ] = useState('');
  const [modal, setModal] = useState<'create' | 'edit' | null>(null);
  const [editing, setEditing] = useState<Patient | null>(null);
  const [form, setForm] = useState<PatientFormState>(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    patientsAPI.list().then(r => { if (r.data?.data?.length) setPatients(r.data.data); }).catch(() => {});
  }, []);

  const counts = useMemo(() => Object.fromEntries(FILTERS.map(f => [f, f === 'All' ? patients.length : patients.filter(p => p.tag === f).length])), [patients]);

  const filtered = useMemo(() => patients.filter(p => {
    const tmatch = filter === 'All' || p.tag === filter;
    const name = `${p.firstName} ${p.lastName}`.toLowerCase();
    const qmatch = !q || name.includes(q.toLowerCase()) || p.patientId.toLowerCase().includes(q.toLowerCase()) || p.phone.includes(q);
    return tmatch && qmatch;
  }), [patients, filter, q]);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setModal('create'); };
  const openEdit = (p: Patient) => {
    setEditing(p);
    setForm({ firstName:p.firstName, lastName:p.lastName, gender:p.gender, age:String(p.age), bloodGroup:p.bloodGroup||'', phone:p.phone, email:p.email||'', tag:p.tag });
    setModal('edit');
  };
  const upd = (k: keyof PatientFormState, v: string) => setForm(prev => ({ ...prev, [k]: v }));

  const save = async () => {
    setSaving(true);
    const payload = { ...form, age: Number(form.age) };
    try {
      if (editing) {
        await patientsAPI.update(editing._id, payload);
        setPatients(ps => ps.map(p => p._id === editing._id ? ({ ...p, ...payload } as Patient) : p));
      } else {
        const r = await patientsAPI.create(payload);
        setPatients(ps => [r.data.data, ...ps]);
      }
      setModal(null);
    } catch {
      if (!editing) { const np: Patient = { _id: Date.now().toString(), patientId: 'P-NEW', visits: 0, createdAt:'', ...payload, gender: payload.gender as 'M' | 'F' | 'Other', tag: payload.tag as Patient['tag'] }; setPatients(ps => [np, ...ps]); }
      setModal(null);
    } finally { setSaving(false); }
  };

  return (
    <div>
      <Header title="Patient management" crumbs="1,284 total · 7 visited today" onAdd={openCreate} addLabel="Add patient" />
      <div className="p-6 space-y-5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={HiUserGroup}   tone="blue"  label="Total patients"      value={patients.length} delta="+12%" up foot="all-time" />
          <StatCard icon={HiUser}        tone="mint"  label="Active this month"   value={counts.active || 0} foot="32% of total" />
          <StatCard icon={HiBell}        tone="amber" label="Follow-ups due"      value={counts['follow-up'] || 0} foot="14 overdue" />
          <StatCard icon={HiShieldCheck} tone="rose"  label="Critical watch"      value={counts.critical || 0} foot="3 since last week" />
        </div>

        <div className="bg-white rounded-2xl border border-[#E3EAF2] shadow-sm overflow-hidden">
          <div className="flex items-center flex-wrap gap-3 p-4 border-b border-[#E3EAF2]">
            <div className="flex items-center gap-2 bg-[#F5F8FC] border border-[#E3EAF2] rounded-xl px-3 py-2">
              <HiSearch size={15} className="text-[#A0AEC0]" />
              <input placeholder="Patient ID, name, or phone…" value={q} onChange={e => setQ(e.target.value)}
                className="bg-transparent text-sm text-[#3D4A5B] outline-none w-48" />
            </div>
            <div className="flex items-center gap-1.5">
              {FILTERS.map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${filter === f
                    ? 'brand-gradient text-white shadow-sm' : 'bg-[#F5F8FC] text-[#6B7C93] hover:bg-[#E8F1FD]'}`}>
                  {f === 'All' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)} <span className="opacity-70">{counts[f]}</span>
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
                  <th className="px-4 py-3 text-left">Patient</th>
                  <th className="px-4 py-3 text-left">ID</th>
                  <th className="px-4 py-3 text-left">Age / Sex</th>
                  <th className="px-4 py-3 text-left">Blood</th>
                  <th className="px-4 py-3 text-left">Phone</th>
                  <th className="px-4 py-3 text-left">Visits</th>
                  <th className="px-4 py-3 text-left">Tag</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEF2F7]">
                {filtered.map(p => {
                  const name = `${p.firstName} ${p.lastName}`;
                  const tone = avatarColor(name);
                  return (
                    <tr key={p._id} className="hover:bg-[#F5F8FC] transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <Avatar name={name} tone={tone} size="sm" />
                          <div>
                            <div className="font-semibold text-[#1A1A1A]">{name}</div>
                            <div className="text-xs text-[#6B7C93]">{p.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-[#6B7C93]">{p.patientId}</td>
                      <td className="px-4 py-3 tabular-nums text-[#3D4A5B]">{p.age} · {p.gender}</td>
                      <td className="px-4 py-3"><Badge variant="brand">{p.bloodGroup}</Badge></td>
                      <td className="px-4 py-3 tabular-nums text-xs text-[#6B7C93] font-medium">{p.phone}</td>
                      <td className="px-4 py-3 font-bold tabular-nums">{p.visits}</td>
                      <td className="px-4 py-3">{tagBadge(p.tag)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg hover:bg-[#E8F1FD] text-[#6B7C93] hover:text-[#1E4FA3] transition-colors"><HiPencil size={14}/></button>
                          <button className="p-1.5 rounded-lg hover:bg-[#F5F8FC] text-[#6B7C93] transition-colors"><HiDotsHorizontal size={14}/></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between px-4 py-3 border-t border-[#EEF2F7] text-sm text-[#6B7C93]">
            <span>Showing <b className="text-[#1A1A1A]">{filtered.length}</b> of {patients.length}</span>
            <div className="flex items-center gap-1">
              {[1,2,3,'…',128].map((p, i) => (
                <button key={i} className={`w-8 h-8 rounded-lg text-xs font-semibold ${p === 1 ? 'brand-gradient text-white' : 'hover:bg-[#F5F8FC] text-[#6B7C93]'}`}>{p}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Modal open={!!modal} onClose={() => setModal(null)}
        title={modal === 'create' ? 'Add patient' : 'Edit patient'}
        subtitle={modal === 'edit' ? `${editing?.firstName} ${editing?.lastName}` : undefined}
        footer={<>
          <button onClick={() => setModal(null)} className="px-4 py-2 rounded-xl border border-[#E3EAF2] text-sm font-medium text-[#6B7C93] hover:bg-[#F5F8FC]">Cancel</button>
          <button onClick={save} disabled={saving} className="px-5 py-2 rounded-xl brand-gradient text-white text-sm font-semibold shadow-sm hover:opacity-90 disabled:opacity-60">
            {saving ? 'Saving…' : modal === 'create' ? 'Add patient' : 'Save changes'}
          </button>
        </>}>
        <div className="grid grid-cols-2 gap-4">
          {([['firstName','First name'],['lastName','Last name'],['phone','Phone'],['email','Email'],['age','Age'],['bloodGroup','Blood group']] as [keyof PatientFormState, string][]).map(([k, label]) => (
            <div key={k}>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B7C93] mb-1.5">{label}</label>
              <input value={form[k]} onChange={e => upd(k, e.target.value)}
                className="w-full px-3 py-2.5 border border-[#E3EAF2] rounded-xl text-sm bg-white text-[#1A1A1A]" />
            </div>
          ))}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B7C93] mb-1.5">Gender</label>
            <select value={form.gender} onChange={e => upd('gender', e.target.value)}
              className="w-full px-3 py-2.5 border border-[#E3EAF2] rounded-xl text-sm bg-white">
              <option value="M">Male</option><option value="F">Female</option><option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B7C93] mb-1.5">Tag</label>
            <select value={form.tag} onChange={e => upd('tag', e.target.value)}
              className="w-full px-3 py-2.5 border border-[#E3EAF2] rounded-xl text-sm bg-white">
              {['new','active','follow-up','critical'].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
};
