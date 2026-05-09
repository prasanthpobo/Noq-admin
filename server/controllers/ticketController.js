const Ticket = require('../models/Ticket');

exports.getTickets = async (req, res) => {
  const { status, priority, category, q, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (status && status !== 'All') filter.status = status;
  if (priority && priority !== 'All') filter.priority = priority;
  if (category && category !== 'All') filter.category = category;
  if (q) filter.$or = [
    { title:    new RegExp(q, 'i') },
    { ticketId: new RegExp(q, 'i') },
  ];
  const [tickets, total] = await Promise.all([
    Ticket.find(filter)
      .populate('createdBy', 'name email role')
      .populate('assignedTo', 'name email role')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(Number(limit)),
    Ticket.countDocuments(filter),
  ]);
  res.json({ success: true, data: tickets, total });
};

exports.getTicket = async (req, res) => {
  const ticket = await Ticket.findById(req.params.id)
    .populate('createdBy', 'name email role')
    .populate('assignedTo', 'name email role')
    .populate('messages.sender', 'name role');
  if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });
  res.json({ success: true, data: ticket });
};

exports.createTicket = async (req, res) => {
  try {
    const ticket = await Ticket.create({ ...req.body, createdBy: req.user._id });
    const populated = await ticket.populate(['createdBy', 'assignedTo']);
    res.status(201).json({ success: true, data: populated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.updateTicket = async (req, res) => {
  const ticket = await Ticket.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .populate('createdBy', 'name email role')
    .populate('assignedTo', 'name email role');
  if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });
  res.json({ success: true, data: ticket });
};

exports.addMessage = async (req, res) => {
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });
  ticket.messages.push({ sender: req.user._id, text: req.body.text });
  ticket.unread = true;
  await ticket.save();
  res.json({ success: true, data: ticket });
};

exports.updateStatus = async (req, res) => {
  const ticket = await Ticket.findByIdAndUpdate(
    req.params.id, { status: req.body.status }, { new: true }
  ).populate('createdBy assignedTo');
  res.json({ success: true, data: ticket });
};
