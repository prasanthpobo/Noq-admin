import React, { useState, useMemo } from 'react';
import { HiSearch, HiFlag, HiClock, HiCheck, HiRefresh, HiX, HiPencil, HiEye, HiPaperClip } from 'react-icons/hi';
import { Header } from '../components/layout/Header';
import { StatCard } from '../components/ui/StatCard';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { Modal } from '../components/ui/Modal';
import { HiUserGroup, HiSupport } from 'react-icons/hi';
import { avatarColor } from '../utils/helpers';

type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
type TicketPriority = 'Low' | 'Medium' | 'High';
type TicketCategory = 'Technical' | 'Billing' | 'Appointment' | 'Other';

interface SampleTicket {
  id: string; title: string; desc: string;
  cat: TicketCategory; pri: TicketPriority; st: TicketStatus;
  by: string; to: string; created: string; updated: string; unread: boolean;
  msgs: { who: string; text: string; at: string }[];
}

const USERS = [
  { id:'u1', name:'Reena Aggarwal',  role:'Front desk',  tone:'blue' },
  { id:'u2', name:'Dr. Anjali Sharma', role:'Cardiology', tone:'teal' },
  { id:'u3', name:'Vikram Singh',    role:'IT Support',  tone:'amber'},
  { id:'u4', name:'Priya Mehta',     role:'Billing lead',tone:'rose' },
];
const findUser = (id: string) => USERS.find(u => u.id === id) || USERS[0];

const INITIAL: SampleTicket[] = [
  { id:'TKT-1042', title:'Token display screen frozen on lobby TV',         desc:'Lobby token board stuck on A-038 for 15 min.',         cat:'Technical',   pri:'High',   st:'open',        by:'u1', to:'u3', created:'May 09 · 10:24', updated:'2 min ago',  unread:true,  msgs:[{who:'u1',text:'Lobby TV frozen on A-038.',at:'10:24'},{who:'u3',text:'On it, checking logs.',at:'10:31'}] },
  { id:'TKT-1041', title:'Patient charged twice on same invoice INV-9912',  desc:'Aarav Sharma charged ₹500 twice.',                      cat:'Billing',     pri:'High',   st:'in_progress', by:'u4', to:'u4', created:'May 09 · 09:50', updated:'14 min ago', unread:true,  msgs:[{who:'u4',text:'Confirmed double-debit, refund initiated.',at:'09:55'}] },
  { id:'TKT-1040', title:'Unable to reschedule appointment from patient app',desc:'Reschedule button silently fails. Backend 500.',       cat:'Appointment', pri:'Medium', st:'in_progress', by:'u2', to:'u3', created:'May 09 · 08:32', updated:'36 min ago', unread:false, msgs:[] },
  { id:'TKT-1039', title:'Add Telugu language to patient SMS templates',    desc:'Patients in Hyderabad prefer Telugu.',                  cat:'Other',       pri:'Low',    st:'open',        by:'u1', to:'u1', created:'May 08 · 17:12', updated:'17 hr ago',  unread:false, msgs:[] },
  { id:'TKT-1038', title:'GSTIN not printing on invoice PDF',               desc:'Invoice missing GSTIN footer.',                         cat:'Billing',     pri:'Medium', st:'resolved',    by:'u4', to:'u3', created:'May 08 · 14:08', updated:'Yesterday',  unread:false, msgs:[] },
  { id:'TKT-1037', title:'Doctor not getting OTP on first login',           desc:'Two new doctors did not receive activation OTP.',       cat:'Technical',   pri:'High',   st:'resolved',    by:'u2', to:'u3', created:'May 08 · 11:45', updated:'Yesterday',  unread:false, msgs:[] },
  { id:'TKT-1036', title:'Add bulk export for patient list',                desc:'Need CSV export filtered by tag.',                      cat:'Other',       pri:'Low',    st:'open',        by:'u1', to:'u1', created:'May 08 · 10:00', updated:'1 day ago',  unread:false, msgs:[] },
];

const ST_STATUS_META: Record<TicketStatus, { label: string; variant: 'info' | 'warning' | 'success' | 'muted' }> = {
  open:        { label:'Open',        variant:'info' },
  in_progress: { label:'In Progress', variant:'warning' },
  resolved:    { label:'Resolved',    variant:'success' },
  closed:      { label:'Closed',      variant:'muted' },
};

const PRI_COLOR: Record<TicketPriority, string> = {
  Low:    'bg-gray-100 text-gray-600',
  Medium: 'bg-amber-100 text-amber-700',
  High:   'bg-red-100 text-red-700',
};

