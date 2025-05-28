import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import './LoginPage.css';

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/admin/login', {
        email,
        password,
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        navigate('/admin');
      } else {
        console.error("Token manquant dans la réponse");
      }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error.response?.data?.msg || error.message);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-image">
          <img src="https://i.pinimg.com/736x/70/1e/91/701e91d7a2dce3fb43f35a0c42dc4425.jpg" alt="login" />
        </div>
        <div className="login-form">
          <h2>Connexion Admin</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label>Mot de passe</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="login-button">Se connecter</button>

            <div className="links">
              <a href="/signup">Retour à la page d'acceuil</a>
              
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
