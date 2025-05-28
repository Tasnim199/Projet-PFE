import express from 'express';
import { generateEvaluation } from '../controllers/evaluationController.js';

const router = express.Router();

// POST /evaluations/generate
router.post('/generate', generateEvaluation);

export default router;