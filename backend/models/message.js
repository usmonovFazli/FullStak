
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  receiver_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  message: String,
  image_path: String,
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', messageSchema);
