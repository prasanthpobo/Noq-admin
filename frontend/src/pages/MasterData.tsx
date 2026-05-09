import React, { useState, useMemo } from 'react';
import { HiSearch, HiPencil, HiTrash, HiPlus, HiDatabase } from 'react-icons/hi';
import { Header } from '../components/layout/Header';
import { Modal } from '../components/ui/Modal';

const TABS = ['Departments', 'Specialties', 'ICD Codes', 'Drug Catalogue'];

interface RowItem { id: string; [key: string]: string }

const DEPARTMENTS: RowItem[] = [
  { id:'1', name:'General OPD',     head:'Dr. Ananya Rao',   rooms:'4', active:'Yes' },
  { id:'2', name:'Cardiology',      head:'Dr. Vikram Mehta', rooms:'2', active:'Yes' },
  { id:'3', name:'Dermatology',     head:'Dr. Priya Iyer',   rooms:'2', active:'Yes' },
  { id:'4', name:'Pediatrics',      head:'Dr. Rahul Khanna', rooms:'3', active:'Yes' },
  { id:'5', name:'Gynecology',      head:'Dr. Neha Sharma',  rooms:'2', active:'Yes' },
  { id:'6', name:'Orthopedics',     head:'Dr. Arjun Desai',  rooms:'3', active:'Yes' },
  { id:'7', name:'Radiology',       head:'',                 rooms:'2', active:'Yes' },
  { id:'8', name:'Emergency',       head:'',                 rooms:'5', active:'Yes' },
  { id:'9', name:'Ophthalmology',   head:'',                 rooms:'1', active:'No'  },
  { id:'10',name:'Neurology',       head:'',                 rooms:'1', active:'No'  },
];

const SPECIALTIES: RowItem[] = [
  { id:'1', name:'General Medicine',       category:'Primary care', active:'Yes' },
  { id:'2', name:'Cardiology',             category:'Specialist',   active:'Yes' },
  { id:'3', name:'Dermatology',            category:'Specialist',   active:'Yes' },
  { id:'4', name:'Pediatrics',             category:'Primary care', active:'Yes' },
  { id:'5', name:'Obstetrics & Gynecology',category:'Specialist',   active:'Yes' },
  { id:'6', name:'Orthopedic Surgery',     category:'Surgical',     active:'Yes' },
  { id:'7', name:'Ophthalmology',          category:'Specialist',   active:'No' },
  { id:'8', name:'Neurology',              category:'Specialist',   active:'No' },
  { id:'9', name:'ENT',                    category:'Specialist',   active:'Yes' },
  { id:'10',name:'Psychiatry',             category:'Specialist',   active:'No' },
];

const ICD_CODES: RowItem[] = [
  { id:'1', code:'J06.9',  description:'Acute upper respiratory infection, unspecified',  category:'Respiratory' },
  { id:'2', code:'I10',    description:'Essential (primary) hypertension',                category:'Cardiovascular' },
  { id:'3', code:'E11.9',  description:'Type 2 diabetes mellitus without complications',  category:'Endocrine' },
  { id:'4', code:'M54.5',  description:'Low back pain',                                   category:'Musculoskeletal' },
  { id:'5', code:'K21.0',  description:'Gastro-oesophageal reflux disease with oesophagitis', category:'Digestive' },
  { id:'6', code:'J45.909',description:'Unspecified asthma, uncomplicated',               category:'Respiratory' },
  { id:'7', code:'N39.0',  description:'Urinary tract infection, site not specified',     category:'Urinary' },
  { id:'8', code:'L30.9',  description:'Dermatitis, unspecified',                         category:'Skin' },
  { id:'9', code:'F32.9',  description:'Major depressive disorder, single episode, unspecified', category:'Mental health' },
  { id:'10',code:'H52.4',  description:'Presbyopia',                                      category:'Eye' },
  { id:'11',code:'I25.10', description:'Atherosclerotic heart disease of native coronary artery', category:'Cardiovascular' },
  { id:'12',code:'M79.3',  description:'Panniculitis, unspecified',                       category:'Soft tissue' },
];

