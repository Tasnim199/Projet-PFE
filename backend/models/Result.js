import mongoose from 'mongoose';

const questionResultSchema = new mongoose.Schema({
  questionText:  { type: String, required: true },
  options:       { type: [String], required: true },
  correctAnswer: { type: String, required: true },
  clickedAnswer: { type: String, required: true }
});

const resultSchema = new mongoose.Schema({
  studentId:      { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  correctAnswers: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  remainingTime:  { type: Number, required: true },
  questions:      { type: [questionResultSchema], required: true },
  date:           { type: Date, default: Date.now }
});

export default mongoose.model('Result', resultSchema);
