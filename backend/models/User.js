const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  is_admin: { type: Boolean, default: false },
  last_active: { type: Date, default: Date.now },
  created_at: { type: Date, default: Date.now }
});

UserSchema.index({ last_active: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

module.exports = mongoose.model('User', UserSchema);
