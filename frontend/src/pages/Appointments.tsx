import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiSearch, HiDownload } from 'react-icons/hi';
import { Header } from '../components/layout/Header';
import { Badge, statusBadge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { Modal } from '../components/ui/Modal';
import { Appointment } from '../types';
import { appointmentsAPI } from '../services/api';
import { avatarColor, avatarInitials, formatTime } from '../utils/helpers';

const FILTERS = ['All', 'Waiting', 'In room', 'Completed', 'Cancelled', 'Emergency'];

const SAMPLE: Appointment[] = [
  { _id:'1', tokenId:'A-024', patient:{_id:'p1',patientId:'P-1042',firstName:'Aarav',lastName:'Sharma',gender:'M',age:34,phone:'',tag:'active',visits:4,createdAt:''}, doctor:{_id:'d1',name:'Dr. Ananya Rao',speciality:'General medicine',fee:400,rating:4.8,status:'on'}, date:new Date().toISOString(), slot:'09:30 AM', status:'in-room',   priority:'normal',    paid:false, createdAt:'' },
  { _id:'2', tokenId:'A-025', patient:{_id:'p2',patientId:'P-1043',firstName:'Meera', lastName:'Iyer',  gender:'F',age:28,phone:'',tag:'active',visits:2,createdAt:''}, doctor:{_id:'d1',name:'Dr. Ananya Rao',speciality:'General medicine',fee:400,rating:4.8,status:'on'}, date:new Date().toISOString(), slot:'09:45 AM', status:'waiting',   priority:'normal',    paid:false, createdAt:'' },
  { _id:'3', tokenId:'E-002', patient:{_id:'p3',patientId:'P-1044',firstName:'Suresh',lastName:'Patel', gender:'M',age:52,phone:'',tag:'critical',visits:9,createdAt:''}, doctor:{_id:'d2',name:'Dr. Vikram Mehta',speciality:'Cardiology',fee:800,rating:4.9,status:'busy'}, date:new Date().toISOString(), slot:'09:50 AM', status:'priority',  priority:'emergency', paid:false, createdAt:'' },
  { _id:'4', tokenId:'A-026', patient:{_id:'p4',patientId:'P-1045',firstName:'Riya',  lastName:'Kapoor',gender:'F',age:6, phone:'',tag:'new',    visits:1,createdAt:''}, doctor:{_id:'d3',name:'Dr. Rahul Khanna',speciality:'Pediatrics',fee:500,rating:4.8,status:'leave'}, date:new Date().toISOString(), slot:'10:00 AM', status:'waiting',   priority:'normal',    paid:false, createdAt:'' },
  { _id:'5', tokenId:'A-022', patient:{_id:'p5',patientId:'P-1031',firstName:'Rohan', lastName:'Singh', gender:'M',age:40,phone:'',tag:'follow-up',visits:8,createdAt:''}, doctor:{_id:'d1',name:'Dr. Ananya Rao',speciality:'General medicine',fee:400,rating:4.8,status:'on'}, date:new Date().toISOString(), slot:'08:45 AM', status:'completed', priority:'normal',    paid:false, createdAt:'' },
  { _id:'6', tokenId:'B-011', patient:{_id:'p6',patientId:'P-1018',firstName:'Devansh',lastName:'Gupta',gender:'M',age:58,phone:'',tag:'follow-up',visits:12,createdAt:''}, doctor:{_id:'d2',name:'Dr. Vikram Mehta',speciality:'Cardiology',fee:800,rating:4.9,status:'busy'}, date:new Date().toISOString(), slot:'08:30 AM', status:'cancelled', priority:'normal',    paid:false, createdAt:'' },
];

export const Appointments = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState<Appointment[]>(SAMPLE);
  const [filter, setFilter] = useState('All');
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    appointmentsAPI.list().then(res => { if (res.data?.data?.length) setRows(res.data.data); }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const counts = useMemo(() => ({
    All: rows.length,
    Waiting: rows.filter(t => t.status === 'waiting').length,
    'In room': rows.filter(t => t.status === 'in-room').length,
    Completed: rows.filter(t => t.status === 'completed').length,
    Cancelled: rows.filter(t => t.status === 'cancelled').length,
    Emergency: rows.filter(t => t.priority === 'emergency').length,
  }), [rows]);

  const filtered = useMemo(() => rows.filter(t => {
    const fok =
      filter === 'All' ? true :
      filter === 'Emergency' ? t.priority === 'emergency' :
      filter === 'In room' ? t.status === 'in-room' :
      t.status === filter.toLowerCase();
    const name = `${t.patient.firstName} ${t.patient.lastName}`.toLowerCase();
    const qok = !q || name.includes(q.toLowerCase()) || t.tokenId.toLowerCase().includes(q.toLowerCase());
    return fok && qok;
  }), [rows, filter, q]);

  return (
    <div>
      <Header title="Appointments & Tokens" crumbs="Today · 184 tokens issued · 62 in queue"
        onAdd={() => navigate('/book')} addLabel="Book appointment" />
      <div className="p-6">
        <div className="bg-white rounded-2xl border border-[#E3EAF2] shadow-sm overflow-hidden">
          {/* Toolbar */}
          <div className="flex items-center flex-wrap gap-3 p-4 border-b border-[#E3EAF2]">
            <div className="flex items-center gap-2 bg-[#F5F8FC] border border-[#E3EAF2] rounded-xl px-3 py-2">
              <HiSearch size={15} className="text-[#A0AEC0]" />
              <input placeholder="Token, patient, or doctor…" value={q} onChange={e => setQ(e.target.value)}
                className="bg-transparent text-sm text-[#3D4A5B] outline-none w-48" />
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {FILTERS.map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${filter === f
                    ? 'brand-gradient text-white shadow-sm'
                    : 'bg-[#F5F8FC] text-[#6B7C93] hover:bg-[#E8F1FD] hover:text-[#1E4FA3]'}`}>
                  {f} <span className="opacity-70">{counts[f as keyof typeof counts]}</span>
                </button>
              ))}
            </div>
            <div className="ml-auto">
              <button className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[#E3EAF2] text-sm font-medium text-[#6B7C93] hover:bg-[#F5F8FC]">
                <HiDownload size={14} /> Export
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[10px] font-bold uppercase tracking-wider text-[#A0AEC0] bg-[#F5F8FC]">
                  <th className="px-4 py-3 text-left">Token</th>
                  <th className="px-4 py-3 text-left">Patient</th>
                  <th className="px-4 py-3 text-left">Doctor / Dept</th>
                  <th className="px-4 py-3 text-left">Slot</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEF2F7]">
                {filtered.map(t => {
                  const name = `${t.patient.firstName} ${t.patient.lastName}`;
                  const tone = avatarColor(name);
                  return (
                    <tr key={t._id} className="hover:bg-[#F5F8FC] transition-colors">
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-lg text-xs font-bold ${t.priority === 'emergency' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                          {t.tokenId}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <Avatar name={name} tone={tone} size="sm" />
                          <div>
                            <div className="font-semibold text-[#1A1A1A]">{name}</div>
                            <div className="text-xs text-[#6B7C93]">{t.patient.age} · {t.patient.gender}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-[#1A1A1A]">{t.doctor.name}</div>
                        <div className="text-xs text-[#6B7C93]">{t.doctor.speciality}</div>
                      </td>
                      <td className="px-4 py-3 font-semibold tabular-nums text-[#3D4A5B]">{t.slot}</td>
                      <td className="px-4 py-3">{statusBadge(t.status, t.priority === 'emergency')}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button className="p-1.5 rounded-lg hover:bg-[#E8F1FD] text-[#6B7C93] hover:text-[#1E4FA3] transition-colors text-xs font-medium px-2">View</button>
                          <button className="p-1.5 rounded-lg hover:bg-amber-50 text-[#6B7C93] hover:text-amber-600 transition-colors text-xs font-medium px-2">Edit</button>
                          <button className="p-1.5 rounded-lg hover:bg-red-50 text-[#6B7C93] hover:text-red-500 transition-colors text-xs font-medium px-2">Cancel</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr><td colSpan={6} className="px-4 py-12 text-center text-[#A0AEC0]">No tokens match the current filter.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-[#EEF2F7] text-sm text-[#6B7C93]">
            <span>Showing <b className="text-[#1A1A1A]">{filtered.length}</b> of {rows.length} tokens</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3].map(p => (
                <button key={p} className={`w-8 h-8 rounded-lg text-xs font-semibold ${p === 1 ? 'brand-gradient text-white' : 'hover:bg-[#F5F8FC] text-[#6B7C93]'}`}>{p}</button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
