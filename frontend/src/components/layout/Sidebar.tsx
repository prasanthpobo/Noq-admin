import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  HiViewGrid, HiOfficeBuilding, HiUserGroup, HiCalendar,
  HiTicket, HiUserCircle, HiShieldCheck, HiHeart,
  HiChartBar, HiCog, HiSupport, HiCash, HiBeaker, HiTemplate,
  HiDatabase, HiLogout, HiChevronDown, HiChevronRight,
} from 'react-icons/hi';
import { FaStethoscope } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { avatarInitials, toneClass } from '../../utils/helpers';

interface NavItem { path: string; label: string; icon: React.ComponentType<{ size?: number }> }
interface NavGroup { group: string; items: NavItem[] }

const NAV: NavGroup[] = [
  { group: 'Workspace', items: [
    { path: '/', label: 'Dashboard', icon: HiViewGrid },
    { path: '/book', label: 'Book Appointment', icon: HiCalendar },
    { path: '/tokens', label: 'Live Tokens', icon: HiTicket },
  ]},
  { group: 'Clinic', items: [
    { path: '/appointments', label: 'Appointments', icon: HiCalendar },
    { path: '/clinics', label: 'Clinics', icon: HiOfficeBuilding },
  ]},
  { group: 'Manage', items: [
    { path: '/doctors',   label: 'Doctors',    icon: FaStethoscope },
    { path: '/nurses',    label: 'Nurses',      icon: HiHeart },
    { path: '/frontdesk', label: 'Front Desk',  icon: HiUserCircle },
    { path: '/patients',  label: 'Patients',    icon: HiUserGroup },
    { path: '/users',     label: 'Admin Users', icon: HiShieldCheck },
  ]},
  { group: 'Operations', items: [
    { path: '/billing',  label: 'Billing',  icon: HiCash },
    { path: '/pharmacy', label: 'Pharmacy', icon: HiTemplate },
    { path: '/lab',      label: 'Lab',      icon: HiBeaker },
    { path: '/reports',  label: 'Reports',  icon: HiChartBar },
  ]},
  { group: 'System', items: [
    { path: '/master-data', label: 'Master Data', icon: HiDatabase },
  ]},
  { group: 'Account', items: [
    { path: '/tickets',  label: 'Support Tickets', icon: HiSupport },
    { path: '/settings', label: 'Settings',        icon: HiCog },
  ]},
];

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggleGroup = (g: string) => setCollapsed(p => ({ ...p, [g]: !p[g] }));

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <aside className="w-64 bg-white border-r border-[#E3EAF2] flex flex-col h-screen sticky top-0 shadow-sm flex-shrink-0">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-[#E3EAF2]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl brand-gradient flex items-center justify-center shadow-lg">
            <span className="text-white font-black text-sm">N</span>
          </div>
          <div>
            <div className="font-black text-[#1E4FA3] text-base leading-none">NoQ</div>
            <div className="text-[10px] text-[#6B7C93] font-semibold uppercase tracking-wider mt-0.5">Clinic Admin</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-3">
        {NAV.map(({ group, items }) => (
          <div key={group} className="mb-1">
            <button
              onClick={() => toggleGroup(group)}
              className="w-full flex items-center justify-between px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#A0AEC0] hover:text-[#6B7C93] transition-colors"
            >
              {group}
              {collapsed[group] ? <HiChevronRight size={12} /> : <HiChevronDown size={12} />}
            </button>
            {!collapsed[group] && items.map(({ path, label, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                end={path === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all mb-0.5 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#1E4FA3] to-[#2C6ED5] text-white shadow-md'
                      : 'text-[#3D4A5B] hover:bg-[#F5F8FC] hover:text-[#1E4FA3]'
                  }`}
              >
                <Icon size={16} />
                {label}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* User footer */}
      {user && (
        <div className="p-3 border-t border-[#E3EAF2]">
          <div className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-[#F5F8FC] cursor-pointer group">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 ${toneClass('blue')}`}>
              {avatarInitials(user.name)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-[#1A1A1A] truncate">{user.name}</div>
              <div className="text-[11px] text-[#6B7C93] truncate capitalize">{user.role.replace('_', ' ')}</div>
            </div>
            <button onClick={handleLogout} title="Sign out"
              className="p-1.5 rounded-lg text-[#A0AEC0] hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100">
              <HiLogout size={15} />
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};
