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
import { Placeholder } from '../pages/Placeholder';

export const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route element={<Layout />}>
      <Route path="/"            element={<Dashboard />} />
      <Route path="/appointments" element={<Appointments />} />
      <Route path="/doctors"      element={<Doctors />} />
      <Route path="/patients"     element={<Patients />} />
      <Route path="/tickets"      element={<SupportTickets />} />
      <Route path="/settings"     element={<Settings />} />
      <Route path="/clinics"      element={<Placeholder title="Clinic management"    crumbs="8 clinics · 6 active"      addLabel="Add clinic" />} />
      <Route path="/nurses"       element={<Placeholder title="Nurse management"     crumbs="9 nurses · 7 active"       addLabel="Add nurse" />} />
      <Route path="/frontdesk"    element={<Placeholder title="Front desk management" crumbs="7 users · 5 active"        addLabel="Add user" />} />
      <Route path="/users"        element={<Placeholder title="Admin user management" crumbs="10 admins · 8 active"      addLabel="Add admin" />} />
      <Route path="/billing"      element={<Placeholder title="Billing"               crumbs="Today's consultation bills" />} />
      <Route path="/pharmacy"     element={<Placeholder title="Pharmacy"              crumbs="Dispense medicines"        />} />
      <Route path="/lab"          element={<Placeholder title="Lab"                   crumbs="Lab orders & results"      />} />
      <Route path="/reports"      element={<Placeholder title="Reports & Analytics"   crumbs="Revenue, tokens, trends"   />} />
      <Route path="/tokens"       element={<Placeholder title="Live Token Queue"      crumbs="Real-time queue display"   />} />
      <Route path="/book"         element={<Placeholder title="Book Appointment"      crumbs="Step-by-step booking"     />} />
      <Route path="/master-data"  element={<Placeholder title="Master Data"           crumbs="ICD codes, drug catalogue" />} />
      <Route path="*"             element={<Navigate to="/" replace />} />
    </Route>
  </Routes>
);
