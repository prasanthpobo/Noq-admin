import React, { useState, useEffect } from 'react';
import { HiCheck, HiChevronRight, HiCalendar, HiUser, HiSearch, HiPhone } from 'react-icons/hi';
import { Header } from '../components/layout/Header';
import { doctorsAPI, patientsAPI, appointmentsAPI } from '../services/api';
import { Doctor, Patient } from '../types';
import { avatarColor } from '../utils/helpers';

const SAMPLE_DOCTORS: Doctor[] = [
  { _id:'1', name:'Dr. Ananya Rao',   speciality:'General medicine', department:'OPD',    room:'Room 1', fee:400, experience:'12 yrs', rating:4.8, status:'on',    todayTokens:8, weekTokens:42 },
  { _id:'2', name:'Dr. Vikram Mehta', speciality:'Cardiology',       department:'Cardio', room:'Room 4', fee:800, experience:'18 yrs', rating:4.9, status:'busy',  todayTokens:12,weekTokens:61 },
  { _id:'3', name:'Dr. Priya Iyer',   speciality:'Dermatology',      department:'Derm',   room:'Room 2', fee:600, experience:'8 yrs',  rating:4.7, status:'on',    todayTokens:6, weekTokens:31 },
  { _id:'4', name:'Dr. Rahul Khanna', speciality:'Pediatrics',       department:'Peds',   room:'Room 3', fee:500, experience:'14 yrs', rating:4.8, status:'leave', todayTokens:0, weekTokens:38 },
  { _id:'5', name:'Dr. Neha Sharma',  speciality:'Gynecology',       department:'Gyn',    room:'Room 5', fee:700, experience:'10 yrs', rating:4.9, status:'on',    todayTokens:5, weekTokens:27 },
  { _id:'6', name:'Dr. Arjun Desai',  speciality:'Orthopedics',      department:'Ortho',  room:'Room 6', fee:750, experience:'16 yrs', rating:4.6, status:'on',    todayTokens:7, weekTokens:35 },
];

const SLOTS = ['09:00 AM','09:30 AM','10:00 AM','10:30 AM','11:00 AM','11:30 AM','02:00 PM','02:30 PM','03:00 PM','03:30 PM','04:00 PM','04:30 PM'];
const BOOKED_SLOTS = ['09:30 AM','11:00 AM','02:00 PM','03:30 PM'];

const STEPS = ['Doctor','Date & Time','Patient','Confirm'];

const statusColor: Record<string,string> = { on:'bg-emerald-100 text-emerald-700', busy:'bg-amber-100 text-amber-700', leave:'bg-gray-100 text-gray-500', inactive:'bg-gray-100 text-gray-400' };

