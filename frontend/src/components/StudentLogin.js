import React, { useState } from 'react';
import { useNavigate , Link } from 'react-router-dom';
import axios from 'axios';
import './StudentLogin.css'; // 🎨 On importe le CSS

export default function StudentLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/students/login', { 
        
        parentEmail: email, 
        password 
      });
      
      console.log('→ réponse login :', res.data);
      localStorage.setItem('studentToken', res.data.token);
      localStorage.setItem('student', JSON.stringify(res.data.student));


      navigate('/student-dashboard/Acceuil');
    } catch (err) {
      alert(err.response?.data?.msg || "Erreur de connexion !");
    }
  }

  return (
    <div className="student-login-page">
      <div className="student-login-card">
        <div className="student-login-image">
          <img src="https://i.pinimg.com/736x/5d/9f/d3/5d9fd39c31f00577404141ee9d62647c.jpg" alt="login student" />
        </div>
        <div className="student-login-form">
          <h2>Connexion Élève</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Email du parent</label>
              <input 
                type="email" 
                placeholder="parent@example.com" 
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
               <Link to="/student-signup">Créer un compte</Link>
              <a href="/forgot-password?role=student">Mot de passe oublié ?</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
