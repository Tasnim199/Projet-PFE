// src/components/EvaluationsPage.js
import React, { useEffect, useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaExclamationTriangle } from 'react-icons/fa';
import './EvaluationsPage.css';  // CSS dédié

export default function EvaluationsPage() {
  const { student } = useOutletContext();
  const navigate    = useNavigate();
  const [modules, setModules]             = useState([]);
  const [selectedModules, setSelectedModules] = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState(null);
  const [warning, setWarning]             = useState('');  // <- pour le message d’avertissement

  useEffect(() => {
    if (!student) return;
    axios.get('http://localhost:5000/module/modules')
      .then(res => {
        const levelModules = res.data.filter(m =>
          m.level.trim() === student.level.name.trim()
        );
        if (!levelModules.length) setError('Aucun module disponible pour ce niveau.');
        else setModules(levelModules);
      })
      .catch(() => setError('Erreur lors du chargement des modules.'))
      .finally(() => setLoading(false));
  }, [student]);

  const toggle = id => {
    setWarning('');  // effacer le warning dès qu’on interagit
    setSelectedModules(s =>
      s.includes(id) ? s.filter(x => x !== id) : [...s, id]
    );
  };

  const start = async () => {
    if (!selectedModules.length) {
      setWarning('Veuillez sélectionner au moins un module.');
      return;
    }
    try {
      const { data: questions } = await axios.post(
        'http://localhost:5000/evaluations/generate',
        { moduleIds: selectedModules, questionCount: 20 }
      );
      navigate('/student-dashboard/evaluation/start', { state: { questions } });
    } catch {
      setWarning('Impossible de générer l’évaluation. Réessayez plus tard.');
    }
  };

  return (
    <div id="evaluations-wrapper">
      <h2 className="eval-title">
        {loading ? 'Chargement…' : error ? error : `Modules pour ${student.level.name}`}
      </h2>

      {!loading && !error && (
        <>
          {warning && (
            <div className="eval-warning">
              <FaExclamationTriangle className="warning-icon" />
              <span>{warning}</span>
            </div>
          )}

          <div className="eval-modules-list">
            {modules.map(m => (
              <label key={m._id} className="eval-module-item">
                <input
                  type="checkbox"
                  checked={selectedModules.includes(m._id)}
                  onChange={() => toggle(m._id)}
                />
                <span className="eval-module-name">{m.name}</span>
              </label>
            ))}
          </div>

          <button className="eval-start-button btn-star" onClick={start}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={`star-${i+1}`}>
                <svg className="star-svg" viewBox="0 0 784.11 815.53">
                  <path d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z" />
                </svg>
              </div>
            ))}
            Commencer l’évaluation
          </button>
        </>
      )}
    </div>
  );
}

