export const avatarInitials = (name: string) =>
  name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();

export const avatarColor = (str: string) => {
  const colors = ['blue', 'pink', 'amber', 'mint', 'indigo', 'plum', 'rose', 'teal'];
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};

const TONE_CLASSES: Record<string, string> = {
  blue:   'bg-blue-100 text-blue-800',
  pink:   'bg-pink-100 text-pink-800',
  amber:  'bg-amber-100 text-amber-800',
  mint:   'bg-emerald-100 text-emerald-800',
  indigo: 'bg-indigo-100 text-indigo-800',
  plum:   'bg-purple-100 text-purple-800',
  rose:   'bg-rose-100 text-rose-800',
  teal:   'bg-teal-100 text-teal-800',
  green:  'bg-green-100 text-green-800',
};

export const toneClass = (tone: string) => TONE_CLASSES[tone] || TONE_CLASSES.blue;

export const formatDate = (d: string | Date) =>
  new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

export const formatTime = (d: string | Date) =>
  new Date(d).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
