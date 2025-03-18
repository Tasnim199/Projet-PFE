import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import './LoginPage.css'
function LoginPage() {
  const [email, setEmail] = useState("");  // Email de l'admin
  const [password, setPassword] = useState("");  // Mot de passe de l'admin
  const navigate = useNavigate();  // Pour rediriger après la connexion

  const handleSubmit = async (e) => {
    e.preventDefault();  // Empêcher le comportement par défaut du formulaire
    
    try {
      // Appel à l'API pour vérifier l'email et le mot de passe
      const response = await axios.post('http://localhost:5000/admin/login', {
        email,
        password,
      });
      
      console.log(response.data);  // Vérifier la réponse, devrait contenir le token
     
      if (response.data.token) {
        // Si le token est présent dans la réponse
        localStorage.setItem('token', response.data.token);  // Stocker le token dans localStorage
        
        console.log('Token enregistré :', localStorage.getItem('token'));  // Vérifier si le token est bien stocké

        // Rediriger l'utilisateur vers la page d'admin
        navigate('/admin');
      } else {
        console.error("Token manquant dans la réponse");
      }
    } catch (error) {
      // Gérer les erreurs d'API ou de connexion
      console.error('Erreur lors de la connexion:', error.response?.data?.msg || error.message);
    }
  };

  return (
    <div className="login-page"> 
    <div className="login-container">
      <div className="login-box">
        <h2>Admin Login</h2>
        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            type="email"
            placeholder="admin@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label>Mot de passe</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Se connecter</button>
        </form>
        <div className="links">
          <a href="/signup">S'inscrire</a>
          <a href="/forgot-password">Mot de passe oublié ?</a>
        </div>
      </div>
    </div>
    </div>
  );
}

export default LoginPage;