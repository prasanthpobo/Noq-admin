const Doctor = require('../models/Doctor');

exports.getDoctors = async (req, res) => {
  const { q, status, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (status && status !== 'All') filter.status = status;
  if (q) filter.$or = [
    { name:      new RegExp(q, 'i') },
    { speciality:new RegExp(q, 'i') },
    { department:new RegExp(q, 'i') },
  ];
  const [doctors, total] = await Promise.all([
    Doctor.find(filter).populate('clinic', 'name').skip((page - 1) * limit).limit(Number(limit)),
    Doctor.countDocuments(filter),
  ]);
  res.json({ success: true, data: doctors, total });
};

exports.getDoctor = async (req, res) => {
  const doctor = await Doctor.findById(req.params.id).populate('clinic');
  if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });
  res.json({ success: true, data: doctor });
};

exports.createDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.create(req.body);
    res.status(201).json({ success: true, data: doctor });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.updateDoctor = async (req, res) => {
  const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });
  res.json({ success: true, data: doctor });
};

exports.deleteDoctor = async (req, res) => {
  await Doctor.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Doctor deleted' });
};
