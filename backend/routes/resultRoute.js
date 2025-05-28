import express from 'express';
import studentAuth from '../middleware/studentAuth.js';
import { storeResult , getStudentResults } from '../controllers/resultController.js';

const router = express.Router();

// Protéger la route pour stocker un résultat
router.post('/', studentAuth, storeResult);
router.get('/', studentAuth, getStudentResults);
export default router;
