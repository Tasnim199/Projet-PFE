import express from 'express';
import { createExercice, getAllExercices } from '../controllers/exerciceController.js';
import Exercice from '../models/Exercice.js'; 
import verifyToken from '../middleware/verifyToken.js';


const router = express.Router();

// ➕ Créer un exercice
router.post('/', createExercice);

// 📥 Obtenir tous les exercices (avec populate)
router.get('/', getAllExercices);

// 👤 Obtenir les exercices d’un enseignant spécifique (route personnalisée)
router.get('/mes-exercices/:teacherId', async (req, res) => {
  try {
    const { teacherId } = req.params;
    const exercises = await Exercice.find({ teacher: teacherId })
      .populate('level')
      .populate('module')
      .populate('category')
      .populate({ path: 'teacher', select: 'name prenom' });

    res.json(exercises);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des exercices', error });
  }
});

// ✏️ Modifier un exercice
router.put('/:id', async (req, res) => {
  try {
    const updatedExercise = await Exercice.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedExercise);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de l’exercice', error });
  }
});

// ❌ Supprimer un exercice
router.delete('/:id', async (req, res) => {
  try {
    await Exercice.findByIdAndDelete(req.params.id);
    res.json({ message: 'Exercice supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression de l’exercice', error });
  }
});
// Nouvelle route pour consulter UN exercice
// Nouvelle route GET pour un exercice spécifique
// ➕ AJOUTER CETTE ROUTE MANQUANTE
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const ex = await Exercice.findById(req.params.id)
      .populate('teacher');

    if (!ex) return res.status(404).json({ message: "Exercice introuvable" });

    // Debug 3: Vérifier la structure de 'teacher'
    console.log("Teacher ID:", ex.teacher?._id?.toString());
    
    if (ex.teacher?._id?.toString() !== req.teacherId) {
      ex.consultations = (ex.consultations || 0) + 1;
      await ex.save();
      console.log("Consultation exercice incrémentée !");
    }

    res.json(ex);
  } catch (error) {
    console.error("ERREUR EXERCICE:", error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

export default router;
