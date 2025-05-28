// src/components/AcceuilPage.jsx
import React, { useEffect, useState } from 'react';
import CountUp from 'react-countup';
import axios from 'axios';
import './AcceuilPage.css';

const AcceuilPage = () => {
  // États dynamiques
  const [lastEvaluationScore, setLastEvaluationScore] = useState(0);
  const [evaluationsThisWeek, setEvaluationsThisWeek]   = useState(0);
  const [progression, setProgression]                   = useState(0);

  // Configuration des boutons
  const buttons = [
    { label: "Passer une évaluation", action: "/student-dashboard/evaluations" },
    { label: "Lire un cours",           action: "/student-dashboard/documents"     },
    { label: "Voir les résultats",      action: "/student-dashboard/results"       },
  ];

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const token = localStorage.getItem('studentToken');
        if (!token) throw new Error('Token manquant');
        const { data } = await axios.get('http://localhost:5000/api/results', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (data.length === 0) return;

        // Trier par date décroissante
        const sorted = data.sort((a, b) => new Date(b.date) - new Date(a.date));

        // 1. Dernière note (sur 20) :
        const last = sorted[0];
        const lastPct = (last.correctAnswers / last.totalQuestions) * 20;
        setLastEvaluationScore(Math.round(lastPct));

        // 2. Évaluations de la semaine (7 derniers jours) :
        const now = new Date();
        const weekAgo = new Date(now);
        weekAgo.setDate(now.getDate() - 7);
        const weekResults = sorted.filter(r => new Date(r.date) >= weekAgo);
        setEvaluationsThisWeek(weekResults.length);

        // 3. Progression entre la 1re et la dernière de la semaine :
        if (weekResults.length >= 2) {
          // Trier ces résultats par date croissante pour prendre 1er et dernier
          const ascWeek = [...weekResults].sort((a, b) => new Date(a.date) - new Date(b.date));
          const first  = ascWeek[0];
          const lastW  = ascWeek[ascWeek.length - 1];
          const firstPct = first.correctAnswers / first.totalQuestions;
          const lastPctW = lastW.correctAnswers   / lastW.totalQuestions;
          const deltaPct = ((lastPctW - firstPct) / firstPct) * 100;
          setProgression(Math.round(deltaPct));
        } else {
          setProgression(0);
        }
      } catch (err) {
        console.error('Erreur récupération des résultats', err);
      }
    };

    fetchResults();
  }, []);

  return (
    <div className="acceuil-page">
      {/* --- Boutons étoilés --- */}
      <div className="acceuil-btns">
        {buttons.map((btn, idx) => (
          <button
            key={idx}
            className="acceuil-btn-star"
            onClick={() => window.location.href = btn.action}
          >
            {btn.label}
            {[1,2,3,4,5,6].map(n => (
              <svg
                key={n}
                className={`star star-${n}`}
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 .587l3.668 7.568L24 9.423l-6 5.847 1.417 8.267L12 18.902l-7.417 4.635L6 15.27 0 9.423l8.332-1.268z" />
              </svg>
            ))}
          </button>
        ))}
      </div>

      {/* --- Cartes de statistiques --- */}
      <div className="acceuil-stat-grid">
        <div className="acceuil-stat-card">
          <h3>Dernière note obtenue</h3>
          <p><CountUp end={lastEvaluationScore} duration={2} /></p>
        </div>
        <div className="acceuil-stat-card">
          <h3>Évaluations cette semaine</h3>
          <p><CountUp end={evaluationsThisWeek} duration={2} /></p>
        </div>
        <div className="acceuil-stat-card">
          <h3>Progression</h3>
          <p><CountUp end={progression} duration={2} /> %</p>
        </div>
      </div>
    </div>
  );
};

export default AcceuilPage;
