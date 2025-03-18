import React from 'react';
import './Sidebar.css'; 
import'./Modules.css';
const Levels = () => {
  return (
    <div className="main-content"> 
      <div className="levels">
        <h3>Gérer les niveaux</h3>
        <button>Ajouter un niveau</button>
        <ul>
          <li>3ème année  - <button>Supprimer</button> <button>Modifier</button></li>
          <li>4ème année - <button>Supprimer</button> <button>Modifier</button></li>
        </ul>
      </div>
    </div>
  );
};

export default Levels;
