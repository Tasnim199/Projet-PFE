import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBell, FaUserCircle } from "react-icons/fa"; // Pour les icônes de la cloche et de l'avatar
import './Navbar.css'; // Assure-toi de styliser le Navbar avec ce fichier CSS

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Etat pour gérer l'ouverture du menu utilisateur

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen); // Ouvre ou ferme le menu
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <input
          type="text"
          placeholder="Rechercher..."
          className="navbar-search"
        />
      </div>

      <div className="navbar-right">
        <div className="navbar-icon">
          <FaBell className="bell-icon" />
        </div>
        <div className="navbar-avatar">
          <FaUserCircle className="user-icon" />
          <span className="admin-name" onClick={handleMenuToggle}>Admin</span>
          {isMenuOpen && (
            <div className="user-menu">
              <ul>
                <li><Link to="/edit-profile">Modifier le profil</Link></li>
                <li><Link to="/logout">Se déconnecter</Link></li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