const DRUGS: RowItem[] = [
  { id:'1', name:'Paracetamol 500mg',    category:'Analgesic',     form:'Tablet',  stock:'1240', reorderLevel:'200' },
  { id:'2', name:'Amoxicillin 500mg',    category:'Antibiotic',    form:'Capsule', stock:'680',  reorderLevel:'100' },
  { id:'3', name:'Atorvastatin 40mg',    category:'Statin',        form:'Tablet',  stock:'540',  reorderLevel:'100' },
  { id:'4', name:'Metformin 500mg',      category:'Antidiabetic',  form:'Tablet',  stock:'12',   reorderLevel:'50'  },
  { id:'5', name:'Amlodipine 5mg',       category:'Antihypertensive',form:'Tablet',stock:'420',  reorderLevel:'100' },
  { id:'6', name:'Omeprazole 20mg',      category:'Antacid',       form:'Capsule', stock:'890',  reorderLevel:'150' },
  { id:'7', name:'Cetirizine 10mg',      category:'Antihistamine', form:'Tablet',  stock:'760',  reorderLevel:'100' },
  { id:'8', name:'Insulin Glargine',     category:'Insulin',       form:'Injection',stock:'5',   reorderLevel:'20'  },
  { id:'9', name:'Azithromycin 500mg',   category:'Antibiotic',    form:'Tablet',  stock:'320',  reorderLevel:'80'  },
  { id:'10',name:'Diclofenac 50mg',      category:'NSAID',         form:'Tablet',  stock:'640',  reorderLevel:'100' },
  { id:'11',name:'Metoprolol 25mg',      category:'Beta-blocker',  form:'Tablet',  stock:'380',  reorderLevel:'80'  },
  { id:'12',name:'Clopidogrel 75mg',     category:'Antiplatelet',  form:'Tablet',  stock:'8',    reorderLevel:'30'  },
];

const CONFIG: Record<string, { data: RowItem[], cols: { key:string; label:string }[], formFields: string[] }> = {
  'Departments':   { data:DEPARTMENTS,  cols:[{key:'name',label:'Name'},{key:'head',label:'Head of dept'},{key:'rooms',label:'Rooms'},{key:'active',label:'Active'}], formFields:['name','head','rooms'] },
  'Specialties':   { data:SPECIALTIES,  cols:[{key:'name',label:'Name'},{key:'category',label:'Category'},{key:'active',label:'Active'}], formFields:['name','category'] },
  'ICD Codes':     { data:ICD_CODES,    cols:[{key:'code',label:'Code'},{key:'description',label:'Description'},{key:'category',label:'Category'}], formFields:['code','description','category'] },
  'Drug Catalogue':{ data:DRUGS,        cols:[{key:'name',label:'Drug name'},{key:'category',label:'Category'},{key:'form',label:'Form'},{key:'stock',label:'Stock'},{key:'reorderLevel',label:'Min. stock'}], formFields:['name','category','form','stock','reorderLevel'] },
};

