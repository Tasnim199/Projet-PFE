import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Sidebar.css';  // Le CSS corrigé

const Sidebar = () => {
  const [adminName, setAdminName] = useState('Admin');

  useEffect(() => {
    const fetchAdminName = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/admin/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Cas où l'API renvoie firstName et lastName
        if (res.data.firstName) {
          setAdminName(res.data.firstName);
        } else if (res.data.name) {
          // Cas où l'API renvoie un champ name complet
          const [first] = res.data.name.split(' ');
          setAdminName(first);
        }
      } catch (err) {
        console.error('Impossible de charger le nom de l\'admin', err);
      }
    };

    fetchAdminName();
  }, []);

  return (
    <div className="admin-sidebar">
      <div className="admin-sidebar-header">
        <h2>Hello {adminName}</h2>
      </div>
      <nav className="admin-sidebar-nav">
        <ul>
          <li>
            <Link to="/admin/dashboard" className="admin-sidebar-link">
              AdminDashboard
            </Link>
          </li>
          <li>
            <Link to="/admin/teachers" className="admin-sidebar-link">
              Enseignants
            </Link>
          </li>
          <li>
            <Link to="/admin/content" className="admin-sidebar-link">
              Contenu
            </Link>
          </li>
          <li>
            <Link to="/admin/exercices" className="admin-sidebar-link admin-sidebar-exercices">
              Exercices
            </Link>
          </li>
          <li>
            <Link to="/admin/categorie" className="admin-sidebar-link">
              Catégories
            </Link>
          </li>
          <li>
            <Link to="/admin/levels" className="admin-sidebar-link">
              Niveaux
            </Link>
          </li>
          <li>
            <Link to="/admin/modules" className="admin-sidebar-link">
              Modules
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;

