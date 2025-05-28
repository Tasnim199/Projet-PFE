// src/components/TeacherMenu.js
import React, { useEffect, useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import TeacherNavbar from './TeacherNavbar';
import TeacherSidebar from './TeacherSidebar';
import ConsulterDocuments from './ConsultDocument';
import ConsultExercice   from './ConsultExercice';
import './TeacherMenu.css';

const TeacherMenu = () => {
  const [stats, setStats] = useState(null);
  const [refreshCounter, setRefreshCounter] = useState(0);
  const triggerRefresh = () => setRefreshCounter(c => c + 1);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('teacherToken');
        const res = await axios.get('http://localhost:5000/api/teachers/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, [refreshCounter]);

  return (
    <div className="teacher-teacher-page-container">
      <TeacherNavbar />
      <TeacherSidebar />

      <div className="teacher-teacher-content">
        {/* bandeau d’actions */}
        <div className="teach-action-card">
          <p className="teach-action-text">
            Bienvenue sur votre espace !<br/>
            Créez et gérez vos contenus en un clic.
          </p>
          <div className="teach-action-buttons">
            <Link to="/ajouter-document"><button className="btn btn-add">Ajouter Document</button></Link>
            <Link to="/ajouter-exercices"><button className="btn btn-add">Ajouter Exercice</button></Link>
          </div>
        </div>

        {/* stats globales */}
        {stats && (
          <div className="teach-stats-card">
            <h3 className="stats-title">📊 Vos statistiques</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-value">{stats.documentsCount}</div>
                <div className="stat-label">Documents</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{stats.questionsCount}</div>
                <div className="stat-label">Exercices</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{stats.consultationsCount}</div>
                <div className="stat-label">Consultations</div>
              </div>
            </div>
          </div>
        )}

        <Routes>
          <Route path="/consulter-documents" element={<ConsulterDocuments onRefresh={triggerRefresh} />} />
          <Route path="/consulter-exercices" element={<ConsultExercice   onRefresh={triggerRefresh} />} />
        </Routes>
      </div>
    </div>
  );
};

export default TeacherMenu;

