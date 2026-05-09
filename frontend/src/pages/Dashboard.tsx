import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HiUserGroup, HiTicket, HiCash, HiBell, HiArrowRight,
} from 'react-icons/hi';
import { FaStethoscope } from 'react-icons/fa';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { Header } from '../components/layout/Header';
import { StatCard } from '../components/ui/StatCard';
import { Badge, statusBadge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { avatarColor } from '../utils/helpers';

const CHART_DATA = [
  { d: 'Mon', booked: 142, seen: 118 },
  { d: 'Tue', booked: 168, seen: 144 },
  { d: 'Wed', booked: 156, seen: 130 },
  { d: 'Thu', booked: 192, seen: 160 },
  { d: 'Fri', booked: 218, seen: 184 },
  { d: 'Sat', booked: 246, seen: 210 },
  { d: 'Today', booked: 184, seen: 142 },
];

const LIVE_QUEUE = [
  { token: 'A-024', patient: 'Aarav Sharma',   doctor: 'Dr. Ananya Rao',   time: '09:30 AM', status: 'in-room',  wait: '0 min' },
  { token: 'A-025', patient: 'Meera Iyer',     doctor: 'Dr. Ananya Rao',   time: '09:45 AM', status: 'waiting',  wait: '8 min' },
  { token: 'E-002', patient: 'Suresh Patel',   doctor: 'Dr. Vikram Mehta', time: '09:50 AM', status: 'priority', wait: '0 min', emergency: true },
  { token: 'A-026', patient: 'Riya Kapoor',    doctor: 'Dr. Rahul Khanna', time: '10:00 AM', status: 'waiting',  wait: '14 min' },
  { token: 'B-013', patient: 'Karthik Nair',   doctor: 'Dr. Vikram Mehta', time: '10:15 AM', status: 'waiting',  wait: '22 min' },
];

const ALERTS = [
  { kind: 'warn',   title: 'Dr. Khanna on leave',  sub: 'Pediatrics rescheduled · 6 patients notified', when: '08:12 AM', icon: '⚠️' },
  { kind: 'danger', title: 'Emergency token E-002', sub: 'Suresh Patel · Cardiology · priority queue',   when: '09:50 AM', icon: '🚨' },
  { kind: 'info',   title: 'Pharmacy stock low',    sub: 'Amoxicillin 500mg · 12 units left',            when: '07:40 AM', icon: '💊' },
];

const DEPTS = [
  { d: 'General medicine', n: 24, max: 30, color: 'from-[#1E4FA3] to-[#1FA3A8]' },
  { d: 'Cardiology',       n: 18, max: 30, color: 'from-[#1FA3A8] to-[#28B7B3]' },
  { d: 'Dermatology',      n: 12, max: 30, color: 'from-[#F59E0B] to-[#FBBF24]' },
  { d: 'Pediatrics',       n: 0,  max: 30, color: 'from-gray-200 to-gray-200' },
  { d: 'Gynecology',       n: 14, max: 30, color: 'from-[#8B5CF6] to-[#A78BFA]' },
  { d: 'Orthopedics',      n: 10, max: 30, color: 'from-[#2C6ED5] to-[#4F8AE0]' },
];

export const Dashboard = () => {
  const navigate = useNavigate();
  const [greeting] = useState(() => {
    const h = new Date().getHours();
    return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  });

  return (
    <div>
      <Header
        title={`${greeting}, Reception`}
        crumbs="Today · Saturday, 10 May 2026 · Sunshine Clinic"
        onAdd={() => navigate('/book')}
        addLabel="Book appointment"
      />
      <div className="p-6 space-y-6">
        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={HiUserGroup}    tone="blue"  label="Total patients"  value="1,284"   delta="+12%" up foot="vs. last month" />
          <StatCard icon={HiTicket}       tone="blue"  label="Today's tokens"  value="184"     delta="+8%" up foot="62 still in queue" accent />
          <StatCard icon={FaStethoscope}  tone="mint"  label="Active doctors"  value="14 / 16" foot="Dr. Khanna · on leave" />
          <StatCard icon={HiCash}         tone="amber" label="Revenue today"   value="₹ 86,400" delta="-3%" foot="vs. yesterday" />
        </div>

        {/* Chart + Live Queue */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
          <div className="xl:col-span-3 bg-white rounded-2xl border border-[#E3EAF2] p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-bold text-[#1A1A1A]">Tokens this week</h2>
                <p className="text-xs text-[#6B7C93]">Booked vs. seen · last 7 days</p>
              </div>
              <div className="flex items-center gap-4 text-xs text-[#6B7C93]">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm brand-gradient inline-block" /> Booked</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-[#BFE3E5] inline-block" /> Seen</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={CHART_DATA} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EEF2F7" vertical={false} />
                <XAxis dataKey="d" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7C93' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#A0AEC0' }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E3EAF2', fontSize: 12 }} />
                <Bar dataKey="booked" fill="url(#brandGrad)" radius={[4,4,0,0]} />
                <Bar dataKey="seen"   fill="#BFE3E5"          radius={[4,4,0,0]} />
                <defs>
                  <linearGradient id="brandGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="#1E4FA3" />
                    <stop offset="100%" stopColor="#1FA3A8" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="xl:col-span-2 bg-white rounded-2xl border border-[#E3EAF2] p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-bold text-[#1A1A1A]">Live queue</h2>
                <p className="text-xs text-[#6B7C93]">5 ahead · ~24 min wait</p>
              </div>
              <button onClick={() => navigate('/appointments')}
                className="flex items-center gap-1 text-xs font-semibold text-[#2C6ED5] hover:underline">
                View all <HiArrowRight size={12} />
              </button>
            </div>
            <div className="space-y-2">
              {LIVE_QUEUE.map((t, i) => (
                <div key={t.token}
                  className={`flex items-center gap-3 p-3 rounded-xl ${i === 0 ? 'bg-[#F5F8FC] border border-[#E3EAF2]' : ''} ${t.emergency ? 'border border-red-100 bg-red-50' : ''}`}>
                  <div className={`px-2 py-1 rounded-lg text-xs font-bold flex-shrink-0 ${t.emergency ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                    {t.token}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-[#1A1A1A] truncate">{t.patient}</div>
                    <div className="text-xs text-[#6B7C93] truncate">{t.doctor.replace('Dr. ', '')} · {t.time}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    {statusBadge(t.status, t.emergency)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Alerts + Department load */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-[#E3EAF2] p-6 shadow-sm">
            <h2 className="font-bold text-[#1A1A1A] mb-1">Alerts</h2>
            <p className="text-xs text-[#6B7C93] mb-4">Needs your attention</p>
            <div className="space-y-2">
              {ALERTS.map((a, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-[#F5F8FC] rounded-xl">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0 ${
                    a.kind === 'danger' ? 'bg-red-100' : a.kind === 'warn' ? 'bg-amber-100' : 'bg-blue-100'}`}>
                    {a.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-[#1A1A1A]">{a.title}</div>
                    <div className="text-xs text-[#6B7C93] mt-0.5">{a.sub}</div>
                  </div>
                  <div className="text-xs text-[#A0AEC0] font-semibold flex-shrink-0">{a.when}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#E3EAF2] p-6 shadow-sm">
            <h2 className="font-bold text-[#1A1A1A] mb-1">Department load</h2>
            <p className="text-xs text-[#6B7C93] mb-4">Tokens active right now</p>
            <div className="space-y-3">
              {DEPTS.map(d => (
                <div key={d.d}>
                  <div className="flex justify-between text-xs font-semibold mb-1.5">
                    <span className="text-[#3D4A5B]">{d.d}</span>
                    <span className="text-[#6B7C93] tabular-nums">{d.n} / {d.max}</span>
                  </div>
                  <div className="h-2 bg-[#EEF2F7] rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${d.color} rounded-full transition-all duration-500`}
                      style={{ width: `${(d.n / d.max) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
