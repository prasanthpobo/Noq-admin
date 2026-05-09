const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name:         { type: String, required: true },
  speciality:   { type: String, required: true },
  department:   { type: String },
  experience:   { type: String },
  qualification:{ type: String },
  room:         { type: String },
  fee:          { type: Number, default: 500 },
  phone:        { type: String },
  email:        { type: String },
  rating:       { type: Number, default: 4.5 },
  status:       { type: String, enum: ['on','busy','leave','inactive'], default: 'on' },
  clinic:       { type: mongoose.Schema.Types.ObjectId, ref: 'Clinic' },
  user:         { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  todayTokens:  { type: Number, default: 0 },
  weekTokens:   { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema);
