import React from 'react';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'muted' | 'brand';

const STYLES: Record<BadgeVariant, string> = {
  success: 'bg-emerald-100 text-emerald-700',
  warning: 'bg-amber-100   text-amber-700',
  danger:  'bg-red-100     text-red-700',
  info:    'bg-blue-100    text-blue-700',
  muted:   'bg-gray-100    text-gray-500',
  brand:   'bg-blue-100    text-blue-800',
};

const DOT: Record<BadgeVariant, string> = {
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger:  'bg-red-500',
  info:    'bg-blue-500',
  muted:   'bg-gray-400',
  brand:   'bg-blue-600',
};

interface BadgeProps {
  variant?: BadgeVariant;
  dot?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const Badge = ({ variant = 'muted', dot = false, children, className = '' }: BadgeProps) => (
  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${STYLES[variant]} ${className}`}>
    {dot && <span className={`w-1.5 h-1.5 rounded-full ${DOT[variant]}`} />}
    {children}
  </span>
);

export const statusBadge = (status: string, emergency?: boolean) => {
  if (emergency) return <Badge variant="danger" dot>Priority</Badge>;
  if (status === 'in-room')   return <Badge variant="success" dot>In room</Badge>;
  if (status === 'waiting')   return <Badge variant="warning" dot>Waiting</Badge>;
  if (status === 'completed') return <Badge variant="brand"   dot>Completed</Badge>;
  if (status === 'cancelled') return <Badge variant="muted"   dot>Cancelled</Badge>;
  if (status === 'priority')  return <Badge variant="danger"  dot>Priority</Badge>;
  if (status === 'on')        return <Badge variant="success" dot>On duty</Badge>;
  if (status === 'busy')      return <Badge variant="warning" dot>In room</Badge>;
  if (status === 'leave')     return <Badge variant="muted"   dot>On leave</Badge>;
  if (status === 'active')    return <Badge variant="success" dot>Active</Badge>;
  if (status === 'inactive')  return <Badge variant="info"    dot>Inactive</Badge>;
  if (status === 'on-leave')  return <Badge variant="warning" dot>On leave</Badge>;
  if (status === 'open')         return <Badge variant="info"    dot>Open</Badge>;
  if (status === 'in_progress')  return <Badge variant="warning" dot>In Progress</Badge>;
  if (status === 'resolved')     return <Badge variant="success" dot>Resolved</Badge>;
  if (status === 'closed')       return <Badge variant="muted"   dot>Closed</Badge>;
  return <Badge variant="muted">{status}</Badge>;
};

export const tagBadge = (tag: string) => {
  if (tag === 'critical')  return <Badge variant="danger"  dot>Critical</Badge>;
  if (tag === 'follow-up') return <Badge variant="warning" dot>Follow-up</Badge>;
  if (tag === 'new')       return <Badge variant="info"    dot>New</Badge>;
  return <Badge variant="success" dot>Active</Badge>;
};
