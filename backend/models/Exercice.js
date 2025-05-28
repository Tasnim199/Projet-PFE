// models/Exercise.js
import mongoose from 'mongoose';
const { Schema } = mongoose;
const questionSchema = new Schema({
  questionText: { type: String, required: true },
  correctAnswer: { type: String, required: true },
  incorrectAnswers: [{ type: String, required: true }]
});

const ExerciceSchema = new Schema({
  title: { type: String, required: true },
  level: { type: Schema.Types.ObjectId, ref: 'Level', required: true },
  module: { type: Schema.Types.ObjectId, ref: 'Module', required: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  teacher: { type: Schema.Types.ObjectId, ref: 'Teacher' } ,
  consultations: { type: Number, default: 0 },
  questions: [questionSchema],
  
}, { timestamps: true });
const Exercice = mongoose.model('Exercice', ExerciceSchema);
export default Exercice;
