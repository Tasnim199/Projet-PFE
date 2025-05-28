import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  // Vérifie si le token est présent
  if (!token) return res.status(401).json({ msg: 'Accès refusé, aucun token fourni' });

  try {
    // Vérifie si le token est valide et récupère l'ID de l'admin
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    
    // Ajoute l'ID de l'admin à la requête pour l'utiliser plus tard
    req.adminId = decoded.id;
   
    // Si le token est valide, on passe à la suite
    next();
  } catch (err) {
    console.error("Erreur d'authentification :", err);
    return res.status(401).json({ msg: 'Token invalide' });
  }
};

export default authMiddleware;
