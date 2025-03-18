

import jwt from 'jsonwebtoken'; // Importation du module jsonwebtoken pour gérer les tokens 

// Middleware d'authentification
const authMiddleware = (req, res, next) => {
    // Récupérer le token dans l'en-tête Authorization
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log('Token reçu :', token);
    // Vérifier si le token est absent
    if (!token) {
        return res.status(401).json({ msg: 'Accès refusé, aucun token fourni' });
    }

    try {
        // Vérifier et décoder le token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.admin = decoded.adminId; // Récupérer l'ID de l'admin depuis le token
        next(); // Passer à la prochaine étape (route protégée)
    } catch (err) {
        return res.status(401).json({ msg: 'Token invalide' });
    }
};

export default authMiddleware;
