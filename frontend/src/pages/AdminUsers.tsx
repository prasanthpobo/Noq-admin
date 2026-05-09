import React, { useState, useEffect, useMemo } from 'react';
import { HiSearch, HiPencil, HiTrash, HiShieldCheck, HiUser } from 'react-icons/hi';
import { Header } from '../components/layout/Header';
import { StatCard } from '../components/ui/StatCard';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Avatar } from '../components/ui/Avatar';
import { usersAPI } from '../services/api';
import { avatarColor, formatDate } from '../utils/helpers';

interface AdminUser {
  _id: string; name: string; email: string; phone?: string;
  role: string; isActive: boolean; lastLogin?: string; createdAt: string;
}

const SAMPLE: AdminUser[] = [
  { _id:'1', name:'Reena Aggarwal',  email:'admin@noq.health',       phone:'+91 98765 00001', role:'super_admin',   isActive:true,  lastLogin:'2026-05-09T10:00:00Z', createdAt:'' },
  { _id:'2', name:'Sameer Joshi',    email:'sameer.j@noq.health',    phone:'+91 98765 00002', role:'clinic_admin',  isActive:true,  lastLogin:'2026-05-09T09:15:00Z', createdAt:'' },
  { _id:'3', name:'Priya Krishnan',  email:'priya.k@noq.health',     phone:'+91 98765 00003', role:'billing',       isActive:true,  lastLogin:'2026-05-08T14:30:00Z', createdAt:'' },
  { _id:'4', name:'Rohan Mehta',     email:'rohan.m@noq.health',     phone:'+91 98765 00004', role:'clinic_admin',  isActive:false, lastLogin:'2026-05-05T11:00:00Z', createdAt:'' },
  { _id:'5', name:'Sneha Kapoor',    email:'sneha.k@noq.health',     phone:'+91 98765 00005', role:'billing',       isActive:true,  lastLogin:'2026-05-09T08:45:00Z', createdAt:'' },
];

const ROLES = ['super_admin','clinic_admin','doctor','nurse','front_desk','billing'];
const ROLE_FILTERS = ['All', ...ROLES];

