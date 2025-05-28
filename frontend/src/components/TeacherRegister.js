// src/components/TeacherRegister.js
import React, { useState , useContext} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { NotificationContext } from '../NotificationContext';
import './TeacherRegister.css';

const TeacherRegister = () => {
  const { addNotification } = useContext(NotificationContext);
  const [formData, setFormData] = useState({
    name: '',
    prenom: '',
    email: '',
    schoolName: '',
    city: '',
    phone:'',
    password: '',
    confirmPassword: '',
  });

  const navigate = useNavigate();

  const tunisianCities = [
    'Tunis', 'Ariana', 'Ben Arous', 'La Manouba', 'Nabeul', 'Zaghouan', 'Bizerte',
    'Béja', 'Jendouba', 'Le Kef', 'Siliana', 'Sousse', 'Monastir', 'Mahdia',
    'Sfax', 'Kairouan', 'Kasserine', 'Sidi Bouzid', 'Gabès', 'Médenine', 'Tataouine',
    'Gafsa', 'Tozeur', 'Kebili'
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Vérification du mot de passe
    if (formData.password !== formData.confirmPassword) {
      alert("Les mots de passe ne correspondent pas !");
      return;
    }
    addNotification(`test avant`);
    try {
      // Envoi des données sauf confirmPassword
      const { confirmPassword, ...dataToSend } = formData;
      const response = await axios.post('http://localhost:5000/api/teachers/register', dataToSend);
      alert(response.data.message); // Notification de succès
      addNotification(`Nouvel enseignant inscrit : ${formData.prenom} ${formData.name}`);
      await new Promise(resolve => setTimeout(resolve, 100)); 
      navigate('/teacher/login'); // Rediriger vers la page de connexion
    } catch (error) {
      alert('Erreur lors de l\'inscription : ' + (error.response?.data?.message || error.message));
    }
  };
  return (
    <div className="page-container">
      <div className="register-card">
        <h2>Inscription Enseignant</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Nom" value={formData.name} onChange={handleChange} required />
          <input type="text" name="prenom" placeholder="Prénom" value={formData.prenom} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          <input type="text" name="schoolName" placeholder="Nom de l'école" value={formData.schoolName} onChange={handleChange} required />
          <input type="text" name="phone" placeholder="Numéro de téléphone" value={formData.phone} onChange={handleChange} required />
          <select name="city" value={formData.city} onChange={handleChange} required>
            <option value="">-- Choisir une ville --</option>
            {tunisianCities.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
  
          <input type="password" name="password" placeholder="Mot de passe" value={formData.password} onChange={handleChange} required />
          <input type="password" name="confirmPassword" placeholder="Confirmer le mot de passe" value={formData.confirmPassword} onChange={handleChange} required />
          
          <button type="submit">S'inscrire</button>
        </form>
      </div>
    </div>
  );
};

export default TeacherRegister;


