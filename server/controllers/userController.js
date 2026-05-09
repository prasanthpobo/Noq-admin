const User = require('../models/User');

exports.getUsers = async (req, res) => {
  try {
    const { role, q, page = 1, limit = 50 } = req.query;
    const filter = {};
    if (role && role !== 'All') filter.role = role;
    if (q) filter.$or = [{ name: new RegExp(q, 'i') }, { email: new RegExp(q, 'i') }];
    const [users, total] = await Promise.all([
      User.find(filter).populate('clinic', 'name').skip((page - 1) * Number(limit)).limit(Number(limit)).sort('-createdAt'),
      User.countDocuments(filter),
    ]);
    res.json({ success: true, data: users, total });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({ success: true, data: user });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
};

exports.updateUser = async (req, res) => {
  try {
    const { password, ...rest } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, rest, { new: true, runValidators: true });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
