import mongoose from 'mongoose';

const TeacherSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
   grade: { type: String, required: true },
  schoolName: { type: String, required: true }, // Nom de l'école
  city: { type: String, required: true },
    status: { type: String, enum: ['pending', 'approved'], default: 'pending' },
}, { timestamps: true });

export default mongoose.model('Teacher', TeacherSchema);
