import express from 'express';
import { loginAdmin, getTeachers, updateTeacherStatus } from '../controllers/adminController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Route pour l'authentification de l'admin
router.post('/login', loginAdmin);

// Routes protégées par authMiddleware
router.get('/teachers', authMiddleware, getTeachers);
router.put('/teachers/:id/status', authMiddleware, updateTeacherStatus);

export default router;
