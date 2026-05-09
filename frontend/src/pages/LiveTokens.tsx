import React, { useState, useEffect, useMemo } from 'react';
import { HiRefresh, HiClock, HiUserGroup, HiCheckCircle } from 'react-icons/hi';
import { Header } from '../components/layout/Header';
import { Badge } from '../components/ui/Badge';
import { StatCard } from '../components/ui/StatCard';
import { appointmentsAPI } from '../services/api';

interface TokenEntry {
  tokenId: string; patientName: string; doctor: string; dept: string;
  status: string; waitTime?: string; position?: number; priority: string;
}

const SAMPLE_QUEUE: TokenEntry[] = [
  { tokenId:'A-001', patientName:'Aarav Sharma',   doctor:'Dr. Ananya Rao',   dept:'General OPD',  status:'in-room',   priority:'normal', waitTime:'—' },
  { tokenId:'A-002', patientName:'Meera Iyer',     doctor:'Dr. Ananya Rao',   dept:'General OPD',  status:'waiting',   priority:'normal', waitTime:'~12 min', position:1 },
  { tokenId:'A-003', patientName:'Suresh Patel',   doctor:'Dr. Ananya Rao',   dept:'General OPD',  status:'waiting',   priority:'normal', waitTime:'~25 min', position:2 },
  { tokenId:'B-001', patientName:'Rohan Singh',    doctor:'Dr. Vikram Mehta', dept:'Cardiology',   status:'in-room',   priority:'normal', waitTime:'—' },
  { tokenId:'B-002', patientName:'Devansh Gupta',  doctor:'Dr. Vikram Mehta', dept:'Cardiology',   status:'waiting',   priority:'normal', waitTime:'~18 min', position:1 },
  { tokenId:'E-001', patientName:'Karthik Nair',   doctor:'Dr. Vikram Mehta', dept:'Cardiology',   status:'waiting',   priority:'emergency', waitTime:'Immediate', position:0 },
  { tokenId:'C-001', patientName:'Tanvi Joshi',    doctor:'Dr. Priya Iyer',   dept:'Dermatology',  status:'completed', priority:'normal', waitTime:'—' },
  { tokenId:'C-002', patientName:'Riya Kapoor',    doctor:'Dr. Priya Iyer',   dept:'Dermatology',  status:'waiting',   priority:'normal', waitTime:'~8 min', position:1 },
  { tokenId:'D-001', patientName:'Kavya Menon',    doctor:'Dr. Rahul Khanna', dept:'Pediatrics',   status:'in-room',   priority:'normal', waitTime:'—' },
  { tokenId:'D-002', patientName:'Arjun Reddy',    doctor:'Dr. Rahul Khanna', dept:'Pediatrics',   status:'waiting',   priority:'normal', waitTime:'~20 min', position:1 },
  { tokenId:'F-001', patientName:'Priya Nair',     doctor:'Dr. Neha Sharma',  dept:'Gynecology',   status:'completed', priority:'normal', waitTime:'—' },
  { tokenId:'F-002', patientName:'Anjali Singh',   doctor:'Dr. Neha Sharma',  dept:'Gynecology',   status:'waiting',   priority:'normal', waitTime:'~15 min', position:1 },
];

const DEPTS = ['All', 'General OPD', 'Cardiology', 'Dermatology', 'Pediatrics', 'Gynecology', 'Orthopedics'];

const statusBadge = (s: string, p: string) => {
  if (p === 'emergency') return <Badge variant="danger" dot>Emergency</Badge>;
  if (s === 'in-room')   return <Badge variant="success" dot>In room</Badge>;
  if (s === 'waiting')   return <Badge variant="warning" dot>Waiting</Badge>;
  if (s === 'completed') return <Badge variant="muted" dot>Completed</Badge>;
  return <Badge variant="muted" dot>{s}</Badge>;
};

