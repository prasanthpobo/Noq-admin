import React, { useState } from 'react';
import { Header } from '../components/layout/Header';
import {
  HiOfficeBuilding, HiClock, HiBell, HiCash, HiShieldCheck, HiDocumentText, HiLockClosed,
} from 'react-icons/hi';

const TABS = [
  { k:'clinic',   l:'Clinic profile',     icon: HiOfficeBuilding },
  { k:'hours',    l:'Working hours',      icon: HiClock },
  { k:'notif',    l:'Notifications',      icon: HiBell },
  { k:'billing',  l:'Billing & taxes',    icon: HiCash },
  { k:'security', l:'Security & access',  icon: HiShieldCheck },
  { k:'terms',    l:'Terms & Conditions', icon: HiDocumentText },
  { k:'privacy',  l:'Privacy Policy',     icon: HiLockClosed },
];

const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];

interface FieldProps { label: string; defaultValue?: string; type?: string; full?: boolean; tag?: string }
const Field = ({ label, defaultValue, type = 'text', full = false, tag }: FieldProps) => (
  <div className={full ? 'col-span-2' : ''}>
    <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B7C93] mb-1.5">{label}</label>
    {tag === 'textarea'
      ? <textarea rows={2} defaultValue={defaultValue} className="w-full px-3 py-2.5 border border-[#E3EAF2] rounded-xl text-sm bg-white resize-none" />
      : tag === 'select'
      ? <select defaultValue={defaultValue} className="w-full px-3 py-2.5 border border-[#E3EAF2] rounded-xl text-sm bg-white"><option>INR</option><option>USD</option></select>
      : <input type={type} defaultValue={defaultValue} className="w-full px-3 py-2.5 border border-[#E3EAF2] rounded-xl text-sm bg-white" />
    }
  </div>
);

