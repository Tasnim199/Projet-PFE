// models/Category.js
import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  level: { type: mongoose.Schema.Types.ObjectId, ref: 'Level', required: true }
});

export default mongoose.model('Category', categorySchema,'categories');
