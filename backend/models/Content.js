import mongoose from 'mongoose';


const contentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  file: { type: String, required: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true },
  levelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Level', required: true },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
  status: { type: String, enum: ['approved', 'pending', 'rejected', 'bloqué'], default: 'approved' },
  consultations: { type: Number, default: 0 },
}, { timestamps: true });
;

export default mongoose.model('Content', contentSchema);


