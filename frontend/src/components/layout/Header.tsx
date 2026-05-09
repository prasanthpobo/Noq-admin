import React, { ReactNode } from 'react';
import { HiSearch, HiBell, HiPlus } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  title: string;
  crumbs?: string;
  onAdd?: () => void;
  addLabel?: string;
  actions?: ReactNode;
}

export const Header = ({ title, crumbs, onAdd, addLabel = 'Add', actions }: HeaderProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b border-[#E3EAF2] px-6 py-4 flex items-center gap-4 sticky top-0 z-10 shadow-sm">
      <div className="flex-1 min-w-0">
        <h1 className="text-xl font-bold text-[#1A1A1A] leading-none">{title}</h1>
        {crumbs && <p className="text-xs text-[#6B7C93] mt-1 font-medium">{crumbs}</p>}
      </div>

      <div className="flex items-center gap-2 bg-[#F5F8FC] border border-[#E3EAF2] rounded-xl px-3 py-2 w-64 hidden md:flex">
        <HiSearch size={15} className="text-[#A0AEC0]" />
        <input
          placeholder="Search patients, tokens…"
          className="bg-transparent text-sm text-[#3D4A5B] placeholder-[#A0AEC0] border-none outline-none flex-1 min-w-0"
        />
        <kbd className="text-[10px] font-semibold text-[#A0AEC0] bg-[#E3EAF2] rounded px-1 hidden lg:block">⌘K</kbd>
      </div>

      <button className="relative p-2 rounded-xl hover:bg-[#F5F8FC] transition-colors text-[#6B7C93] hover:text-[#1E4FA3]">
        <HiBell size={20} />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
      </button>

      {actions}

      {onAdd && (
        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white brand-gradient shadow-md hover:opacity-90 transition-opacity"
        >
          <HiPlus size={16} />
          {addLabel}
        </button>
      )}

      {user && (
        <button
          onClick={() => navigate('/settings')}
          className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-[#F5F8FC] transition-colors"
        >
          <div className="w-8 h-8 rounded-xl brand-gradient flex items-center justify-center text-white text-xs font-bold">
            {user.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
          </div>
          <div className="hidden lg:block text-left">
            <div className="text-xs font-semibold text-[#1A1A1A] leading-none">{user.name}</div>
            <div className="text-[11px] text-[#6B7C93] capitalize leading-none mt-0.5">{user.role.replace('_', ' ')}</div>
          </div>
        </button>
      )}
    </header>
  );
};
