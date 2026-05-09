import React, { useState } from 'react';
import { HiDownload, HiTrendingUp, HiCurrencyRupee, HiUserGroup, HiCalendar } from 'react-icons/hi';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend } from 'recharts';
import { Header } from '../components/layout/Header';
import { StatCard } from '../components/ui/StatCard';

const MONTHLY_REVENUE = [
  { month:'Nov', revenue:182000, patients:412 }, { month:'Dec', revenue:205000, patients:468 },
  { month:'Jan', revenue:195000, patients:445 }, { month:'Feb', revenue:223000, patients:510 },
  { month:'Mar', revenue:241000, patients:548 }, { month:'Apr', revenue:258000, patients:587 },
  { month:'May', revenue:131000, patients:298 },
];

const TOKEN_TREND = [
  { week:'Wk 1 Apr', tokens:142 }, { week:'Wk 2 Apr', tokens:168 }, { week:'Wk 3 Apr', tokens:155 },
  { week:'Wk 4 Apr', tokens:189 }, { week:'Wk 1 May', tokens:176 }, { week:'Wk 2 May', tokens:203 },
];

const DEPT_BREAKDOWN = [
  { name:'General OPD', value:38, color:'#2C6ED5' }, { name:'Cardiology', value:22, color:'#1FA3A8' },
  { name:'Orthopedics', value:16, color:'#1E4FA3' }, { name:'Pediatrics', value:12, color:'#6366F1' },
  { name:'Dermatology', value:8,  color:'#EC4899' }, { name:'Gynecology', value:4,  color:'#F59E0B' },
];

const TOP_DOCTORS = [
  { name:'Dr. Vikram Mehta', dept:'Cardiology',  tokens:89, revenue:71200, rating:4.9 },
  { name:'Dr. Neha Sharma',  dept:'Gynecology',  tokens:76, revenue:53200, rating:4.9 },
  { name:'Dr. Ananya Rao',   dept:'General OPD', tokens:124,revenue:49600, rating:4.8 },
  { name:'Dr. Arjun Desai',  dept:'Orthopedics', tokens:68, revenue:51000, rating:4.6 },
  { name:'Dr. Priya Iyer',   dept:'Dermatology', tokens:58, revenue:34800, rating:4.7 },
];

const RANGES = ['This week','This month','Last 3 months','Last 6 months','This year'];

export const Reports = () => {
  const [range, setRange] = useState('Last 6 months');

  const totalRevenue  = MONTHLY_REVENUE.reduce((s,m) => s+m.revenue, 0);
  const totalPatients = MONTHLY_REVENUE.reduce((s,m) => s+m.patients, 0);

  return (
    <div>
      <Header title="Reports & Analytics" crumbs="Revenue, tokens, trends"
        actions={
          <button className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[#E3EAF2] text-sm font-medium text-[#6B7C93] hover:bg-[#F5F8FC]">
            <HiDownload size={14} /> Export PDF
          </button>
        }
      />
      <div className="p-6 space-y-5">
        <div className="flex items-center gap-2 flex-wrap">
          {RANGES.map(r => (
            <button key={r} onClick={() => setRange(r)} className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${range === r ? 'brand-gradient text-white shadow-sm' : 'bg-white border border-[#E3EAF2] text-[#6B7C93] hover:bg-[#E8F1FD]'}`}>
              {r}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={HiCurrencyRupee} tone="blue"   label="Total revenue"    value={`₹${(totalRevenue/100000).toFixed(1)}L`} delta="+14%" up foot="vs last period" />
          <StatCard icon={HiUserGroup}     tone="mint"   label="Total patients"   value={totalPatients} delta="+12%" up foot="unique visits" />
          <StatCard icon={HiTrendingUp}    tone="amber"  label="Avg daily tokens" value={Math.round(TOKEN_TREND.reduce((s,t)=>s+t.tokens,0)/TOKEN_TREND.length)} foot="per working day" />
          <StatCard icon={HiCalendar}      tone="indigo" label="Avg revenue/day"  value={`₹${Math.round(totalRevenue/180).toLocaleString()}`} foot="6-month average" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E3EAF2] shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-[#1A1A1A]">Monthly revenue</h3>
                <p className="text-xs text-[#6B7C93]">Last 7 months · ₹ collected</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={MONTHLY_REVENUE}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F4FA" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize:11, fill:'#6B7C93' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize:11, fill:'#6B7C93' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: any) => [`₹${Number(v).toLocaleString()}`, 'Revenue']} contentStyle={{ borderRadius:12, border:'1px solid #E3EAF2', fontSize:12 }} />
                <Line type="monotone" dataKey="revenue" stroke="#2C6ED5" strokeWidth={3} dot={{ fill:'#2C6ED5', r:4 }} activeDot={{ r:6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white rounded-2xl border border-[#E3EAF2] shadow-sm p-5">
            <h3 className="font-bold text-[#1A1A1A] mb-1">Department split</h3>
            <p className="text-xs text-[#6B7C93] mb-4">Revenue by speciality</p>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={DEPT_BREAKDOWN} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" stroke="none">
                  {DEPT_BREAKDOWN.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip formatter={(v: any) => [`${v}%`, '']} contentStyle={{ borderRadius:12, border:'1px solid #E3EAF2', fontSize:12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 mt-2">
              {DEPT_BREAKDOWN.map(d => (
                <div key={d.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                    <span className="text-[#6B7C93]">{d.name}</span>
                  </div>
                  <span className="font-semibold text-[#1A1A1A]">{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="bg-white rounded-2xl border border-[#E3EAF2] shadow-sm p-5">
            <h3 className="font-bold text-[#1A1A1A] mb-1">Weekly token trend</h3>
            <p className="text-xs text-[#6B7C93] mb-4">Tokens per week</p>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={TOKEN_TREND}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F4FA" vertical={false} />
                <XAxis dataKey="week" tick={{ fontSize:10, fill:'#6B7C93' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize:11, fill:'#6B7C93' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius:12, border:'1px solid #E3EAF2', fontSize:12 }} />
                <Bar dataKey="tokens" fill="#1FA3A8" radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl border border-[#E3EAF2] shadow-sm p-5">
            <h3 className="font-bold text-[#1A1A1A] mb-4">Top performing doctors</h3>
            <div className="space-y-3">
              {TOP_DOCTORS.map((d, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-lg brand-gradient flex items-center justify-center text-white text-xs font-bold flex-shrink-0">{i+1}</div>
                    <div>
                      <div className="font-semibold text-[#1A1A1A] text-sm">{d.name}</div>
                      <div className="text-xs text-[#6B7C93]">{d.dept} · {d.tokens} tokens</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-[#1A1A1A] text-sm">₹{d.revenue.toLocaleString()}</div>
                    <div className="text-xs text-amber-500 font-medium">★ {d.rating}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E3EAF2] shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-[#1A1A1A]">Patient visits by month</h3>
              <p className="text-xs text-[#6B7C93]">New + returning patients</p>
            </div>
            <button className="flex items-center gap-1.5 text-xs font-medium text-[#6B7C93] hover:text-[#1E4FA3] px-3 py-1.5 rounded-lg border border-[#E3EAF2] hover:bg-[#F5F8FC]">
              <HiDownload size={12} /> Export CSV
            </button>
          </div>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={MONTHLY_REVENUE}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F4FA" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize:11, fill:'#6B7C93' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize:11, fill:'#6B7C93' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius:12, border:'1px solid #E3EAF2', fontSize:12 }} />
              <Bar dataKey="patients" fill="#1E4FA3" radius={[6,6,0,0]} name="Patients" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
