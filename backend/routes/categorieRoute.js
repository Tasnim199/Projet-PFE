// routes/categoryRoutes.js
import express from 'express';
import {
  addCategory,
  getCategoriesByLevel, updateCategory, deleteCategory
} from '../controllers/CategorieController.js';
import levelRoutes from './levelRoute.js'; 

const router = express.Router();

// ➕ Ajouter une catégorie
router.post('/', addCategory);

// 🔍 Récupérer toutes les catégories
router.get('/', getCategoriesByLevel);

router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);
router.get('/par-niveau/:levelId', getCategoriesByLevel);
export default router;
