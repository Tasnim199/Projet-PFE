import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './TeacherLogin.css'; // 🌟 On importe le CSS

const TeacherLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/teachers/login', {
        email,
        password
      });

      localStorage.setItem('teacherToken', res.data.token);
      localStorage.setItem('teacher', JSON.stringify({ _id: res.data.teacherId }));

      alert(res.data.message);
      navigate('/teacher/Menu');
    } catch (error) {
      console.error('Erreur:', error.response?.data?.message || error.message);
      alert('Erreur lors de la connexion: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="teacher-login-page">
      <div className="teacher-login-card">
        <div className="teacher-login-image">
          <img src="https://i.pinimg.com/736x/0f/99/73/0f99732422a3fb5e44ed59752fed9d5a.jpg" alt="login teacher" />
        </div>
        <div className="teacher-login-form">
          <h2>Connexion Enseignant</h2>
          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="enseignant@example.com"
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
              <Link to="/teacher/register">Créer un compte</Link>
              <a href="/signup">Retour à la page d'acceuil</a>
              <a href="/forgot-password?role=teacher">Mot de passe oublié ?</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TeacherLogin;



