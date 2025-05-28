// src/components/ContenuAdmin.jsx
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import './Contenu.css';
import { SearchContext } from '../SearchContext';

export default function Content() {
  const [groupedContents, setGroupedContents] = useState({});
  const { searchQuery } = useContext(SearchContext);
  const q = searchQuery.trim().toLowerCase();

  const handleConsult = async content => {
    try {
      const adminToken   = localStorage.getItem('adminToken');
      const teacherToken = localStorage.getItem('token');
      const isAdmin = Boolean(adminToken);
      const url = isAdmin
        ? `http://localhost:5000/contents/admin/${content._id}`
        : `http://localhost:5000/contents/${content._id}`;
      const token = isAdmin ? adminToken : teacherToken;
      if (!token) throw new Error('Aucun token disponible');
      await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
      window.open(`http://localhost:5000/${content.file}`, '_blank');
    } catch (err) {
      console.error('Erreur:', err.response?.data || err.message);
      alert("Impossible d'accéder au document. Vérifie que tu es bien connecté.");
    }
  };

  useEffect(() => {
    const fetchContents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/contents');
        const grouped = response.data.reduce((acc, content) => {
          const level    = content.levelId?.name     || 'Niveau inconnu';
          const module   = content.moduleId?.name    || 'Module inconnu';
          const category = content.categoryId?.name  || 'Catégorie inconnue';
          acc[level] = acc[level] || {};
          acc[level][module] = acc[level][module] || {};
          acc[level][module][category] = acc[level][module][category] || [];
          acc[level][module][category].push(content);
          return acc;
        }, {});
        setGroupedContents(grouped);
      } catch (error) {
        console.error('Erreur récupération contenus :', error);
        alert('Impossible de charger les contenus');
      }
    };
    fetchContents();
  }, []);

  return (
    <div className="contenu-page">
      <Sidebar />
      <div className="contenu-container">
        <h2>Contenus pédagogiques par niveau</h2>
        <div className="contenu-levels-wrapper">
          {Object.entries(groupedContents).map(([levelName, modules]) => {
            // Recherche sur niveau
            const levelMatches = levelName.toLowerCase().includes(q);

            // Pour chaque module, on filtre catégories et contenus
            const modulesToShow = Object.entries(modules).map(
              ([moduleName, categories]) => {
                // Recherche sur module
                const moduleMatches = moduleName.toLowerCase().includes(q);

                const matchedCategories = Object.entries(categories).map(
                  ([categoryName, contents]) => {
                    // Recherche sur catégorie
                    const categoryMatches = categoryName.toLowerCase().includes(q);

                    // Filtre les contenus selon titre OU nom/prénom enseignant
                    const matchedContents = contents.filter(c => {
                      const teacherName = `${c.teacherId?.name || ''} ${c.teacherId?.prenom || ''}`.toLowerCase();
                      const titleMatches = c.title.toLowerCase().includes(q);
                      const teacherMatches = teacherName.includes(q);
                      return titleMatches || teacherMatches;
                    });

                    return (categoryMatches || matchedContents.length > 0)
                      ? [categoryName, matchedContents]
                      : null;
                  }
                ).filter(Boolean);

                return (moduleMatches || matchedCategories.length > 0)
                  ? [moduleName, matchedCategories]
                  : null;
              }
            ).filter(Boolean);

            // Si le niveau matche globalement, on affiche tout
            const finalModules = levelMatches
              ? Object.entries(modules).map(([m, cats]) =>
                  [m, Object.entries(cats).map(([cat, cnts]) => [cat, cnts])]
                )
              : modulesToShow;

            if (finalModules.length === 0) {
              return null;
            }

            return (
              <div key={levelName} className="contenu-level-card">
                <div className="contenu-level-card-header contenu-header">
                  <h3>📚 {levelName}</h3>
                </div>
                <div className="contenu-level-card-body">
                  {finalModules.map(([moduleName, categories]) => (
                    <div key={moduleName} className="contenu-module-card">
                      <div className="contenu-module-card-header">
                        <h4>📦 {moduleName}</h4>
                      </div>
                      <ul className="contenu-category-list">
                        {categories.map(([categoryName, contents]) => (
                          <li key={categoryName} className="contenu-category-item">
                            <h5>🗂 {categoryName}</h5>
                            <div>
                              {contents.map(content => (
                                <div key={content._id} className="contenu-content-item">
                                  <span className="contenu-content-title">
                                    📄 {content.title}
                                  </span>
                                  <span className="contenu-content-meta">
                                    Ajouté par {content.teacherId?.name}{' '}
                                    {content.teacherId?.prenom}
                                  </span>
                                  <button
                                    className="contenu-btn-consult"
                                    onClick={() => handleConsult(content)}
                                  >
                                    Consulter
                                  </button>
                                </div>
                              ))}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
