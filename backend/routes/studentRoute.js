import express from 'express';
import { registerStudent, loginStudent, getStudentProfile} from '../controllers/studentController.js';
import studentAuth from '../middleware/studentAuth.js';
import { getStudentDocuments } from '../controllers/studentController.js';

const router = express.Router();

router.post('/register', registerStudent);
router.post('/login', loginStudent);
router.get('/profile', studentAuth, getStudentProfile);
router.get('/documents', studentAuth, getStudentDocuments);

export default router;
