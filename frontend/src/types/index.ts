export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'clinic_admin' | 'doctor' | 'nurse' | 'front_desk' | 'billing';
  phone?: string;
  clinic?: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
}

export interface Patient {
  _id: string;
  patientId: string;
  firstName: string;
  lastName: string;
  gender: 'M' | 'F' | 'Other';
  dob?: string;
  age: number;
  bloodGroup?: string;
  phone: string;
  email?: string;
  address?: { line1?: string; city?: string; state?: string; pincode?: string };
  tag: 'active' | 'follow-up' | 'critical' | 'new';
  allergies?: string[];
  conditions?: string[];
  medications?: string;
  visits: number;
  lastVisit?: string;
  createdAt: string;
}

export interface Doctor {
  _id: string;
  name: string;
  speciality: string;
  department?: string;
  experience?: string;
  qualification?: string;
  room?: string;
  fee: number;
  phone?: string;
  email?: string;
  rating: number;
  status: 'on' | 'busy' | 'leave' | 'inactive';
  todayTokens?: number;
  weekTokens?: number;
  clinic?: { _id: string; name: string };
}

export interface Appointment {
  _id: string;
  tokenId: string;
  patient: Patient;
  doctor: Doctor;
  date: string;
  slot?: string;
  status: 'waiting' | 'in-room' | 'completed' | 'cancelled' | 'priority';
  priority: 'normal' | 'emergency';
  reason?: string;
  notes?: string;
  fee?: number;
  paid: boolean;
  waitTime?: string;
  position?: number;
  createdAt: string;
}

export interface Ticket {
  _id: string;
  ticketId: string;
  title: string;
  description: string;
  category: 'Technical' | 'Billing' | 'Appointment' | 'Other';
  priority: 'Low' | 'Medium' | 'High';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  createdBy: { _id: string; name: string; email: string; role: string };
  assignedTo?: { _id: string; name: string; email: string; role: string };
  messages: { sender: { _id: string; name: string }; text: string; sentAt: string }[];
  unread: boolean;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  total?: number;
  pages?: number;
}

export interface DashboardStats {
  todayTotal: number;
  waiting: number;
  inRoom: number;
  completed: number;
  cancelled: number;
}