export const BookAppointment = () => {
  const [step, setStep] = useState(0);
  const [doctors, setDoctors]  = useState<Doctor[]>(SAMPLE_DOCTORS);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedDoc, setSelectedDoc]  = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [patientQ, setPatientQ] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [reason, setReason] = useState('');
  const [booking, setBooking] = useState(false);
  const [booked, setBooked] = useState(false);
  const [docFilter, setDocFilter] = useState('');

  useEffect(() => {
    doctorsAPI.list().then(r => { if (r.data?.data?.length) setDoctors(r.data.data); }).catch(() => {});
  }, []);

  useEffect(() => {
    if (patientQ.length < 2) { setPatients([]); return; }
    patientsAPI.list({ q: patientQ }).then(r => { if (r.data?.data) setPatients(r.data.data); }).catch(() => {});
  }, [patientQ]);

  const today = new Date().toISOString().split('T')[0];

  const filteredDocs = doctors.filter(d =>
    !docFilter || d.name.toLowerCase().includes(docFilter.toLowerCase()) || d.speciality.toLowerCase().includes(docFilter.toLowerCase())
  );

  const doBook = async () => {
    if (!selectedDoc || !selectedPatient || !selectedDate || !selectedSlot) return;
    setBooking(true);
    try {
      await appointmentsAPI.create({ patient: selectedPatient._id, doctor: selectedDoc._id, date: new Date(selectedDate+'T'+selectedSlot).toISOString(), slot: selectedSlot, reason });
    } catch {}
    setBooked(true);
    setBooking(false);
  };

  const reset = () => { setStep(0); setSelectedDoc(null); setSelectedDate(''); setSelectedSlot(''); setSelectedPatient(null); setReason(''); setBooked(false); };

  if (booked) return (
    <div>
      <Header title="Book Appointment" crumbs="Step-by-step booking" />
      <div className="p-6 flex items-center justify-center min-h-64">
        <div className="bg-white rounded-2xl border border-[#E3EAF2] shadow-sm p-10 text-center max-w-sm w-full">
          <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <HiCheck size={32} className="text-emerald-600" />
          </div>
          <h3 className="text-lg font-bold text-[#1A1A1A] mb-2">Appointment booked!</h3>
          <p className="text-sm text-[#6B7C93] mb-1"><b>{selectedPatient?.firstName} {selectedPatient?.lastName}</b></p>
          <p className="text-sm text-[#6B7C93] mb-1">{selectedDoc?.name} · {selectedDate}</p>
          <p className="text-sm text-[#6B7C93] mb-6">{selectedSlot}</p>
          <button onClick={reset} className="px-6 py-2.5 rounded-xl brand-gradient text-white text-sm font-semibold shadow-sm hover:opacity-90">Book another</button>
        </div>
      </div>
    </div>
  );

  const tones: Record<string,string> = { blue:'bg-blue-100 text-blue-800', pink:'bg-pink-100 text-pink-800', amber:'bg-amber-100 text-amber-800', mint:'bg-emerald-100 text-emerald-800', indigo:'bg-indigo-100 text-indigo-800', plum:'bg-purple-100 text-purple-800', rose:'bg-rose-100 text-rose-800', teal:'bg-teal-100 text-teal-800' };

  return (
    <div>
      <Header title="Book Appointment" crumbs="Step-by-step booking" />
      <div className="p-6 max-w-4xl">
        <div className="flex items-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <React.Fragment key={s}>
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold ${i < step ? 'brand-gradient text-white' : i === step ? 'border-2 border-[#2C6ED5] text-[#2C6ED5]' : 'bg-[#F5F8FC] text-[#A0AEC0]'}`}>
                  {i < step ? <HiCheck size={14} /> : i + 1}
                </div>
                <span className={`text-sm font-semibold hidden sm:block ${i === step ? 'text-[#1A1A1A]' : i < step ? 'text-[#2C6ED5]' : 'text-[#A0AEC0]'}`}>{s}</span>
              </div>
              {i < STEPS.length - 1 && <HiChevronRight size={16} className="text-[#E3EAF2] flex-shrink-0" />}
            </React.Fragment>
          ))}
        </div>

        {step === 0 && (
          <div>
            <h2 className="text-lg font-bold text-[#1A1A1A] mb-1">Select a doctor</h2>
            <p className="text-sm text-[#6B7C93] mb-4">Choose the doctor for this appointment</p>
            <div className="flex items-center gap-2 bg-[#F5F8FC] border border-[#E3EAF2] rounded-xl px-3 py-2 mb-4 w-72">
              <HiSearch size={15} className="text-[#A0AEC0]" />
              <input placeholder="Search by name or speciality…" value={docFilter} onChange={e => setDocFilter(e.target.value)} className="bg-transparent text-sm text-[#3D4A5B] outline-none flex-1" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDocs.map(d => {
                const tone = avatarColor(d.name);
                return (
                  <button key={d._id} onClick={() => { if (d.status !== 'leave') { setSelectedDoc(d); setStep(1); } }}
                    disabled={d.status === 'leave'}
                    className={`bg-white rounded-2xl border-2 p-4 text-left transition-all hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed ${selectedDoc?._id === d._id ? 'border-[#2C6ED5] shadow-md' : 'border-[#E3EAF2] hover:border-[#2C6ED5]'}`}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 ${tones[tone]||tones.blue}`}>
                        {d.name.split(' ').slice(1).map((n:string) => n[0]).join('').slice(0,2)}
                      </div>
                      <div>
                        <div className="font-bold text-[#1A1A1A] text-sm">{d.name}</div>
                        <div className="text-xs text-[#6B7C93]">{d.speciality}</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className={`px-2 py-0.5 rounded-full font-semibold capitalize ${statusColor[d.status]}`}>{d.status === 'on' ? 'Available' : d.status === 'busy' ? 'In consult' : 'On leave'}</span>
                      <span className="text-[#6B7C93]">{d.room} · ₹{d.fee}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs mt-2">
                      <span className="text-amber-500 font-medium">★ {d.rating}</span>
                      <span className="text-[#6B7C93]">{d.experience}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 1 && selectedDoc && (
          <div>
            <h2 className="text-lg font-bold text-[#1A1A1A] mb-1">Select date & time</h2>
            <p className="text-sm text-[#6B7C93] mb-4">Booking for <b>{selectedDoc.name}</b></p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B7C93] mb-2 flex items-center gap-1.5"><HiCalendar size={12} /> Date</label>
                <input type="date" min={today} value={selectedDate} onChange={e => setSelectedDate(e.target.value)}
                  className="w-full px-3 py-2.5 border border-[#E3EAF2] rounded-xl text-sm bg-white text-[#1A1A1A]" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B7C93] mb-2">Time slot</label>
                <div className="grid grid-cols-3 gap-2">
                  {SLOTS.map(s => {
                    const isBooked = BOOKED_SLOTS.includes(s);
                    return (
                      <button key={s} onClick={() => !isBooked && setSelectedSlot(s)} disabled={isBooked}
                        className={`py-2 rounded-xl text-xs font-semibold transition-all ${isBooked ? 'bg-[#F5F8FC] text-[#C4CDD9] cursor-not-allowed line-through' : selectedSlot === s ? 'brand-gradient text-white shadow-sm' : 'border border-[#E3EAF2] text-[#3D4A5B] hover:border-[#2C6ED5] hover:text-[#2C6ED5]'}`}>
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-6">
              <button onClick={() => setStep(0)} className="px-4 py-2 rounded-xl border border-[#E3EAF2] text-sm font-medium text-[#6B7C93] hover:bg-[#F5F8FC]">Back</button>
              <button onClick={() => setStep(2)} disabled={!selectedDate || !selectedSlot}
                className="px-5 py-2 rounded-xl brand-gradient text-white text-sm font-semibold shadow-sm hover:opacity-90 disabled:opacity-50">Continue</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-lg font-bold text-[#1A1A1A] mb-1">Select patient</h2>
            <p className="text-sm text-[#6B7C93] mb-4">Search for an existing patient</p>
            <div className="flex items-center gap-2 bg-[#F5F8FC] border border-[#E3EAF2] rounded-xl px-3 py-2 mb-4 max-w-sm">
              <HiSearch size={15} className="text-[#A0AEC0]" />
              <input placeholder="Search by name or phone…" value={patientQ} onChange={e => setPatientQ(e.target.value)} className="bg-transparent text-sm text-[#3D4A5B] outline-none flex-1" />
            </div>
            {patientQ.length >= 2 && patients.length === 0 && (
              <div className="text-sm text-[#6B7C93] py-3">No patients found. Try a different search.</div>
            )}
            {patients.length > 0 && (
              <div className="space-y-2 mb-4 max-w-md">
                {patients.map(p => (
                  <button key={p._id} onClick={() => setSelectedPatient(p)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${selectedPatient?._id === p._id ? 'border-[#2C6ED5] bg-blue-50' : 'border-[#E3EAF2] bg-white hover:border-[#2C6ED5]'}`}>
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 ${tones[avatarColor(p.firstName+p.lastName)]||tones.blue}`}>
                      {p.firstName[0]}{p.lastName[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-[#1A1A1A]">{p.firstName} {p.lastName}</div>
                      <div className="text-xs text-[#6B7C93]">{p.patientId} · {p.age}y · <HiPhone size={10} className="inline" /> {p.phone}</div>
                    </div>
                    {selectedPatient?._id === p._id && <HiCheck size={16} className="text-[#2C6ED5] flex-shrink-0" />}
                  </button>
                ))}
              </div>
            )}
            <div className="max-w-md mt-4">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B7C93] mb-1.5">Reason / Chief complaint (optional)</label>
              <textarea rows={3} value={reason} onChange={e => setReason(e.target.value)} placeholder="e.g. Chest pain, fever, routine checkup…" className="w-full px-3 py-2.5 border border-[#E3EAF2] rounded-xl text-sm bg-white text-[#1A1A1A] resize-none outline-none focus:border-[#2C6ED5]" />
            </div>
            <div className="flex items-center gap-3 mt-6">
              <button onClick={() => setStep(1)} className="px-4 py-2 rounded-xl border border-[#E3EAF2] text-sm font-medium text-[#6B7C93] hover:bg-[#F5F8FC]">Back</button>
              <button onClick={() => setStep(3)} disabled={!selectedPatient}
                className="px-5 py-2 rounded-xl brand-gradient text-white text-sm font-semibold shadow-sm hover:opacity-90 disabled:opacity-50">Continue</button>
            </div>
          </div>
        )}

        {step === 3 && selectedDoc && selectedPatient && (
          <div>
            <h2 className="text-lg font-bold text-[#1A1A1A] mb-1">Confirm appointment</h2>
            <p className="text-sm text-[#6B7C93] mb-6">Review the details before booking</p>
            <div className="bg-[#F5F8FC] rounded-2xl border border-[#E3EAF2] p-5 max-w-md space-y-4 mb-6">
              {[
                ['Patient',   `${selectedPatient.firstName} ${selectedPatient.lastName} · ${selectedPatient.patientId}`],
                ['Doctor',    `${selectedDoc.name} · ${selectedDoc.speciality}`],
                ['Date',      selectedDate],
                ['Time slot', selectedSlot],
                ['Room',      selectedDoc.room || '—'],
                ['Fee',       `₹${selectedDoc.fee}`],
                ...(reason ? [['Reason', reason]] : []),
              ].map(([l,v]) => (
                <div key={l} className="flex items-start justify-between gap-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#6B7C93] flex-shrink-0 w-24">{l}</span>
                  <span className="text-sm font-medium text-[#1A1A1A] text-right">{v}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setStep(2)} className="px-4 py-2 rounded-xl border border-[#E3EAF2] text-sm font-medium text-[#6B7C93] hover:bg-[#F5F8FC]">Back</button>
              <button onClick={doBook} disabled={booking} className="px-6 py-2.5 rounded-xl brand-gradient text-white text-sm font-semibold shadow-sm hover:opacity-90 disabled:opacity-60">
                {booking ? 'Booking…' : 'Confirm & Book'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