export const MasterData = () => {
  const [tab, setTab] = useState('Departments');
  const [q, setQ] = useState('');
  const [items, setItems] = useState<Record<string, RowItem[]>>({
    Departments: DEPARTMENTS, Specialties: SPECIALTIES, 'ICD Codes': ICD_CODES, 'Drug Catalogue': DRUGS,
  });
  const [modal, setModal] = useState<'create' | 'edit' | null>(null);
  const [editing, setEditing] = useState<RowItem | null>(null);
  const [form, setForm] = useState<Record<string,string>>({});
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const cfg = CONFIG[tab];
  const data = items[tab] || [];

  const filtered = useMemo(() => data.filter(row =>
    !q || Object.values(row).some(v => String(v).toLowerCase().includes(q.toLowerCase()))
  ), [data, q, tab]);

  const openCreate = () => { setEditing(null); setForm(Object.fromEntries(cfg.formFields.map(f => [f,'']))); setModal('create'); };
  const openEdit = (row: RowItem) => { setEditing(row); setForm({ ...row }); setModal('edit'); };
  const save = () => {
    if (editing) {
      setItems(prev => ({ ...prev, [tab]: prev[tab].map(r => r.id === editing.id ? { ...r, ...form } : r) }));
    } else {
      setItems(prev => ({ ...prev, [tab]: [{ id: Date.now().toString(), ...form }, ...prev[tab]] }));
    }
    setModal(null);
  };
  const confirmDelete = () => {
    if (!deleteId) return;
    setItems(prev => ({ ...prev, [tab]: prev[tab].filter(r => r.id !== deleteId) }));
    setDeleteId(null);
  };

  const isLowStock = (row: RowItem) => row.stock && row.reorderLevel && Number(row.stock) <= Number(row.reorderLevel);

  return (
    <div>
      <Header title="Master Data" crumbs="ICD codes, drug catalogue, departments" onAdd={openCreate} addLabel={`Add ${tab === 'ICD Codes' ? 'code' : tab === 'Drug Catalogue' ? 'drug' : tab.slice(0,-1).toLowerCase()}`} />
      <div className="p-6 space-y-5">
        <div className="flex items-center gap-1.5 p-1 bg-[#F5F8FC] rounded-2xl border border-[#E3EAF2] w-fit">
          {TABS.map(t => (
            <button key={t} onClick={() => { setTab(t); setQ(''); }} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${tab === t ? 'bg-white text-[#1E4FA3] shadow-sm border border-[#E3EAF2]' : 'text-[#6B7C93] hover:text-[#1A1A1A]'}`}>
              {t}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-[#E3EAF2] shadow-sm overflow-hidden">
          <div className="flex items-center gap-3 p-4 border-b border-[#E3EAF2]">
            <div className="flex items-center gap-2 bg-[#F5F8FC] border border-[#E3EAF2] rounded-xl px-3 py-2">
              <HiSearch size={15} className="text-[#A0AEC0]" />
              <input placeholder={`Search ${tab.toLowerCase()}…`} value={q} onChange={e => setQ(e.target.value)} className="bg-transparent text-sm text-[#3D4A5B] outline-none w-52" />
            </div>
            <div className="ml-auto flex items-center gap-2">
              <span className="text-xs text-[#6B7C93]">{filtered.length} records</span>
              <HiDatabase size={14} className="text-[#A0AEC0]" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[10px] font-bold uppercase tracking-wider text-[#A0AEC0] bg-[#F5F8FC]">
                  {cfg.cols.map(c => <th key={c.key} className="px-4 py-3 text-left">{c.label}</th>)}
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEF2F7]">
                {filtered.map(row => (
                  <tr key={row.id} className={`hover:bg-[#F5F8FC] transition-colors ${isLowStock(row) ? 'bg-red-50' : ''}`}>
                    {cfg.cols.map(c => (
                      <td key={c.key} className="px-4 py-3">
                        {c.key === 'active' ? (
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${row[c.key]==='Yes' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>{row[c.key]}</span>
                        ) : c.key === 'stock' ? (
                          <span className={`font-semibold ${isLowStock(row) ? 'text-red-600' : 'text-[#1A1A1A]'}`}>{row[c.key]} {isLowStock(row) && '⚠'}</span>
                        ) : c.key === 'code' ? (
                          <span className="font-mono text-xs bg-[#F5F8FC] text-[#1E4FA3] px-2 py-0.5 rounded-lg font-bold">{row[c.key]}</span>
                        ) : (
                          <span className={`${c.key === 'name' || c.key === 'description' ? 'font-medium text-[#1A1A1A]' : 'text-[#6B7C93]'}`}>{row[c.key] || '—'}</span>
                        )}
                      </td>
                    ))}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(row)} className="p-1.5 rounded-lg hover:bg-[#E8F1FD] text-[#6B7C93] hover:text-[#1E4FA3] transition-colors"><HiPencil size={14}/></button>
                        <button onClick={() => setDeleteId(row.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-[#6B7C93] hover:text-red-600 transition-colors"><HiTrash size={14}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-[#EEF2F7] text-sm text-[#6B7C93]">
            Showing <b className="text-[#1A1A1A]">{filtered.length}</b> of {data.length}
          </div>
        </div>
      </div>

      <Modal open={!!modal} onClose={() => setModal(null)} title={`${modal === 'create' ? 'Add' : 'Edit'} ${tab.slice(0,-1).toLowerCase()}`} size="md"
        footer={<>
          <button onClick={() => setModal(null)} className="px-4 py-2 rounded-xl border border-[#E3EAF2] text-sm font-medium text-[#6B7C93] hover:bg-[#F5F8FC]">Cancel</button>
          <button onClick={save} className="px-5 py-2 rounded-xl brand-gradient text-white text-sm font-semibold shadow-sm hover:opacity-90">{modal === 'create' ? 'Add' : 'Save changes'}</button>
        </>}>
        <div className="space-y-4">
          {cfg.formFields.map(f => (
            <div key={f}>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B7C93] mb-1.5 capitalize">{f.replace(/([A-Z])/g,' $1').toLowerCase()}</label>
              <input value={form[f]||''} onChange={e => setForm(p => ({ ...p, [f]: e.target.value }))} className="w-full px-3 py-2.5 border border-[#E3EAF2] rounded-xl text-sm bg-white text-[#1A1A1A]" />
            </div>
          ))}
        </div>
      </Modal>

      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete record" size="md"
        footer={<>
          <button onClick={() => setDeleteId(null)} className="px-4 py-2 rounded-xl border border-[#E3EAF2] text-sm font-medium text-[#6B7C93] hover:bg-[#F5F8FC]">Cancel</button>
          <button onClick={confirmDelete} className="px-5 py-2 rounded-xl bg-red-600 text-white text-sm font-semibold shadow-sm hover:bg-red-700">Delete</button>
        </>}>
        <p className="text-sm text-[#6B7C93]">This will permanently delete this record.</p>
      </Modal>
    </div>
  );
};
