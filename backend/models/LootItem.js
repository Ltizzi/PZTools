const mongoose = require('mongoose');

const LootItemSchema = new mongoose.Schema({
  base_id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  skill: { type: String },
  is_skill_related: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('LootItem', LootItemSchema);
