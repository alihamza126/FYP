import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  senderId: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  isRead: {
    type: Boolean,
    default: false
  },
  from:{
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  },
});

// optional: index to speed up lookups
messageSchema.index({ senderId: 1, createdAt: 1 });

export default mongoose.models.Message || mongoose.model('Message', messageSchema);