export const LiveTokens = () => {
  const [queue, setQueue] = useState<TokenEntry[]>(SAMPLE_QUEUE);
  const [dept, setDept] = useState('All');
  const [lastRefresh, setLastRefresh] = useState(new Date());

  useEffect(() => {
    const load = () => {
      appointmentsAPI.list({ status: 'waiting,in-room' }).then(r => {
        if (r.data?.data?.length) {
          const mapped: TokenEntry[] = r.data.data.map((a: any) => ({
            tokenId: a.tokenId,
            patientName: `${a.patient?.firstName} ${a.patient?.lastName}`,
            doctor: a.doctor?.name,
            dept: a.doctor?.department || 'OPD',
            status: a.status,
            priority: a.priority,
            waitTime: a.waitTime,
            position: a.position,
          }));
          setQueue(mapped);
        }
        setLastRefresh(new Date());
      }).catch(() => setLastRefresh(new Date()));
    };
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, []);

  const filtered = useMemo(() => queue.filter(t => dept === 'All' || t.dept === dept), [queue, dept]);

  const inRoom    = queue.filter(t => t.status === 'in-room').length;
  const waiting   = queue.filter(t => t.status === 'waiting').length;
  const completed = queue.filter(t => t.status === 'completed').length;
  const emergency = queue.filter(t => t.priority === 'emergency').length;

  const currentTokens = filtered.filter(t => t.status === 'in-room');
  const waitingQueue  = filtered.filter(t => t.status === 'waiting').sort((a,b) => {
    if (a.priority === 'emergency') return -1;
    if (b.priority === 'emergency') return 1;
    return (a.position||99) - (b.position||99);
  });

  const deptDoctors = useMemo(() => {
    const map: Record<string, string[]> = {};
    queue.forEach(t => {
      if (!map[t.dept]) map[t.dept] = [];
      if (!map[t.dept].includes(t.doctor)) map[t.dept].push(t.doctor);
    });
    return map;
  }, [queue]);

  return (
    <div>
      <Header title="Live Token Queue" crumbs="Real-time queue display"
        actions={
          <button onClick={() => setLastRefresh(new Date())} className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#E3EAF2] text-sm font-medium text-[#6B7C93] hover:bg-[#F5F8FC]">
            <HiRefresh size={14} /> Refresh
          </button>
        }
      />
      <div className="p-6 space-y-5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={HiUserGroup}  tone="blue"  label="Total today"   value={queue.length} foot="all tokens" />
          <StatCard icon={HiClock}      tone="amber" label="In room"        value={inRoom} foot="being seen now" />
          <StatCard icon={HiUserGroup}  tone="indigo" label="Waiting"       value={waiting} foot="in queue" />
          <StatCard icon={HiCheckCircle} tone="mint" label="Completed"      value={completed} foot="done today" />
        </div>

        {emergency > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center text-red-600 font-bold flex-shrink-0 animate-pulse">!</div>
            <div>
              <div className="font-bold text-red-700">{emergency} emergency token{emergency > 1 ? 's' : ''} in queue</div>
              <div className="text-xs text-red-600">Immediate attention required</div>
            </div>
          </div>
        )}

        <div className="flex items-center gap-1.5 flex-wrap">
          {DEPTS.map(d => (
            <button key={d} onClick={() => setDept(d)} className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${dept === d ? 'brand-gradient text-white shadow-sm' : 'bg-white border border-[#E3EAF2] text-[#6B7C93] hover:bg-[#E8F1FD]'}`}>
              {d}{d !== 'All' && deptDoctors[d] ? ` · ${deptDoctors[d].length} dr` : ''}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div>
            <h3 className="font-bold text-[#1A1A1A] mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              In consultation now
            </h3>
            {currentTokens.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#E3EAF2] p-8 text-center text-[#6B7C93] text-sm">No active consultations</div>
            ) : (
              <div className="space-y-3">
                {currentTokens.map(t => (
                  <div key={t.tokenId} className="bg-white rounded-2xl border-2 border-emerald-200 p-4 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl brand-gradient flex flex-col items-center justify-center text-white flex-shrink-0 shadow-lg">
                      <div className="text-[10px] font-semibold opacity-80">TOKEN</div>
                      <div className="text-xl font-black leading-none">{t.tokenId}</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-[#1A1A1A]">{t.patientName}</div>
                      <div className="text-xs text-[#6B7C93] mt-0.5">{t.doctor}</div>
                      <div className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                        In room · {t.dept}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="font-bold text-[#1A1A1A] mb-3">Waiting queue ({waitingQueue.length})</h3>
            {waitingQueue.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#E3EAF2] p-8 text-center text-[#6B7C93] text-sm">Queue is empty</div>
            ) : (
              <div className="space-y-2.5">
                {waitingQueue.map((t, idx) => (
                  <div key={t.tokenId} className={`bg-white rounded-2xl border p-4 flex items-center gap-3 ${t.priority === 'emergency' ? 'border-red-200 bg-red-50' : 'border-[#E3EAF2]'}`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0 ${t.priority === 'emergency' ? 'bg-red-500 text-white' : 'bg-[#F5F8FC] text-[#1E4FA3]'}`}>
                      {idx + 1}
                    </div>
                    <div className="w-12 text-center flex-shrink-0">
                      <div className="text-[10px] text-[#A0AEC0] font-semibold">TOKEN</div>
                      <div className="font-black text-[#1A1A1A] text-sm leading-none">{t.tokenId}</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-[#1A1A1A] text-sm">{t.patientName}</div>
                      <div className="text-xs text-[#6B7C93]">{t.doctor}</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      {statusBadge(t.status, t.priority)}
                      <div className="text-xs text-[#6B7C93] mt-1">{t.waitTime}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="text-right text-xs text-[#A0AEC0]">
          Last updated: {lastRefresh.toLocaleTimeString('en-IN')} · Auto-refreshes every 30s
        </div>
      </div>
    </div>
  );
};