const roleBadge = (r: string) => {
  const map: Record<string,string> = { super_admin:'bg-purple-100 text-purple-700', clinic_admin:'bg-blue-100 text-blue-700', doctor:'bg-emerald-100 text-emerald-700', nurse:'bg-pink-100 text-pink-700', front_desk:'bg-amber-100 text-amber-700', billing:'bg-teal-100 text-teal-700' };
  return <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${map[r]||'bg-gray-100 text-gray-600'}`}>{r.replace('_',' ')}</span>;
};

interface FormState { name:string; email:string; phone:string; role:string; password:string }
const empty: FormState = { name:'', email:'', phone:'', role:'clinic_admin', password:'' };

export const AdminUsers = () => {
  const [users, setUsers] = useState<AdminUser[]>(SAMPLE);
  const [filter, setFilter] = useState('All');
  const [q, setQ] = useState('');
  const [modal, setModal] = useState<'create' | 'edit' | null>(null);
  const [editing, setEditing] = useState<AdminUser | null>(null);
  const [form, setForm] = useState<FormState>(empty);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    usersAPI.list().then(r => { if (r.data?.data?.length) setUsers(r.data.data); }).catch(() => {});
  }, []);

  const filtered = useMemo(() => users.filter(u => {
    const rm = filter === 'All' || u.role === filter;
    const qm = !q || u.name.toLowerCase().includes(q.toLowerCase()) || u.email.toLowerCase().includes(q.toLowerCase());
    return rm && qm;
  }), [users, filter, q]);

  const roleCounts = useMemo(() => Object.fromEntries(ROLES.map(r => [r, users.filter(u => u.role === r).length])), [users]);

  const openCreate = () => { setEditing(null); setForm(empty); setModal('create'); };
  const openEdit = (u: AdminUser) => {
    setEditing(u);
    setForm({ name:u.name, email:u.email, phone:u.phone||'', role:u.role, password:'' });
    setModal('edit');
  };
  const upd = (k: keyof FormState, v: string) => setForm(p => ({ ...p, [k]: v }));

  const save = async () => {
    setSaving(true);
    try {
      if (editing) {
        await usersAPI.update(editing._id, form);
        setUsers(us => us.map(u => u._id === editing._id ? { ...u, ...form } : u));
      } else {
        const r = await usersAPI.create(form);
        setUsers(us => [r.data.data, ...us]);
      }
      setModal(null);
    } catch {
      if (!editing) setUsers(us => [{ _id:Date.now().toString(), isActive:true, createdAt:'', ...form }, ...us]);
      setModal(null);
    } finally { setSaving(false); }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try { await usersAPI.delete(deleteId); } catch {}
    setUsers(us => us.filter(u => u._id !== deleteId));
    setDeleteId(null);
  };

  return (
    <div>
      <Header title="Admin user management" crumbs={`${users.length} users · ${users.filter(u=>u.isActive).length} active`} onAdd={openCreate} addLabel="Add user" />
      <div className="p-6 space-y-5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={HiShieldCheck} tone="plum"  label="Super admins"    value={roleCounts.super_admin||0} foot="full access" />
          <StatCard icon={HiUser}        tone="blue"  label="Clinic admins"   value={roleCounts.clinic_admin||0} foot="branch level" />
          <StatCard icon={HiUser}        tone="mint"  label="Billing staff"   value={roleCounts.billing||0} foot="finance access" />
          <StatCard icon={HiUser}        tone="amber" label="Total active"    value={users.filter(u=>u.isActive).length} foot="all roles" />
        </div>

        <div className="bg-white rounded-2xl border border-[#E3EAF2] shadow-sm overflow-hidden">
          <div className="flex items-center flex-wrap gap-3 p-4 border-b border-[#E3EAF2]">
            <div className="flex items-center gap-2 bg-[#F5F8FC] border border-[#E3EAF2] rounded-xl px-3 py-2">
              <HiSearch size={15} className="text-[#A0AEC0]" />
              <input placeholder="Name or email…" value={q} onChange={e => setQ(e.target.value)} className="bg-transparent text-sm text-[#3D4A5B] outline-none w-44" />
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {ROLE_FILTERS.map(f => (
                <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all capitalize ${filter === f ? 'brand-gradient text-white shadow-sm' : 'bg-[#F5F8FC] text-[#6B7C93] hover:bg-[#E8F1FD]'}`}>
                  {f.replace('_',' ')}
                </button>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[10px] font-bold uppercase tracking-wider text-[#A0AEC0] bg-[#F5F8FC]">
                  <th className="px-4 py-3 text-left">User</th>
                  <th className="px-4 py-3 text-left">Role</th>
                  <th className="px-4 py-3 text-left">Phone</th>
                  <th className="px-4 py-3 text-left">Last login</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEF2F7]">
                {filtered.map(u => (
                  <tr key={u._id} className="hover:bg-[#F5F8FC] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={u.name} tone={avatarColor(u.name)} size="sm" />
                        <div>
                          <div className="font-semibold text-[#1A1A1A]">{u.name}</div>
                          <div className="text-xs text-[#6B7C93]">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">{roleBadge(u.role)}</td>
                    <td className="px-4 py-3 text-xs text-[#6B7C93] tabular-nums">{u.phone||'—'}</td>
                    <td className="px-4 py-3 text-xs text-[#6B7C93]">{u.lastLogin ? formatDate(u.lastLogin) : 'Never'}</td>
                    <td className="px-4 py-3">{u.isActive ? <Badge variant="success" dot>Active</Badge> : <Badge variant="muted" dot>Inactive</Badge>}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(u)} className="p-1.5 rounded-lg hover:bg-[#E8F1FD] text-[#6B7C93] hover:text-[#1E4FA3] transition-colors"><HiPencil size={14}/></button>
                        <button onClick={() => setDeleteId(u._id)} className="p-1.5 rounded-lg hover:bg-red-50 text-[#6B7C93] hover:text-red-600 transition-colors"><HiTrash size={14}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-[#EEF2F7] text-sm text-[#6B7C93]">
            Showing <b className="text-[#1A1A1A]">{filtered.length}</b> of {users.length}
          </div>
        </div>
      </div>

      <Modal open={!!modal} onClose={() => setModal(null)} title={modal==='create'?'Add admin user':'Edit user'} subtitle={editing?.name}
        footer={<>
          <button onClick={() => setModal(null)} className="px-4 py-2 rounded-xl border border-[#E3EAF2] text-sm font-medium text-[#6B7C93] hover:bg-[#F5F8FC]">Cancel</button>
          <button onClick={save} disabled={saving} className="px-5 py-2 rounded-xl brand-gradient text-white text-sm font-semibold shadow-sm hover:opacity-90 disabled:opacity-60">{saving?'Saving…':modal==='create'?'Add user':'Save changes'}</button>
        </>}>
        <div className="grid grid-cols-2 gap-4">
          {([['name','Full name'],['email','Email'],['phone','Phone']] as [keyof FormState,string][]).map(([k,label]) => (
            <div key={k} className={k==='name'?'col-span-2':''}>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B7C93] mb-1.5">{label}</label>
              <input value={form[k]} onChange={e=>upd(k,e.target.value)} className="w-full px-3 py-2.5 border border-[#E3EAF2] rounded-xl text-sm bg-white text-[#1A1A1A]" />
            </div>
          ))}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B7C93] mb-1.5">Role</label>
            <select value={form.role} onChange={e=>upd('role',e.target.value)} className="w-full px-3 py-2.5 border border-[#E3EAF2] rounded-xl text-sm bg-white capitalize">
              {ROLES.map(r => <option key={r} value={r}>{r.replace('_',' ')}</option>)}
            </select>
          </div>
          {modal === 'create' && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B7C93] mb-1.5">Password</label>
              <input type="password" value={form.password} onChange={e=>upd('password',e.target.value)} className="w-full px-3 py-2.5 border border-[#E3EAF2] rounded-xl text-sm bg-white text-[#1A1A1A]" />
            </div>
          )}
        </div>
      </Modal>

      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete user" size="md"
        footer={<>
          <button onClick={() => setDeleteId(null)} className="px-4 py-2 rounded-xl border border-[#E3EAF2] text-sm font-medium text-[#6B7C93] hover:bg-[#F5F8FC]">Cancel</button>
          <button onClick={confirmDelete} className="px-5 py-2 rounded-xl bg-red-600 text-white text-sm font-semibold shadow-sm hover:bg-red-700">Delete</button>
        </>}>
        <p className="text-sm text-[#6B7C93]">This will permanently delete this user account.</p>
      </Modal>
    </div>
  );
};
