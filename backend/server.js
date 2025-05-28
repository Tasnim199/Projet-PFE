import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
import adminRoute from './routes/adminRoute.js';
import contentRoute from './routes/contentRoute.js';
import moduleRoute from './routes/moduleRoute.js';
import teacherRoutes from './routes/teacherRoute.js';
import levelRoute from './routes/levelRoute.js';
import categorieRoutes from './routes/categorieRoute.js';
import questionRoutes from './routes/questionRoute.js';
import exerciceRoute from './routes/exerciceRoute.js';
import studentRoute from './routes/studentRoute.js';
import evaluationRoute from './routes/evaluationRoute.js'
import authRoutes from './routes/auth.js';
import upload from './config/multer.js'; 
import studentAuth from './middleware/studentAuth.js';
import Student from './models/Student.js';
import resultRoute from './routes/resultRoute.js'; 
import verifyToken from './middleware/verifyToken.js';
import path from 'path';
import bodyParser from 'body-parser';
import Notification from './models/Notification.js';

dotenv.config();

// Se connecter à MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

app.use('/admin', adminRoute);
app.use('/contents', contentRoute);
app.use('/module', moduleRoute);
app.use('/level', levelRoute); 
app.use('/api/teachers', teacherRoutes);
app.use('/categories', categorieRoutes);
app.use('/api/questions', questionRoutes);
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use('/api/exercices', exerciceRoute);
app.use('/api/students', studentRoute);
app.use('/evaluations', evaluationRoute);
app.use('/api/results', resultRoute);
app.use('/api/auth', authRoutes);
// test
app.get('/', (req, res) => {
res.send('API en cours d\'exécution...');
});
  app.post('/api/questions', async (req, res) => {
    try {
      const { questionText, correctAnswer, incorrectAnswers, level, module, category } = req.body;
      
      // Assurez-vous que toutes les données sont présentes
      if (!questionText || !correctAnswer || !incorrectAnswers || !level || !module || !category) {
        return res.status(400).json({ message: "Tous les champs sont requis." });
      }
  
      // Ajout de la question dans la base de données
      const question = new question({
        questionText,
        correctAnswer,
        incorrectAnswers,
        level,
        module,
        category
      });
  
      await question.save();
      res.status(200).json({ message: "Question ajoutée avec succès" });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erreur serveur, impossible d'ajouter la question." });
    }
  });
  app.get('/contents/enseignant/:teacherId', async (req, res) => {
    try {
      const teacherId = req.params.teacherId;
      const documents = await Document.find({ teacherId });
      res.json(documents);
    } catch (error) {
      res.status(500).send('Erreur lors de la récupération des documents.');
    }
  });
// Exemple d'implémentation pour le backend (Express)
app.put('/api/students/profile', studentAuth, async (req, res) => {
  try {
    const { schoolName, city, level } = req.body;
    const studentId = req.student._id; // <-- Très important : req.student vient de ton middleware
    console.log("Mise à jour pour l'élève:", studentId, { schoolName, city, level });

    if (!level) {
      return res.status(400).send('Le niveau est requis.');
    }

    // Utilisation du modèle Student pour trouver et mettre à jour l'élève
    const updatedStudent = await Student.findByIdAndUpdate(studentId, {
      schoolName,
      city,
      level,
    }, { new: true });

    if (!updatedStudent) {
      return res.status(404).send('Élève non trouvé.');
    }

    res.status(200).json(updatedStudent);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur lors de la mise à jour du profil.');
  }
});
app.get('/api/notifications/admin', async (req, res) => {
  try {
    const notes = await Notification
      .find({ target: 'admin', read: false })
      .sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});

app.post('/api/notifications/mark-read', async (req, res) => {
  try {
    await Notification.updateMany(
      { target: 'admin', read: false },
      { read: true }
    );
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});
app.get('/api/notifications/teacher', verifyToken, async (req, res) => {
  try {
    const notes = await Notification.find({
      target: 'teacher',
      read:   false,
      sender: { $ne: req.teacherId }   // exclut les notif créées par moi-même
    })
    .sort({ createdAt: -1 });

    res.json(notes);
  } catch (err) {
    console.error('Erreur notifications teacher :', err);
    res.status(500).send('Erreur serveur');
  }
});

app.post('/api/notifications/mark-read', verifyToken, async (req, res) => {
  try {
    await Notification.updateMany(
      {
        target: 'teacher',
        read: false,
        sender: { $ne: req.teacherId }
      },
      { $set: { read: true } }
    );
    res.status(200).json({ message: 'Notifications marquées comme lues' });
  } catch (err) {
    console.error('Erreur mark-read :', err);
    res.status(500).send('Erreur serveur');
  }
});

// POST /api/notifications/mark-read
app.get('/api/notifications/student', studentAuth, async (req, res) => {
  try {
    // Logs de debug
    console.log('[NOTIFS] Étudiant:', {
      id: req.student._id,
      level: req.student.level?._id
    });

    if (!req.student.level?._id) {
      return res.status(400).json({ 
        success: false,
        error: "Niveau non défini pour l'étudiant" 
      });
    }

    const notifications = await Notification.find({
      target: 'student',
      read: false,
      level: req.student.level._id
    })
    .sort({ createdAt: -1 })
    .lean();

    console.log(`[NOTIFS] Trouvées: ${notifications.length}`);

    res.json({ 
      success: true,
      data: notifications 
    });

  } catch (err) {
    console.error('[NOTIFS] Erreur:', {
      message: err.message,
      stack: err.stack
    });
    res.status(500).json({ 
      success: false,
      error: 'Erreur serveur' 
    });
  }
});

// Route POST marquer comme lues
app.post('/api/notifications/student/mark-read', studentAuth, async (req, res) => {
  try {
    const updateResult = await Notification.updateMany(
      {
        target: 'student',
        read: false,
        level: req.student.level._id
      },
      { $set: { read: true } }
    );

    console.log('[NOTIFS] Marquées lues:', updateResult);

    res.sendStatus(204);
  } catch (err) {
    console.error('[NOTIFS] Erreur marquage:', err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});
// Démarrer le serveur
app.listen(PORT, () => {
console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
