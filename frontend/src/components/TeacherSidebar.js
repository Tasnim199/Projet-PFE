import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './TeacherSidebar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const TeacherSidebar = () => {
  const [showDocuments, setShowDocuments] = useState(false);
  const [showExercices, setShowExercices] = useState(false);
  const [teacherName, setTeacherName] = useState('');

  useEffect(() => {
    const raw = localStorage.getItem('teacher');
    if (raw) {
      try {
        const { _id } = JSON.parse(raw);
        if (_id) {
          // Récupérer les détails de l'enseignant depuis l'API
          axios.get(`http://localhost:5000/api/teachers/${_id}`)
            .then(res => {
              const prenom = res.data.prenom || res.data.name;
              const formatted = prenom ? prenom.charAt(0).toUpperCase() + prenom.slice(1) : '';
              setTeacherName(formatted);
            })
            .catch(err => console.error('Erreur fetch teacher in sidebar:', err));
        }
      } catch (err) {
        console.error('Parsing teacher from localStorage failed:', err);
      }
    }
  }, []);

  return (
    <div className="teacher-sidebar">
      <div className="teacher-sidebar-header">
        <h2>Bienvenue, {teacherName || 'Enseignant'} 👋</h2>
      </div>

      <nav className="teacher-sidebar-nav">
        <ul>
          <li><Link to="/teacher/menu" className="teacher-sidebar-link">Accueil</Link></li>
          <li><Link to="/EditProfilTeacher" className="teacher-sidebar-link">Profil</Link></li>

          <li onClick={() => setShowDocuments(!showDocuments)} className="teacher-sidebar-link toggle">
            Documents
            <FontAwesomeIcon icon={showDocuments ? faChevronDown : faChevronRight} className="teacher-arrow" />
          </li>
          {showDocuments && (
            <ul>
              <li><Link to="/gerer-documents" className="teacher-sidebar-link">Gérer mes documents</Link></li>
              <li><Link to="/consulter-documents" className="teacher-sidebar-link">Consulter les documents</Link></li>
            </ul>
          )}

          <li onClick={() => setShowExercices(!showExercices)} className="teacher-sidebar-link toggle">
            Exercices
            <FontAwesomeIcon icon={showExercices ? faChevronDown : faChevronRight} className="teacher-arrow" />
          </li>
          {showExercices && (
            <ul>
              <li><Link to="/gerer-exercices" className="teacher-sidebar-link">Consulter mes exercices</Link></li>
              <li><Link to="/consulter-exercices" className="teacher-sidebar-link">Consulter tous les exercices</Link></li>
            </ul>
          )}

          <li><Link to="/teacher/login" className="teacher-sidebar-link">Se déconnecter</Link></li>
        </ul>
      </nav>
    </div>
  );
};

export default TeacherSidebar;
