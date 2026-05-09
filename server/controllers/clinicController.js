const Clinic = require('../models/Clinic');

exports.getClinics = async (req, res) => {
  try {
    const { q, status } = req.query;
    const filter = {};
    if (status && status !== 'All') filter.status = status;
    if (q) filter.$or = [{ name: new RegExp(q, 'i') }, { clinicId: new RegExp(q, 'i') }];
    const clinics = await Clinic.find(filter).sort('-createdAt');
    res.json({ success: true, data: clinics });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.createClinic = async (req, res) => {
  try {
    const clinic = await Clinic.create(req.body);
    res.status(201).json({ success: true, data: clinic });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
};

exports.updateClinic = async (req, res) => {
  try {
    const clinic = await Clinic.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!clinic) return res.status(404).json({ success: false, message: 'Clinic not found' });
    res.json({ success: true, data: clinic });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
};

exports.deleteClinic = async (req, res) => {
  try {
    await Clinic.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Clinic deleted' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
