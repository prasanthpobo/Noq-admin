const mongoose = require('mongoose');

const clinicSchema = new mongoose.Schema({
  clinicId:     { type: String, unique: true },
  name:         { type: String, required: true },
  type:         { type: String, default: 'Multi-specialty' },
  address: {
    line1:    String,
    area:     String,
    city:     String,
    state:    String,
    pincode:  String,
  },
  phone:        { type: String },
  email:        { type: String },
  gstin:        { type: String },
  logo:         { type: String },
  tokenPrefix:  { type: String, default: 'A' },
  workingHours: [{ day: String, open: String, close: String, closed: Boolean }],
  specialties:  [String],
  status:       { type: String, enum: ['active','pending','inactive'], default: 'active' },
  rating:       { type: Number, default: 4.5 },
  established:  { type: String },
}, { timestamps: true });

clinicSchema.pre('save', async function () {
  if (this.isNew && !this.clinicId) {
    const count = await mongoose.model('Clinic').countDocuments();
    this.clinicId = `C-${String(count + 1).padStart(3, '0')}`;
  }
});

module.exports = mongoose.model('Clinic', clinicSchema);
