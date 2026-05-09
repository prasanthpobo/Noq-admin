import React from 'react';
import { avatarInitials, toneClass } from '../../utils/helpers';

interface AvatarProps {
  name: string;
  tone?: string;
  size?: 'sm' | 'md' | 'lg';
}

const SIZES = { sm: 'w-7 h-7 text-xs', md: 'w-9 h-9 text-sm', lg: 'w-12 h-12 text-base' };

export const Avatar = ({ name, tone = 'blue', size = 'md' }: AvatarProps) => (
  <div className={`${SIZES[size]} rounded-xl flex items-center justify-center font-bold flex-shrink-0 ${toneClass(tone)}`}>
    {avatarInitials(name)}
  </div>
);
