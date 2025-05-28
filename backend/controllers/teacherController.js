import Content from '../models/Content.js';
import Exercice from '../models/Exercice.js';

export const getTeacherStats = async (req, res) => {
  const teacherId = req.params.id;

  try {
    const docStats = await Content.aggregate([
      { $match: { teacher: teacherId } },
      {
        $group: {
          _id: null,
          totalConsultations: { $sum: '$consultations' },
        },
      },
    ]);

    const exStats = await Exercice.aggregate([
      { $match: { teacher: teacherId } },
      {
        $group: {
          _id: null,
          totalConsultations: { $sum: '$consultations' },
        },
      },
    ]);

    const consultationsCount =
      (docStats[0]?.totalConsultations || 0) + (exStats[0]?.totalConsultations || 0);

    res.status(200).json({ consultationsCount });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors du calcul des statistiques', error });
  }
};
