require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const Clinic = require('../models/Clinic');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected — seeding...');

  await Promise.all([User.deleteMany(), Doctor.deleteMany(), Patient.deleteMany(), Clinic.deleteMany()]);

  const clinic = await Clinic.create({
    name: 'Sunshine Clinic', type: 'Multi-specialty',
    address: { area: 'Koramangala 6th', city: 'Bengaluru', state: 'Karnataka', pincode: '560095' },
    phone: '+91 80 4567 1100', email: 'hello@sunshine.health',
    status: 'active', rating: 4.7, established: '2014',
  });

  const admin = await User.create({
    name: 'Reena Aggarwal', email: 'admin@noq.health', password: 'admin123',
    role: 'super_admin', clinic: clinic._id, phone: '+91 98765 00001',
  });

  await Doctor.create([
    { name: 'Dr. Ananya Rao',   speciality: 'General medicine', department: 'OPD',     room: 'Room 1', status: 'on',    fee: 400, experience: '12 yrs', rating: 4.8, clinic: clinic._id, email: 'ananya.rao@noq.health',   phone: '+91 98765 43210' },
    { name: 'Dr. Vikram Mehta', speciality: 'Cardiology',       department: 'Cardio',  room: 'Room 4', status: 'busy',  fee: 800, experience: '18 yrs', rating: 4.9, clinic: clinic._id, email: 'vikram.mehta@noq.health', phone: '+91 98765 43211' },
    { name: 'Dr. Priya Iyer',   speciality: 'Dermatology',      department: 'Derm',    room: 'Room 2', status: 'on',    fee: 600, experience: '8 yrs',  rating: 4.7, clinic: clinic._id, email: 'priya.iyer@noq.health',   phone: '+91 98765 43212' },
    { name: 'Dr. Rahul Khanna', speciality: 'Pediatrics',       department: 'Peds',    room: 'Room 3', status: 'leave', fee: 500, experience: '14 yrs', rating: 4.8, clinic: clinic._id, email: 'rahul.khanna@noq.health', phone: '+91 98765 43213' },
    { name: 'Dr. Neha Sharma',  speciality: 'Gynecology',       department: 'Gyn',     room: 'Room 5', status: 'on',    fee: 700, experience: '10 yrs', rating: 4.9, clinic: clinic._id, email: 'neha.sharma@noq.health',  phone: '+91 98765 43214' },
    { name: 'Dr. Arjun Desai',  speciality: 'Orthopedics',      department: 'Ortho',   room: 'Room 6', status: 'on',    fee: 750, experience: '16 yrs', rating: 4.6, clinic: clinic._id, email: 'arjun.desai@noq.health',  phone: '+91 98765 43215' },
  ]);

  for (const p of [
    { firstName: 'Aarav',  lastName: 'Sharma',       gender: 'M', age: 34, bloodGroup: 'O+',  phone: '+91 98765 11001', email: 'aarav.s@email.com',   tag: 'active',   visits: 4,  clinic: clinic._id },
    { firstName: 'Meera',  lastName: 'Iyer',         gender: 'F', age: 28, bloodGroup: 'A+',  phone: '+91 98765 11002', email: 'meera.i@email.com',   tag: 'active',   visits: 2,  clinic: clinic._id },
    { firstName: 'Suresh', lastName: 'Patel',        gender: 'M', age: 52, bloodGroup: 'B+',  phone: '+91 98765 11003', email: 'suresh.p@email.com',  tag: 'critical', visits: 9,  clinic: clinic._id },
    { firstName: 'Riya',   lastName: 'Kapoor',       gender: 'F', age: 6,  bloodGroup: 'O-',  phone: '+91 98765 11004', email: 'guardian@email.com',  tag: 'new',      visits: 1,  clinic: clinic._id },
    { firstName: 'Karthik',lastName: 'Nair',         gender: 'M', age: 45, bloodGroup: 'AB+', phone: '+91 98765 11005', email: 'karthik.n@email.com', tag: 'active',   visits: 6,  clinic: clinic._id },
    { firstName: 'Rohan',  lastName: 'Singh',        gender: 'M', age: 40, bloodGroup: 'B+',  phone: '+91 98765 11008', email: 'rohan.s@email.com',   tag: 'follow-up',visits: 8,  clinic: clinic._id },
    { firstName: 'Tanvi',  lastName: 'Joshi',        gender: 'F', age: 36, bloodGroup: 'A+',  phone: '+91 98765 11009', email: 'tanvi.j@email.com',   tag: 'active',   visits: 5,  clinic: clinic._id },
    { firstName: 'Devansh',lastName: 'Gupta',        gender: 'M', age: 58, bloodGroup: 'O+',  phone: '+91 98765 11010', email: 'devansh.g@email.com', tag: 'follow-up',visits: 12, clinic: clinic._id },
  ]) { await Patient.create(p); }

  console.log(`Seeded. Admin login: admin@noq.health / admin123`);
  await mongoose.disconnect();
};

seed().catch(console.error);