const CAT_COLOR: Record<TicketCategory, string> = {
  Technical:   'bg-blue-100 text-blue-700',
  Billing:     'bg-amber-100 text-amber-700',
  Appointment: 'bg-teal-100 text-teal-700',
  Other:       'bg-gray-100 text-gray-600',
};

interface CreateForm { title:string; desc:string; cat:TicketCategory; pri:TicketPriority; to:string }

export const SupportTickets = () => {
  const [tickets, setTickets] = useState<SampleTicket[]>(INITIAL);
  const [q, setQ] = useState('');
  const [stf, setStf] = useState<'All' | TicketStatus>('All');
  const [viewing, setViewing] = useState<SampleTicket | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<CreateForm>({ title:'', desc:'', cat:'Technical', pri:'Medium', to:'u3' });
  const [reply, setReply] = useState('');

  const counts = useMemo(() => ({
    all: tickets.length,
    open: tickets.filter(t => t.st === 'open').length,
    in_progress: tickets.filter(t => t.st === 'in_progress').length,
    resolved: tickets.filter(t => t.st === 'resolved').length,
    closed: tickets.filter(t => t.st === 'closed').length,
    high: tickets.filter(t => t.pri === 'High' && t.st !== 'closed').length,
  }), [tickets]);

  const rows = useMemo(() => tickets.filter(t => {
    const smatch = stf === 'All' || t.st === stf;
    const qmatch = !q || t.id.toLowerCase().includes(q.toLowerCase()) || t.title.toLowerCase().includes(q.toLowerCase());
    return smatch && qmatch;
  }), [tickets, stf, q]);

  const changeStatus = (id: string, st: TicketStatus) =>
    setTickets(ts => ts.map(t => t.id === id ? { ...t, st } : t));

  const submit = () => {
    const newT: SampleTicket = { id: `TKT-${1043 + tickets.length}`, ...form, by:'u1', created:'Now', updated:'Just now', unread:true, st:'open', msgs:[] };
    setTickets(ts => [newT, ...ts]);
    setCreating(false);
    setForm({ title:'', desc:'', cat:'Technical', pri:'Medium', to:'u3' });
  };

  const sendReply = () => {
    if (!reply.trim() || !viewing) return;
    const msg = { who:'u1', text:reply, at:'Now' };
    setTickets(ts => ts.map(t => t.id === viewing.id ? { ...t, msgs:[...t.msgs, msg] } : t));
    setViewing(v => v ? { ...v, msgs:[...v.msgs, msg] } : v);
    setReply('');
  };

  return (
    <div>
      <Header title="Support Tickets" crumbs={`${counts.all} total · ${counts.open + counts.in_progress} active · ${counts.high} high priority`}
        onAdd={() => setCreating(true)} addLabel="Create ticket" />
      <div className="p-6 space-y-5">
        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard icon={HiSupport}   label="All tickets"    value={counts.all}         foot="across all categories" />
          <StatCard icon={HiUserGroup} tone="blue"  label="Open"          value={counts.open}        foot="awaiting first response" />
          <StatCard icon={HiClock}     tone="amber" label="In progress"   value={counts.in_progress} foot="being worked on" />
          <StatCard icon={HiCheck}     tone="mint"  label="Resolved (7d)" value={counts.resolved}    foot="awaiting confirmation" />
          <StatCard icon={HiFlag}      tone="rose"  label="High priority" value={counts.high}        foot="active · need attention" />
        </div>

        <div className="bg-white rounded-2xl border border-[#E3EAF2] shadow-sm overflow-hidden">
          {/* Toolbar */}
          <div className="flex items-center flex-wrap gap-3 p-4 border-b border-[#EEF2F7]">
            <div className="flex items-center gap-2 bg-[#F5F8FC] border border-[#E3EAF2] rounded-xl px-3 py-2">
              <HiSearch size={15} className="text-[#A0AEC0]" />
              <input placeholder="Ticket ID or title…" value={q} onChange={e => setQ(e.target.value)}
                className="bg-transparent text-sm text-[#3D4A5B] outline-none w-48" />
            </div>
            <div className="flex items-center gap-1.5">
              {(['All','open','in_progress','resolved','closed'] as const).map(s => (
                <button key={s} onClick={() => setStf(s)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${stf === s ? 'brand-gradient text-white' : 'bg-[#F5F8FC] text-[#6B7C93] hover:bg-[#E8F1FD]'}`}>
                  {s === 'All' ? 'All' : ST_STATUS_META[s].label} <span className="opacity-70">{s === 'All' ? counts.all : counts[s]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[10px] font-bold uppercase tracking-wider text-[#A0AEC0] bg-[#F5F8FC]">
                  <th className="px-4 py-3 text-left w-28">Ticket</th>
                  <th className="px-4 py-3 text-left">Title</th>
                  <th className="px-4 py-3 text-left w-28">Category</th>
                  <th className="px-4 py-3 text-left w-32">Assigned to</th>
                  <th className="px-4 py-3 text-left w-24">Priority</th>
                  <th className="px-4 py-3 text-left w-28">Status</th>
                  <th className="px-4 py-3 text-left w-32">Created</th>
                  <th className="px-4 py-3 text-right w-24">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEF2F7]">
                {rows.map(t => {
                  const assignee = findUser(t.to);
                  const meta = ST_STATUS_META[t.st];
                  return (
                    <tr key={t.id} className={`hover:bg-[#F5F8FC] transition-colors ${t.pri === 'High' && t.st !== 'closed' ? 'border-l-2 border-l-red-400' : ''}`}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          {t.unread && <span className="w-2 h-2 bg-[#2C6ED5] rounded-full flex-shrink-0" />}
                          <span className="font-mono text-xs font-semibold text-[#6B7C93]">{t.id}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => setViewing(t)} className="text-left hover:text-[#1E4FA3] transition-colors">
                          <div className="font-semibold text-[#1A1A1A]">{t.title}</div>
                          <div className="text-xs text-[#A0AEC0] mt-0.5">{t.msgs.length} replies · updated {t.updated}</div>
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${CAT_COLOR[t.cat]}`}>{t.cat}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Avatar name={assignee.name} tone={assignee.tone} size="sm" />
                          <span className="text-xs font-medium text-[#3D4A5B] truncate">{assignee.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${PRI_COLOR[t.pri]}`}>
                          <HiFlag size={11} /> {t.pri}
                        </span>
                      </td>
                      <td className="px-4 py-3"><Badge variant={meta.variant} dot>{meta.label}</Badge></td>
                      <td className="px-4 py-3 text-xs text-[#A0AEC0] tabular-nums">{t.created}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => setViewing(t)} className="p-1.5 rounded-lg hover:bg-[#E8F1FD] text-[#6B7C93] hover:text-[#1E4FA3]"><HiEye size={14}/></button>
                          <button onClick={() => changeStatus(t.id, t.st === 'open' ? 'in_progress' : 'resolved')}
                            className="p-1.5 rounded-lg hover:bg-amber-50 text-[#6B7C93] hover:text-amber-600"><HiRefresh size={14}/></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between px-4 py-3 border-t border-[#EEF2F7] text-sm text-[#6B7C93]">
            <span>Showing <b className="text-[#1A1A1A]">{rows.length}</b> of {tickets.length}</span>
          </div>
        </div>
      </div>

      {/* View side panel */}
      {viewing && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setViewing(null)} />
          <aside className="fixed right-0 top-0 bottom-0 w-[520px] bg-white shadow-2xl z-50 flex flex-col">
            <header className="px-6 py-5 border-b border-[#E3EAF2] flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs text-[#6B7C93]">{viewing.id}</span>
                  <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${PRI_COLOR[viewing.pri]}`}><HiFlag size={10}/>{viewing.pri}</span>
                </div>
                <h2 className="text-base font-bold text-[#1A1A1A]">{viewing.title}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={ST_STATUS_META[viewing.st].variant} dot>{ST_STATUS_META[viewing.st].label}</Badge>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${CAT_COLOR[viewing.cat]}`}>{viewing.cat}</span>
                </div>
              </div>
              <button onClick={() => setViewing(null)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><HiX size={18}/></button>
            </header>
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              <p className="text-sm text-[#3D4A5B] leading-relaxed bg-[#F5F8FC] rounded-xl p-4">{viewing.desc}</p>
              <div className="space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-[#A0AEC0]">Conversation · {viewing.msgs.length} messages</div>
                {viewing.msgs.length === 0 && <p className="text-sm text-[#A0AEC0]">No replies yet.</p>}
                {viewing.msgs.map((m, i) => {
                  const u = findUser(m.who);
                  const mine = m.who === 'u1';
                  return (
                    <div key={i} className={`flex gap-3 ${mine ? 'flex-row-reverse' : ''}`}>
                      <Avatar name={u.name} tone={u.tone} size="sm" />
                      <div className={`flex-1 max-w-sm ${mine ? 'items-end' : ''} flex flex-col`}>
                        <div className={`px-3 py-2.5 rounded-xl text-sm ${mine ? 'bg-[#1E4FA3] text-white' : 'bg-[#F5F8FC] text-[#1A1A1A]'}`}>{m.text}</div>
                        <span className="text-[10px] text-[#A0AEC0] mt-1 px-1">{u.name} · {m.at}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div>
                <textarea rows={3} placeholder="Write a reply…" value={reply} onChange={e => setReply(e.target.value)}
                  className="w-full px-3 py-2.5 border border-[#E3EAF2] rounded-xl text-sm resize-none" />
                <div className="flex justify-end gap-2 mt-2">
                  <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#E3EAF2] text-xs font-medium text-[#6B7C93]"><HiPaperClip size={13}/> Attach</button>
                  <button onClick={sendReply} disabled={!reply.trim()}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl brand-gradient text-white text-xs font-semibold disabled:opacity-50">Send reply</button>
                </div>
              </div>
            </div>
            <footer className="px-6 py-4 border-t border-[#E3EAF2] flex justify-between">
              <div className="flex gap-2">
                {viewing.st !== 'in_progress' && <button onClick={() => { changeStatus(viewing.id, 'in_progress'); setViewing(v => v ? {...v, st:'in_progress'} : v); }} className="px-3 py-2 rounded-xl border border-[#E3EAF2] text-xs font-semibold text-[#6B7C93] hover:bg-[#F5F8FC] flex items-center gap-1"><HiClock size={12}/> In progress</button>}
                {viewing.st !== 'resolved' && <button onClick={() => { changeStatus(viewing.id, 'resolved'); setViewing(v => v ? {...v, st:'resolved'} : v); }} className="px-3 py-2 rounded-xl border border-[#E3EAF2] text-xs font-semibold text-[#6B7C93] hover:bg-[#F5F8FC] flex items-center gap-1"><HiCheck size={12}/> Resolve</button>}
              </div>
              <button onClick={() => setViewing(null)} className="px-4 py-2 rounded-xl brand-gradient text-white text-xs font-semibold">Done</button>
            </footer>
          </aside>
        </>
      )}

      {/* Create ticket modal */}
      <Modal open={creating} onClose={() => setCreating(false)} title="Create new ticket" subtitle="Submitted as Reena Aggarwal · Front desk"
        footer={<>
          <button onClick={() => setCreating(false)} className="px-4 py-2 rounded-xl border border-[#E3EAF2] text-sm font-medium text-[#6B7C93]">Cancel</button>
          <button onClick={submit} disabled={!form.title.trim() || !form.desc.trim()}
            className="px-5 py-2 rounded-xl brand-gradient text-white text-sm font-semibold disabled:opacity-50">Submit ticket</button>
        </>}>
        <div className="space-y-4">
          {(['title','desc'] as const).map(k => (
            <div key={k}>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B7C93] mb-1.5">{k === 'title' ? 'Title *' : 'Description *'}</label>
              {k === 'desc'
                ? <textarea rows={4} value={form[k]} onChange={e => setForm(p => ({...p,[k]:e.target.value}))} placeholder="Steps to reproduce, impact…" className="w-full px-3 py-2.5 border border-[#E3EAF2] rounded-xl text-sm resize-none" />
                : <input value={form[k]} onChange={e => setForm(p => ({...p,[k]:e.target.value}))} placeholder="Short summary of the issue" className="w-full px-3 py-2.5 border border-[#E3EAF2] rounded-xl text-sm" />
              }
            </div>
          ))}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B7C93] mb-1.5">Category</label>
              <select value={form.cat} onChange={e => setForm(p => ({...p, cat: e.target.value as TicketCategory}))} className="w-full px-3 py-2.5 border border-[#E3EAF2] rounded-xl text-sm bg-white">
                {(['Technical','Billing','Appointment','Other'] as TicketCategory[]).map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B7C93] mb-1.5">Priority</label>
              <div className="flex gap-2">
                {(['Low','Medium','High'] as TicketPriority[]).map(p => (
                  <button key={p} type="button" onClick={() => setForm(f => ({...f, pri:p}))}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${form.pri === p ? PRI_COLOR[p] + ' border-transparent' : 'border-[#E3EAF2] text-[#6B7C93]'}`}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B7C93] mb-1.5">Assign to</label>
            <select value={form.to} onChange={e => setForm(p => ({...p, to:e.target.value}))} className="w-full px-3 py-2.5 border border-[#E3EAF2] rounded-xl text-sm bg-white">
              {USERS.map(u => <option key={u.id} value={u.id}>{u.name} — {u.role}</option>)}
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
};
