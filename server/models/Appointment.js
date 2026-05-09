const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  tokenId:    { type: String, unique: true },
  patient:    { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctor:     { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor',  required: true },
  clinic:     { type: mongoose.Schema.Types.ObjectId, ref: 'Clinic' },
  date:       { type: Date, required: true },
  slot:       { type: String },
  status:     { type: String, enum: ['waiting','in-room','completed','cancelled','priority'], default: 'waiting' },
  priority:   { type: String, enum: ['normal','emergency'], default: 'normal' },
  reason:     { type: String },
  notes:      { type: String },
  fee:        { type: Number },
  paid:       { type: Boolean, default: false },
  waitTime:   { type: String },
  position:   { type: Number },
}, { timestamps: true });

appointmentSchema.pre('save', async function () {
  if (this.isNew && !this.tokenId) {
    const count = await mongoose.model('Appointment').countDocuments({ date: { $gte: new Date().setHours(0,0,0,0) } });
    const prefix = this.priority === 'emergency' ? 'E' : 'A';
    this.tokenId = `${prefix}-${String(count + 1).padStart(3, '0')}`;
  }
});

module.exports = mongoose.model('Appointment', appointmentSchema);
