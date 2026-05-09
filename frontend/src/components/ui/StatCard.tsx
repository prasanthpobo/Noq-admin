import React from 'react';
import { IconType } from 'react-icons';
import { HiTrendingUp, HiTrendingDown } from 'react-icons/hi';

const TONE_ICON: Record<string, string> = {
  blue:   'bg-blue-100   text-blue-700',
  mint:   'bg-emerald-100 text-emerald-700',
  amber:  'bg-amber-100  text-amber-700',
  green:  'bg-green-100  text-green-700',
  rose:   'bg-rose-100   text-rose-700',
  plum:   'bg-purple-100 text-purple-700',
  pink:   'bg-pink-100   text-pink-700',
  indigo: 'bg-indigo-100 text-indigo-700',
};

interface StatCardProps {
  icon: IconType;
  tone?: string;
  label: string;
  value: string | number;
  delta?: string;
  up?: boolean;
  foot?: string;
  accent?: boolean;
}

export const StatCard = ({ icon: Icon, tone = 'blue', label, value, delta, up, foot, accent }: StatCardProps) => (
  <div className={`rounded-2xl p-5 shadow-sm border ${accent
    ? 'border-transparent bg-gradient-to-br from-[#1E4FA3] via-[#2C6ED5] to-[#1FA3A8] text-white'
    : 'bg-white border-[#E3EAF2]'}`}>
    <div className="flex items-center justify-between mb-3">
      <div className={`p-2 rounded-xl ${accent ? 'bg-white/20 text-white' : (TONE_ICON[tone] || TONE_ICON.blue)}`}>
        <Icon size={18} />
      </div>
      {delta && (
        <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
          up ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>
          {up ? <HiTrendingUp size={11} /> : <HiTrendingDown size={11} />}
          {delta}
        </span>
      )}
    </div>
    <div className={`text-xs font-semibold uppercase tracking-wider mb-1 ${accent ? 'text-white/70' : 'text-[#6B7C93]'}`}>
      {label}
    </div>
    <div className={`text-2xl font-bold leading-none ${accent ? 'text-white' : 'text-[#1A1A1A]'}`}>{value}</div>
    {foot && <div className={`text-xs mt-1 ${accent ? 'text-white/60' : 'text-[#6B7C93]'}`}>{foot}</div>}
  </div>
);
