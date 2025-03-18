// Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';  // Assurez-vous d'avoir ce fichier CSS pour le style

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Hello Admin</h2>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li>
            <Link to="/admin/dashboard" className="sidebar-link">
              AdminDashboard
            </Link>
          </li>
          <li>
            <Link to="/admin/teachers" className="sidebar-link">
            Enseignants
            </Link>
          </li>
          <li>
            <Link to="/admin/content" className="sidebar-link">
              Contenu
            </Link>
          </li>
          <li>
            <Link to="/admin/levels" className="sidebar-link">
         Niveaux
            </Link>
          </li>
          <li>
            <Link to="/admin/modules" className="sidebar-link">
             Modules
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;


