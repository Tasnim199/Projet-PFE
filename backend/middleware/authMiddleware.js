import jwt from 'jsonwebtoken'; //importation du module jsonwebtoken pour gérer les tokens 
//middleware d'auuthentification 
const authMiddleware = (req, res, next) => {
    // Récupérer le token dans l'en-tête Authorization
    const token = req.header('Authorization')?.replace('Bearer ', '');

    //vérifier si le token est absent 
    if (!token) return res.status(401).json({ msg: 'Accès refusé ,aucun token fourni ' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.admin = decoded.adminId;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token invalide' });
    }
};

export default authMiddleware;
