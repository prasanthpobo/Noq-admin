const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  text:    { type: String, required: true },
  sentAt:  { type: Date, default: Date.now },
});

const ticketSchema = new mongoose.Schema({
  ticketId:    { type: String, unique: true },
  title:       { type: String, required: true },
  description: { type: String, required: true },
  category:    { type: String, enum: ['Technical','Billing','Appointment','Other'], default: 'Technical' },
  priority:    { type: String, enum: ['Low','Medium','High'], default: 'Medium' },
  status:      { type: String, enum: ['open','in_progress','resolved','closed'], default: 'open' },
  createdBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignedTo:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  messages:    [messageSchema],
  unread:      { type: Boolean, default: true },
  clinic:      { type: mongoose.Schema.Types.ObjectId, ref: 'Clinic' },
}, { timestamps: true });

ticketSchema.pre('save', async function () {
  if (this.isNew && !this.ticketId) {
    const count = await mongoose.model('Ticket').countDocuments();
    this.ticketId = `TKT-${1000 + count + 1}`;
  }
});

module.exports = mongoose.model('Ticket', ticketSchema);
