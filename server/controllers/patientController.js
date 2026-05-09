const Patient = require('../models/Patient');

exports.getPatients = async (req, res) => {
  const { q, tag, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (tag && tag !== 'All') filter.tag = tag;
  if (q) {
    filter.$or = [
      { firstName: new RegExp(q, 'i') },
      { lastName:  new RegExp(q, 'i') },
      { patientId: new RegExp(q, 'i') },
      { phone:     new RegExp(q, 'i') },
    ];
  }
  const [patients, total] = await Promise.all([
    Patient.find(filter).skip((page - 1) * limit).limit(Number(limit)).sort('-createdAt'),
    Patient.countDocuments(filter),
  ]);
  res.json({ success: true, data: patients, total, page: Number(page), pages: Math.ceil(total / limit) });
};

exports.getPatient = async (req, res) => {
  const patient = await Patient.findById(req.params.id);
  if (!patient) return res.status(404).json({ success: false, message: 'Patient not found' });
  res.json({ success: true, data: patient });
};

exports.createPatient = async (req, res) => {
  try {
    const patient = await Patient.create(req.body);
    res.status(201).json({ success: true, data: patient });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.updatePatient = async (req, res) => {
  const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!patient) return res.status(404).json({ success: false, message: 'Patient not found' });
  res.json({ success: true, data: patient });
};

exports.deletePatient = async (req, res) => {
  await Patient.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Patient deleted' });
};

exports.getStats = async (req, res) => {
  const [total, active, followUp, critical, newCount] = await Promise.all([
    Patient.countDocuments(),
    Patient.countDocuments({ tag: 'active' }),
    Patient.countDocuments({ tag: 'follow-up' }),
    Patient.countDocuments({ tag: 'critical' }),
    Patient.countDocuments({ tag: 'new' }),
  ]);
  res.json({ success: true, data: { total, active, followUp, critical, new: newCount } });
};
