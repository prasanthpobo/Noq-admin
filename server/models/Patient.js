const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  patientId:   { type: String, unique: true },
  firstName:   { type: String, required: true },
  lastName:    { type: String, required: true },
  gender:      { type: String, enum: ['M', 'F', 'Other'] },
  dob:         { type: Date },
  age:         { type: Number },
  bloodGroup:  { type: String },
  phone:       { type: String, required: true },
  email:       { type: String },
  address: {
    line1:   String,
    city:    String,
    state:   String,
    pincode: String,
  },
  tag:          { type: String, enum: ['active','follow-up','critical','new'], default: 'new' },
  allergies:    [String],
  conditions:   [String],
  medications:  String,
  insurance: {
    insurer:      String,
    policyNumber: String,
    validTill:    Date,
  },
  emergency: {
    name:     String,
    relation: String,
    phone:    String,
  },
  visits:     { type: Number, default: 0 },
  lastVisit:  { type: Date },
  clinic:     { type: mongoose.Schema.Types.ObjectId, ref: 'Clinic' },
}, { timestamps: true });

patientSchema.pre('save', async function () {
  if (this.isNew && !this.patientId) {
    const count = await mongoose.model('Patient').countDocuments();
    this.patientId = `P-${(1000 + count + 1).toString()}`;
  }
});

module.exports = mongoose.model('Patient', patientSchema);
