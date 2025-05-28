import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ msg: 'Accès refusé, aucun token fourni' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // On suppose que c’est l’enseignant ici
    req.teacherId = decoded.id;

    next();
  } catch (err) {
    console.error("Erreur de vérification du token :", err);
    res.status(401).json({ msg: 'Token invalide' });
  }
};

export default verifyToken;
