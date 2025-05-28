import jwt from 'jsonwebtoken';
import Student from '../models/Student.js';

const studentAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ 
      success: false,
      error: 'Authentification requise' 
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const student = await Student.findById(decoded.id)
      .populate({
        path: 'level',
        select: '_id name'
      })
      .lean();

    if (!student) {
      return res.status(404).json({ 
        success: false,
        error: 'Étudiant non trouvé' 
      });
    }

    // Attach both student and level to request
    req.student = student;
    req.studentLevel = student.level;

    next();
  } catch (err) {
    console.error('[AUTH] Erreur étudiant:', {
      token: token?.slice(0, 10) + '...',
      error: err.message
    });
    res.status(401).json({ 
      success: false,
      error: 'Token invalide' 
    });
  }
};

export default studentAuth;