const Toggle = ({ on, onClick }: { on: boolean; onClick: () => void }) => (
  <button onClick={onClick}
    className={`w-11 h-6 rounded-full relative transition-colors duration-200 ${on ? 'brand-gradient' : 'bg-[#E3EAF2]'}`}>
    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${on ? 'left-6' : 'left-1'}`} />
  </button>
);

export const Settings = () => {
  const [tab, setTab] = useState('clinic');
  const [notif, setNotif] = useState({ sms:true, email:true, push:false, queue:true });
  const [security, setSecurity] = useState({ twoFa:true, timeout:true, audit:true, ipRestrict:false });

  return (
    <div>
      <Header title="Settings" crumbs="Configure your clinic" />
      <div className="p-6">
        <div className="flex gap-6">
          {/* Tab nav */}
          <aside className="w-52 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-[#E3EAF2] shadow-sm p-2">
              {TABS.map(t => (
                <button key={t.k} onClick={() => setTab(t.k)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all mb-0.5 ${tab === t.k
                    ? 'brand-gradient text-white shadow-sm' : 'text-[#3D4A5B] hover:bg-[#F5F8FC] hover:text-[#1E4FA3]'}`}>
                  <t.icon size={16} /> {t.l}
                </button>
              ))}
            </div>
          </aside>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {tab === 'clinic' && (
              <div className="bg-white rounded-2xl border border-[#E3EAF2] shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <div><h2 className="font-bold text-[#1A1A1A]">Clinic profile</h2><p className="text-xs text-[#6B7C93] mt-0.5">Shown to patients on the app</p></div>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-xl brand-gradient text-white text-sm font-semibold shadow-sm">Save changes</button>
                </div>
                <div className="flex items-center gap-4 pb-5 border-b border-dashed border-[#E3EAF2] mb-5">
                  <div className="w-14 h-14 rounded-2xl brand-gradient flex items-center justify-center text-white text-lg font-black shadow-lg">SC</div>
                  <div className="flex-1"><div className="font-bold">Sunshine Clinic</div><div className="text-xs text-[#6B7C93]">OPD · 16 doctors · est. 2014</div></div>
                  <button className="px-3 py-2 rounded-xl border border-[#E3EAF2] text-sm font-medium text-[#6B7C93]">Replace logo</button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Clinic name"      defaultValue="Sunshine Clinic" />
                  <Field label="Registration no." defaultValue="MH-OPD-2014-00482" />
                  <Field label="Address"          defaultValue="14, Linking Road, Bandra West, Mumbai 400050" full tag="textarea" />
                  <Field label="Phone"            defaultValue="+91 22 6800 1100" />
                  <Field label="Email"            defaultValue="hello@sunshine.health" />
                  <Field label="Specialties"      defaultValue="General medicine, Cardiology, Pediatrics" />
                  <Field label="Token prefix"     defaultValue="A, B, C, D · E (emergency)" />
                </div>
              </div>
            )}

            {tab === 'hours' && (
              <div className="bg-white rounded-2xl border border-[#E3EAF2] shadow-sm p-6">
                <h2 className="font-bold text-[#1A1A1A] mb-1">Working hours</h2>
                <p className="text-xs text-[#6B7C93] mb-5">Patients can only book within these slots</p>
                <div className="space-y-1">
                  {DAYS.map((day, i) => (
                    <div key={day} className={`flex items-center gap-4 py-3 ${i < 6 ? 'border-b border-dashed border-[#EEF2F7]' : ''}`}>
                      <div className="w-24 text-sm font-semibold text-[#3D4A5B]">{day}</div>
                      <Toggle on={i < 6} onClick={() => {}} />
                      {i < 6 ? (
                        <div className="flex items-center gap-2">
                          <input defaultValue="09:00 AM" className="w-28 px-3 py-2 border border-[#E3EAF2] rounded-xl text-sm" />
                          <span className="text-[#A0AEC0]">—</span>
                          <input defaultValue="08:00 PM" className="w-28 px-3 py-2 border border-[#E3EAF2] rounded-xl text-sm" />
                        </div>
                      ) : <span className="text-xs text-[#A0AEC0] font-semibold">Closed</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === 'notif' && (
              <div className="bg-white rounded-2xl border border-[#E3EAF2] shadow-sm p-6">
                <h2 className="font-bold text-[#1A1A1A] mb-1">Notifications</h2>
                <p className="text-xs text-[#6B7C93] mb-5">Choose how you receive clinic updates</p>
                {([['sms','SMS to staff','Token alerts and emergencies via SMS'],['email','Email digest','Daily summary at 9 PM'],['push','Browser push','Real-time alerts in background'],['queue','Queue alerts','Notify when wait time > 30 min']] as const).map(([k,t,s]) => (
                  <div key={k} className="flex items-center justify-between py-4 border-b border-[#EEF2F7] last:border-0">
                    <div><div className="font-semibold text-sm text-[#1A1A1A]">{t}</div><div className="text-xs text-[#6B7C93] mt-0.5">{s}</div></div>
                    <Toggle on={notif[k]} onClick={() => setNotif(p => ({...p, [k]: !p[k]}))} />
                  </div>
                ))}
              </div>
            )}

            {tab === 'billing' && (
              <div className="bg-white rounded-2xl border border-[#E3EAF2] shadow-sm p-6">
                <h2 className="font-bold text-[#1A1A1A] mb-1">Billing & taxes</h2>
                <p className="text-xs text-[#6B7C93] mb-5">Invoice and GST configuration</p>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="GSTIN"               defaultValue="27AABCS1234F1Z5" />
                  <Field label="Currency"            tag="select" />
                  <Field label="Default consult fee" defaultValue="₹ 500" />
                  <Field label="Tax %"               defaultValue="18" />
                  <Field label="Invoice notes" full tag="textarea" defaultValue="Thank you for visiting Sunshine Clinic." />
                </div>
              </div>
            )}

            {tab === 'security' && (
              <div className="bg-white rounded-2xl border border-[#E3EAF2] shadow-sm p-6">
                <h2 className="font-bold text-[#1A1A1A] mb-1">Security & access</h2>
                <p className="text-xs text-[#6B7C93] mb-5">Two-factor, sessions and audit log</p>
                {([['twoFa','Two-factor authentication','Required for all admin and reception accounts'],['timeout','Session timeout','Auto sign-out after 30 minutes idle'],['audit','Audit log','Track every patient record access'],['ipRestrict','Restrict by IP','Only allow login from clinic network']] as const).map(([k,t,s]) => (
                  <div key={k} className="flex items-center justify-between py-4 border-b border-[#EEF2F7] last:border-0">
                    <div><div className="font-semibold text-sm text-[#1A1A1A]">{t}</div><div className="text-xs text-[#6B7C93] mt-0.5">{s}</div></div>
                    <Toggle on={security[k]} onClick={() => setSecurity(p => ({...p, [k]: !p[k]}))} />
                  </div>
                ))}
              </div>
            )}

            {(tab === 'terms' || tab === 'privacy') && (
              <div className="bg-white rounded-2xl border border-[#E3EAF2] shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="font-bold text-[#1A1A1A]">{tab === 'terms' ? 'Terms & Conditions' : 'Privacy Policy'}</h2>
                    <p className="text-xs text-[#6B7C93] mt-0.5">Last updated 1 May 2026 · {tab === 'terms' ? 'v3.2' : 'v2.4 · GDPR & DPDP compliant'}</p>
                  </div>
                  <button className="px-4 py-2 rounded-xl brand-gradient text-white text-sm font-semibold">I accept</button>
                </div>
                <div className="prose prose-sm max-w-none text-[#3D4A5B] space-y-4">
                  <p className="text-sm leading-relaxed">This document governs the use of the NoQ Clinic Admin platform. By accessing the Service, you agree to be bound by these terms. All users including clinic staff, doctors, nurses, front-desk operators and administrators must comply.</p>
                  <div className="bg-[#F5F8FC] rounded-xl p-4 text-sm space-y-2">
                    <div className="font-bold text-[#1A1A1A]">Key points:</div>
                    <ul className="list-disc pl-4 space-y-1 text-[#6B7C93]">
                      <li>Service intended solely for managing clinic operations</li>
                      <li>Each staff member must use their own login — shared accounts are prohibited</li>
                      <li>Data is protected via TLS 1.3 in transit, AES-256 at rest</li>
                      <li>Appointments may be rescheduled up to 1 hour before the slot</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
