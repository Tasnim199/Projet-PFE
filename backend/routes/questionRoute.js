import express from 'express';
import Question from '../models/Question.js';

const router = express.Router();

// Ajouter une nouvelle question
router.post('/', async (req, res) => {
  console.log('Données reçues:', req.body);
  try {
    const { questionText, correctAnswer, incorrectAnswers, level, module, category } = req.body;

    // Vérifier les références
    const validation = await checkReferences(level, module, category);
    if (!validation.success) {
      return res.status(400).json({ message: validation.message });
    }

    // Créer une nouvelle question
    const question = new Question({
      questionText,
      correctAnswer,
      incorrectAnswers,
      level,
      module,
      category
    });

    const savedQuestion = await question.save();
    res.status(201).json({ message: 'Question ajoutée avec succès', question: savedQuestion });
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la question:', error);
    res.status(500).json({ message: 'Erreur serveur, impossible d\'ajouter la question.' });
  }
});


export default router;
