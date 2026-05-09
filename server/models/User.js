const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name:      { type: String, required: true, trim: true },
  email:     { type: String, required: true, unique: true, lowercase: true },
  password:  { type: String, required: true, minlength: 6 },
  role:      { type: String, enum: ['super_admin','clinic_admin','doctor','nurse','front_desk','billing'], default: 'front_desk' },
  clinic:    { type: mongoose.Schema.Types.ObjectId, ref: 'Clinic' },
  avatar:    { type: String },
  phone:     { type: String },
  isActive:  { type: Boolean, default: true },
  twoFactor: { type: Boolean, default: false },
  lastLogin: { type: Date },
}, { timestamps: true });

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.matchPassword = async function (entered) {
  return bcrypt.compare(entered, this.password);
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
