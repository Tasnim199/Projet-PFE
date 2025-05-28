import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

export default function ForgotPassword() {
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role'); // "student" ou "teacher"
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/forgot-password', { email, role });
      setMessage("Lien de réinitialisation envoyé !");
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || "Erreur");
      setMessage(null);
    }
  };

  return (
    <div>
      <h2>Mot de passe oublié – {role === 'teacher' ? 'Enseignant' : 'Élève'}</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Votre email" value={email} onChange={e => setEmail(e.target.value)} required />
        <button type="submit">Envoyer</button>
      </form>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
