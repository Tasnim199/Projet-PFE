import Result from '../models/Result.js';

// Enregistrer un nouveau résultat (et questions associées)
export const storeResult = async (req, res) => {
  try {
    const { correctAnswers, totalQuestions, remainingTime, questions } = req.body;

    // Validation basique
    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ msg: 'Aucune question fournie pour le résultat.' });
    }

    const newResult = new Result({
      studentId: req.student._id,  // Injecté par studentAuth
      correctAnswers,
      totalQuestions,
      remainingTime,
      questions,
      date: new Date()
    });

    const saved = await newResult.save();
    return res.status(201).json(saved);
  } catch (error) {
    console.error("Erreur lors de l'enregistrement du résultat:", error);
    return res.status(500).json({ error: "Erreur serveur" });
  }
};

// Récupérer tous les résultats d'un étudiant
export const getStudentResults = async (req, res) => {
  try {
    const studentId = req.student._id;
    const results = await Result.find({ studentId }).sort({ date: -1 });
    return res.status(200).json(results);
  } catch (error) {
    console.error('Erreur lors de la récupération des résultats:', error);
    return res.status(500).json({ msg: 'Erreur lors de la récupération des résultats' });
  }
};
