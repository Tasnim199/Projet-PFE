import mongoose from 'mongoose';

const homeworkSchema = new mongoose.Schema({
  title: String,
  description: String,
  dueDate: Date,
  subject: String,
  level: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Homework = mongoose.model('Homework', homeworkSchema);
export default Homework;
