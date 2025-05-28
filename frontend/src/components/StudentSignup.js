import React, { useState, useEffect , useContext} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { NotificationContext } from '../NotificationContext';
import './StudentSignup.css';

export default function StudentSignup() {
  const { addNotification } = useContext(NotificationContext);
  const [levels, setLevels] = useState([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    schoolName: '',
    city: '',
    parentEmail: '',
    password: '',
    level: ''
  });

  const navigate = useNavigate();
 const tunisianCities = [
    'Tunis', 'Ariana', 'Ben Arous', 'La Manouba', 'Nabeul', 'Zaghouan', 'Bizerte',
    'Béja', 'Jendouba', 'Le Kef', 'Siliana', 'Sousse', 'Monastir', 'Mahdia',
    'Sfax', 'Kairouan', 'Kasserine', 'Sidi Bouzid', 'Gabès', 'Médenine', 'Tataouine',
    'Gafsa', 'Tozeur', 'Kebili'
  ];

  useEffect(() => {
    const fetchLevels = async () => {
      const res = await axios.get('http://localhost:5000/level');
      setLevels(res.data);
    };
    fetchLevels();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/students/register', formData);
      alert("Inscription réussie !");
      addNotification(`Nouvel élève inscrit : ${formData.firstName} ${formData.lastName}`);
      navigate('/student-login');
    } catch (err) {
      alert(err.response?.data?.msg || "Erreur lors de l'inscription !");
    }
  };

  return (
    <div className="signup-container gradient-custom-3">
      <div className="auth-form">
        <h2>Inscription Élève</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name="firstName" placeholder="Prénom" value={formData.firstName} onChange={handleChange} required />
          <input type="text" name="lastName" placeholder="Nom" value={formData.lastName} onChange={handleChange} required />
          <input type="text" name="schoolName" placeholder="École" value={formData.schoolName} onChange={handleChange} required />
          <select name="city" value={formData.city} onChange={handleChange} required>
            <option value="">ville</option>
            {tunisianCities.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
          <input type="email" name="parentEmail" placeholder="Email du parent" value={formData.parentEmail} onChange={handleChange} required />
          <input type="password" name="password" placeholder="Mot de passe" value={formData.password} onChange={handleChange} required />
          <select name="level" value={formData.level} onChange={handleChange} required>
            <option value="">Sélectionner un niveau</option>
            {levels.map((lvl) => (
              <option key={lvl._id} value={lvl._id}>{lvl.name}</option>
            ))}
          </select>
          <button type="submit">S'inscrire</button>
        </form>
      </div>
    </div>
  );
}
