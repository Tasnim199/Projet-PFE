
   // src/components/StudentSidebar.jsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './StudentSidebar.css';

export default function StudentSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('studentToken');
    navigate('/student-login');
  };

  return (
    <aside className="student-sidebar">
      <div className="student-sidebar-header">
        <h2>Mon Espace</h2>
      </div>
      <nav>
        <ul>
        <li>
            <NavLink to="Acceuil" className="student-sidebar-link" activeclassname="active">
             Acceuil
            </NavLink>
          </li>
          <li>
            <NavLink to="profile" className="student-sidebar-link" activeclassname="active">
              Profil
            </NavLink>
          </li>
          <li>
            <NavLink to="documents" className="student-sidebar-link" activeclassname="active">
              Documents
            </NavLink>
          </li>
          <li>
            <NavLink to="evaluations" className="student-sidebar-link" activeclassname="active">
              Évaluations
            </NavLink>
          </li>
          <li>
            <NavLink to="results" className="student-sidebar-link" activeclassname="active">
              Résultats
            </NavLink>
          </li>
          <li>
            <button onClick={handleLogout} className="student-sidebar-link logout-btn">
              Déconnexion
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
