const Appointment = require('../models/Appointment');

exports.getAppointments = async (req, res) => {
  const { status, q, date, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (status && status !== 'All') {
    if (status === 'Emergency') filter.priority = 'emergency';
    else filter.status = status.toLowerCase().replace(' ', '-');
  }
  if (date) {
    const d = new Date(date);
    filter.date = { $gte: new Date(d.setHours(0,0,0,0)), $lt: new Date(d.setHours(23,59,59,999)) };
  }
  const [appointments, total] = await Promise.all([
    Appointment.find(filter)
      .populate('patient', 'firstName lastName patientId age gender phone')
      .populate('doctor', 'name speciality department')
      .sort('-date')
      .skip((page - 1) * limit)
      .limit(Number(limit)),
    Appointment.countDocuments(filter),
  ]);
  res.json({ success: true, data: appointments, total });
};

exports.getAppointment = async (req, res) => {
  const appt = await Appointment.findById(req.params.id)
    .populate('patient').populate('doctor').populate('clinic');
  if (!appt) return res.status(404).json({ success: false, message: 'Appointment not found' });
  res.json({ success: true, data: appt });
};

exports.createAppointment = async (req, res) => {
  try {
    const appt = await Appointment.create(req.body);
    const populated = await appt.populate(['patient', 'doctor']);
    res.status(201).json({ success: true, data: populated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.updateAppointment = async (req, res) => {
  const appt = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .populate('patient').populate('doctor');
  if (!appt) return res.status(404).json({ success: false, message: 'Appointment not found' });
  res.json({ success: true, data: appt });
};

exports.updateStatus = async (req, res) => {
  const { status } = req.body;
  const appt = await Appointment.findByIdAndUpdate(req.params.id, { status }, { new: true })
    .populate('patient').populate('doctor');
  if (!appt) return res.status(404).json({ success: false, message: 'Appointment not found' });
  res.json({ success: true, data: appt });
};

exports.getDashboardStats = async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todayFilter = { date: { $gte: today, $lt: tomorrow } };

  const [todayTotal, waiting, inRoom, completed, cancelled] = await Promise.all([
    Appointment.countDocuments(todayFilter),
    Appointment.countDocuments({ ...todayFilter, status: 'waiting' }),
    Appointment.countDocuments({ ...todayFilter, status: 'in-room' }),
    Appointment.countDocuments({ ...todayFilter, status: 'completed' }),
    Appointment.countDocuments({ ...todayFilter, status: 'cancelled' }),
  ]);

  res.json({ success: true, data: { todayTotal, waiting, inRoom, completed, cancelled } });
};
