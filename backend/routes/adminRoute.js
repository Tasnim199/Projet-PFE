import express from 'express';
import { 
  loginAdmin, 
  getTeachers, 
  updateTeacherStatus, 
  getAdminDashboard, 
  getAdminProfile, 
  updateAdminProfile, 
  addModule, 
  getModules 
} from '../controllers/adminController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Route pour l'authentification de l'admin
router.post('/login', loginAdmin);

// Routes protégées par authMiddleware
router.get('/teachers', authMiddleware, getTeachers);
router.put('/teachers/:id/status', authMiddleware, updateTeacherStatus);
router.get('/dashboard', authMiddleware, getAdminDashboard);
router.post('/module', authMiddleware, addModule); // Ajouter un module
router.get('/module', authMiddleware, getModules); // Récupérer tous les modules



// Profil de l'admin
router.get('/profile', authMiddleware, getAdminProfile);
router.put('/profile', authMiddleware, updateAdminProfile);

export default router;
