// controllers/evaluationController.js
import Exercice from '../models/Exercice.js';
import mongoose from 'mongoose';

export async function generateEvaluation(req, res) {
  const { moduleIds, questionCount } = req.body;

  try {
    const questions = await Exercice.aggregate([
      { 
        $match: { 
          module: { 
            $in: moduleIds.map(id => new mongoose.Types.ObjectId(id)) 
          }
        }
      },
      { $unwind: '$questions' },
      { $replaceRoot: { newRoot: '$questions' } },
      { $sample: { size: questionCount } }
    ]);

    return res.json(questions);
  } catch (err) {
    console.error('Erreur génération questions :', err);
    return res.status(500).json({ message: 'Erreur lors de la génération des questions.' });
  }
}
