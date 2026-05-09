import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { Login } from '../pages/auth/Login';
import { Dashboard } from '../pages/Dashboard';
import { Appointments } from '../pages/Appointments';
import { Doctors } from '../pages/Doctors';
import { Patients } from '../pages/Patients';
import { SupportTickets } from '../pages/SupportTickets';
import { Settings } from '../pages/Settings';
import { Clinics } from '../pages/Clinics';
import { Nurses } from '../pages/Nurses';
import { FrontDesk } from '../pages/FrontDesk';
import { AdminUsers } from '../pages/AdminUsers';
import { Billing } from '../pages/Billing';
import { Pharmacy } from '../pages/Pharmacy';
import { Lab } from '../pages/Lab';
import { Reports } from '../pages/Reports';
import { LiveTokens } from '../pages/LiveTokens';
import { BookAppointment } from '../pages/BookAppointment';
import { MasterData } from '../pages/MasterData';

export const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route element={<Layout />}>
      <Route path="/"              element={<Dashboard />} />
      <Route path="/appointments"  element={<Appointments />} />
      <Route path="/doctors"       element={<Doctors />} />
      <Route path="/patients"      element={<Patients />} />
      <Route path="/tickets"       element={<SupportTickets />} />
      <Route path="/settings"      element={<Settings />} />
      <Route path="/clinics"       element={<Clinics />} />
      <Route path="/nurses"        element={<Nurses />} />
      <Route path="/frontdesk"     element={<FrontDesk />} />
      <Route path="/users"         element={<AdminUsers />} />
      <Route path="/billing"       element={<Billing />} />
      <Route path="/pharmacy"      element={<Pharmacy />} />
      <Route path="/lab"           element={<Lab />} />
      <Route path="/reports"       element={<Reports />} />
      <Route path="/tokens"        element={<LiveTokens />} />
      <Route path="/book"          element={<BookAppointment />} />
      <Route path="/master-data"   element={<MasterData />} />
      <Route path="*"              element={<Navigate to="/" replace />} />
    </Route>
  </Routes>
);
