import React, { useState, useEffect } from 'react';
import { HiSearch, HiEye, HiPencil, HiTrash, HiViewGrid, HiViewList, HiFilter } from 'react-icons/hi';
import { Header } from '../components/layout/Header';
import { Badge, statusBadge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { Modal } from '../components/ui/Modal';
import { Doctor } from '../types';
import { doctorsAPI } from '../services/api';
import { avatarColor } from '../utils/helpers';

const SAMPLE: Doctor[] = [
  { _id:'1', name:'Dr. Ananya Rao',   speciality:'General medicine', department:'OPD',   room:'Room 1', status:'on',    fee:400, experience:'12 yrs', rating:4.8, todayTokens:24, weekTokens:132 },
  { _id:'2', name:'Dr. Vikram Mehta', speciality:'Cardiology',       department:'Cardio',room:'Room 4', status:'busy',  fee:800, experience:'18 yrs', rating:4.9, todayTokens:18, weekTokens:96  },
  { _id:'3', name:'Dr. Priya Iyer',   speciality:'Dermatology',      department:'Derm',  room:'Room 2', status:'on',    fee:600, experience:'8 yrs',  rating:4.7, todayTokens:16, weekTokens:88  },
  { _id:'4', name:'Dr. Rahul Khanna', speciality:'Pediatrics',       department:'Peds',  room:'Room 3', status:'leave', fee:500, experience:'14 yrs', rating:4.8, todayTokens:0,  weekTokens:0   },
  { _id:'5', name:'Dr. Neha Sharma',  speciality:'Gynecology',       department:'Gyn',   room:'Room 5', status:'on',    fee:700, experience:'10 yrs', rating:4.9, todayTokens:14, weekTokens:76  },
  { _id:'6', name:'Dr. Arjun Desai',  speciality:'Orthopedics',      department:'Ortho', room:'Room 6', status:'on',    fee:750, experience:'16 yrs', rating:4.6, todayTokens:12, weekTokens:64  },
];

interface DoctorFormState { name: string; speciality: string; department: string; room: string; fee: string; experience: string; email: string; phone: string }
const emptyForm: DoctorFormState = { name:'', speciality:'', department:'', room:'', fee:'500', experience:'', email:'', phone:'' };

export const Doctors = () => {
  const [doctors, setDoctors] = useState<Doctor[]>(SAMPLE);
  const [q, setQ] = useState('');
  const [view, setView] = useState<'grid' | 'table'>('grid');
  const [modal, setModal] = useState<'create' | 'edit' | null>(null);
  const [editing, setEditing] = useState<Doctor | null>(null);
  const [form, setForm] = useState<DoctorFormState>(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    doctorsAPI.list().then(r => { if (r.data?.data?.length) setDoctors(r.data.data); }).catch(() => {});
  }, []);

  const filtered = doctors.filter(d =>
    !q || d.name.toLowerCase().includes(q.toLowerCase()) || d.speciality.toLowerCase().includes(q.toLowerCase())
  );

  const openCreate = () => { setEditing(null); setForm(emptyForm); setModal('create'); };
  const openEdit = (d: Doctor) => {
    setEditing(d);
    setForm({ name:d.name, speciality:d.speciality, department:d.department||'', room:d.room||'', fee:String(d.fee), experience:d.experience||'', email:d.email||'', phone:d.phone||'' });
    setModal('edit');
  };

  const upd = (k: keyof DoctorFormState, v: string) => setForm(p => ({ ...p, [k]: v }));

  const save = async () => {
    setSaving(true);
    const payload = { ...form, fee: Number(form.fee) };
    try {
      if (editing) {
        const r = await doctorsAPI.update(editing._id, payload);
        setDoctors(ds => ds.map(d => d._id === editing._id ? r.data.data : d));
      } else {
        const r = await doctorsAPI.create(payload);
        setDoctors(ds => [r.data.data, ...ds]);
      }
      setModal(null);
    } catch { /* fallback — optimistic UI */
      if (editing) setDoctors(ds => ds.map(d => d._id === editing._id ? { ...d, ...payload } : d));
      else setDoctors(ds => [{ _id: Date.now().toString(), rating: 4.5, status: 'on', ...payload } as unknown as Doctor, ...ds]);
      setModal(null);
    } finally { setSaving(false); }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete doctor?')) return;
    doctorsAPI.delete(id).catch(() => {});
    setDoctors(ds => ds.filter(d => d._id !== id));
  };

  return (
    <div>
      <Header title="Doctor management" crumbs="14 active · 16 total · 1 on leave"
        onAdd={openCreate} addLabel="Add doctor" />
      <div className="p-6">
        <div className="bg-white rounded-2xl border border-[#E3EAF2] shadow-sm overflow-hidden">
          {/* Toolbar */}
          <div className="flex items-center flex-wrap gap-3 p-4 border-b border-[#E3EAF2]">
            <div className="flex items-center gap-2 bg-[#F5F8FC] border border-[#E3EAF2] rounded-xl px-3 py-2">
              <HiSearch size={15} className="text-[#A0AEC0]" />
              <input placeholder="Search by name or specialty…" value={q} onChange={e => setQ(e.target.value)}
                className="bg-transparent text-sm text-[#3D4A5B] outline-none w-48" />
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setView('grid')} className={`p-2 rounded-lg transition-colors ${view==='grid' ? 'brand-gradient text-white' : 'hover:bg-[#F5F8FC] text-[#6B7C93]'}`}><HiViewGrid size={16}/></button>
              <button onClick={() => setView('table')} className={`p-2 rounded-lg transition-colors ${view==='table' ? 'brand-gradient text-white' : 'hover:bg-[#F5F8FC] text-[#6B7C93]'}`}><HiViewList size={16}/></button>
            </div>
            <div className="ml-auto">
              <button className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[#E3EAF2] text-sm font-medium text-[#6B7C93] hover:bg-[#F5F8FC]">
                <HiFilter size={14} /> Department
              </button>
            </div>
          </div>

          {view === 'grid' ? (
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map(d => {
                const tone = avatarColor(d.name);
                return (
                  <div key={d._id} className="border border-[#E3EAF2] rounded-2xl p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-3 mb-3">
                      <Avatar name={d.name} tone={tone} size="lg" />
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-[#1A1A1A]">{d.name}</div>
                        <div className="text-xs text-[#6B7C93]">{d.speciality} · {d.experience}</div>
                        <div className="text-xs text-[#A0AEC0] mt-0.5">{d.room} · ₹{d.fee}</div>
                      </div>
                      {statusBadge(d.status)}
                    </div>
                    <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#EEF2F7] mb-3">
                      {[['Today', d.todayTokens ?? '—'], ['This week', d.weekTokens ?? '—'], ['Rating', d.rating]].map(([l, v]) => (
                        <div key={String(l)} className="text-center">
                          <div className="font-bold text-[#1A1A1A]">{v}</div>
                          <div className="text-[10px] text-[#A0AEC0]">{l}</div>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(d)} className="flex-1 py-1.5 rounded-xl border border-[#E3EAF2] text-xs font-semibold text-[#3D4A5B] hover:bg-[#F5F8FC] transition-colors">Edit</button>
                      <button onClick={() => remove(d._id)} className="py-1.5 px-3 rounded-xl border border-red-100 text-xs font-semibold text-red-500 hover:bg-red-50 transition-colors">Delete</button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[10px] font-bold uppercase tracking-wider text-[#A0AEC0] bg-[#F5F8FC]">
                    <th className="px-4 py-3 text-left">Doctor</th>
                    <th className="px-4 py-3 text-left">Specialty</th>
                    <th className="px-4 py-3 text-left">Room</th>
                    <th className="px-4 py-3 text-left">Today</th>
                    <th className="px-4 py-3 text-left">Fee</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EEF2F7]">
                  {filtered.map(d => (
                    <tr key={d._id} className="hover:bg-[#F5F8FC]">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <Avatar name={d.name} tone={avatarColor(d.name)} size="sm" />
                          <div>
                            <div className="font-semibold text-[#1A1A1A]">{d.name}</div>
                            <div className="text-xs text-[#6B7C93]">{d.experience}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[#3D4A5B]">{d.speciality}</td>
                      <td className="px-4 py-3 text-[#6B7C93]">{d.room}</td>
                      <td className="px-4 py-3 font-bold tabular-nums">{d.todayTokens ?? 0}</td>
                      <td className="px-4 py-3 tabular-nums text-[#6B7C93]">₹{d.fee}</td>
                      <td className="px-4 py-3">{statusBadge(d.status)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => openEdit(d)} className="p-1.5 rounded-lg hover:bg-[#E8F1FD] text-[#6B7C93] hover:text-[#1E4FA3] transition-colors"><HiPencil size={14}/></button>
                          <button onClick={() => remove(d._id)} className="p-1.5 rounded-lg hover:bg-red-50 text-[#6B7C93] hover:text-red-500 transition-colors"><HiTrash size={14}/></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <Modal open={!!modal} onClose={() => setModal(null)}
        title={modal === 'create' ? 'Add doctor' : 'Edit doctor'}
        subtitle={modal === 'create' ? 'Add a new doctor to the clinic' : editing?.name}
        footer={<>
          <button onClick={() => setModal(null)} className="px-4 py-2 rounded-xl border border-[#E3EAF2] text-sm font-medium text-[#6B7C93] hover:bg-[#F5F8FC]">Cancel</button>
          <button onClick={save} disabled={saving} className="px-5 py-2 rounded-xl brand-gradient text-white text-sm font-semibold shadow-sm hover:opacity-90 disabled:opacity-60">
            {saving ? 'Saving…' : modal === 'create' ? 'Add doctor' : 'Save changes'}
          </button>
        </>}>
        <div className="grid grid-cols-2 gap-4">
          {([['name','Full name','text',true],['speciality','Speciality','text',true],['department','Department','text',false],['room','Room','text',false],['fee','Fee (₹)','number',false],['experience','Experience','text',false],['email','Email','email',false],['phone','Phone','tel',false]] as const).map(([k, label, type]) => (
            <div key={k} className={k === 'name' || k === 'email' ? 'col-span-2' : ''}>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B7C93] mb-1.5">{label}</label>
              <input type={type} value={form[k as keyof DoctorFormState]} onChange={e => upd(k as keyof DoctorFormState, e.target.value)}
                className="w-full px-3 py-2.5 border border-[#E3EAF2] rounded-xl text-sm bg-white text-[#1A1A1A] placeholder-[#A0AEC0]" />
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};
