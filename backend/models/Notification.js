// models/Notification.js
import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
  text:      { type: String, required: true },
  target:    { type: String, enum: ['admin','teacher','student'], required: true },
  read:      { type: Boolean, default: false },
  sender: {                         // ← facultatif, default null
    type: mongoose.Schema.Types.ObjectId,
    ref: 'teacher',
    required: false,
    default: null,
  },
  level:   { type: mongoose.Schema.Types.ObjectId, ref: 'Level',   default: null }, 
}, {
  timestamps: true
});

export default mongoose.model('Notification', NotificationSchema);
