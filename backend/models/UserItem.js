const mongoose = require('mongoose');

const UserItemSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  item_id: { type: mongoose.Schema.Types.ObjectId, ref: 'LootItem', required: true },
  collected: { type: Boolean, default: false },
  volume_number: { type: Number, default: 1 },
  created_at: { type: Date, default: Date.now }
});

UserItemSchema.index({ user_id: 1, item_id: 1 }, { unique: true });

module.exports = mongoose.model('UserItem', UserItemSchema);
