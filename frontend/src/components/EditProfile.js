import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './EditProfile.css';

const EditProfile = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    // Récupérer les données actuelles du profil admin
    axios.get('http://localhost:5000/admin/profile', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then((response) => {
      setName(response.data.name);
      setEmail(response.data.email);  // Assurez-vous que l'email est bien récupéré
    })
    .catch(() => {
      toast.error('Erreur de récupération du profil');
    });
  }, [token]);

  const handleUpdate = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Le nom ne peut pas être vide !");
      return;
    }

    // Assurez-vous que vous envoyez les bonnes données dans la requête PUT
    axios.put('http://localhost:5000/admin/profile', { name, email }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    .then(() => {
      toast.success('Profil mis à jour avec succès !');
    })
    .catch(() => {
      toast.error('Erreur lors de la mise à jour du profil');
    });
  };

  // Fonction pour empêcher d'écrire des nombres dans le champ nom
  const handleNameChange = (e) => {
    const newValue = e.target.value;
    if (/^[A-Za-zÀ-ÖØ-öø-ÿ\s]*$/.test(newValue)) {
      setName(newValue);
    }
  };

  return (
    <div className="edit-profile-container">
      <h2>Modifier le Profil</h2>
      
      <form onSubmit={handleUpdate}>
        <div>
          <label>Nom :</label>
          <input 
            type="text" 
            value={name} 
            onChange={handleNameChange} 
            placeholder="Nom admin"
          />
        </div>
  
        <div>
          <label>Email :</label>
          <input 
            type="email" 
            value={email}  
            disabled 
            placeholder="Email admin" 
          />
        </div>
  
        <div>
          <label>Rôle :</label>
          <input 
            type="text" 
            value="Admin" 
            disabled 
            placeholder="Rôle admin" 
          />
        </div>
  
        <button type="submit" className="button-19">Mettre à jour</button>
      </form>
  
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default EditProfile;




