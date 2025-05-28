// src/pages/StudentProfile.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ModalWrapper from '../components/ModalWrapper';
import './ProfileStudent.css';

export default function StudentProfile() {
  const [student, setStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [levels, setLevels] = useState([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    parentEmail: '',
    level: '',
    schoolName: '',
    city: ''
  });
  const navigate = useNavigate();

  const cities = [
    "Ariana", "Béja", "Ben Arous", "Bizerte", "Gabès", "Gafsa", "Jendouba",
    "Kairouan", "Kasserine", "Kébili", "Le Kef", "Mahdia", "La Manouba",
    "Médenine", "Monastir", "Nabeul", "Sfax", "Sidi Bouzid", "Siliana",
    "Sousse", "Tataouine", "Tozeur", "Tunis", "Zaghouan"
  ];

  useEffect(() => {
    const token = localStorage.getItem('studentToken');
    if (!token) {
      navigate('/student-login');
      return;
    }
    const fetchProfileAndLevels = async () => {
      try {
        const profileRes = await axios.get(
          'http://localhost:5000/api/students/profile',
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const studentData = profileRes.data;
        setStudent(studentData);
        setFormData({
          firstName: studentData.firstName,
          lastName: studentData.lastName,
          parentEmail: studentData.parentEmail,
          level: studentData.level ? studentData.level._id : '',
          schoolName: studentData.schoolName,
          city: studentData.city
        });
        const levelsRes = await axios.get('http://localhost:5000/level');
        setLevels(levelsRes.data);
      } catch (error) {
        console.error('Erreur chargement profil ou niveaux', error);
        navigate('/student-login');
      }
    };
    fetchProfileAndLevels();
  }, [navigate]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const token = localStorage.getItem('studentToken');
    if (!token) return navigate('/student-login');
    try {
      await axios.put(
        'http://localhost:5000/api/students/profile',
        { schoolName: formData.schoolName, city: formData.city, level: formData.level },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const res = await axios.get('http://localhost:5000/api/students/profile', { headers: { Authorization: `Bearer ${token}` } });
      setStudent(res.data);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Erreur mise à jour profil', error);
    }
  };

  if (!student) return <div>Chargement…</div>;

  return (
    <div className="profile-container">
      <h2>Profil de {student.firstName} {student.lastName}</h2>
      <div className="profile-details">
        <div className="form-group">
          <label>Nom :</label>
          <input type="text" value={formData.firstName} disabled />
        </div>
        <div className="form-group">
          <label>Prénom :</label>
          <input type="text" value={formData.lastName} disabled />
        </div>
        <div className="form-group">
          <label>Email du parent :</label>
          <input type="email" value={formData.parentEmail} disabled />
        </div>
        <div className="form-group">
          <label>Niveau :</label>
          <select name="level" value={formData.level} disabled>
            <option value="">-- Choisir un niveau --</option>
            {levels.map(lvl => (
              <option key={lvl._id} value={lvl._id}>{lvl.name}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>École :</label>
          <input type="text" name="schoolName" value={formData.schoolName} disabled />
        </div>
        <div className="form-group">
          <label>Ville :</label>
          <select name="city" value={formData.city} disabled>
            <option value="">-- Sélectionner une ville --</option>
            {cities.map((city, idx) => (
              <option key={idx} value={city}>{city}</option>
            ))}
          </select>
        </div>
        <button className="btn-edit" onClick={() => setIsModalOpen(true)}>Modifier</button>
      </div>

      <ModalWrapper isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)}>
        <h3>Modifier le profil</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nom :</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Prénom :</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email du parent :</label>
            <input
              type="email"
              name="parentEmail"
              value={formData.parentEmail}
              disabled
            />
          </div>

          <div className="form-group">
            <label>Niveau :</label>
            <select
              name="level"
              value={formData.level}
              onChange={handleChange}
              required
            >
              <option value="">-- Choisir un niveau --</option>
              {levels.map(lvl => (
                <option key={lvl._id} value={lvl._id}>{lvl.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>École :</label>
            <input
              type="text"
              name="schoolName"
              value={formData.schoolName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Ville :</label>
            <select
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
            >
              <option value="">-- Sélectionner une ville --</option>
              {cities.map((city, idx) => (
                <option key={idx} value={city}>{city}</option>
              ))}
            </select>
          </div>

          <div className="form-buttons">
            <button type="submit" className="btn-submit">Enregistrer</button>
            <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>
              Annuler
            </button>
          </div>
        </form>
      </ModalWrapper>
    </div>
  );
}
