import React, { useState } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';

export default function ResetPassword() {
  const [search] = useSearchParams();
  const token     = search.get('token');
  const role      = search.get('role');
  const [pwd, setPwd]         = useState('');
  const [confirm, setConfirm] = useState('');
  const [status, setStatus]   = useState(null);

  const handleSubmit = async e => {
    e.preventDefault();
    if (pwd !== confirm) {
      return setStatus({ success: false, message: 'Les mots de passe ne correspondent pas.' });
    }
    try {
      await axios.post('http://localhost:5000/api/auth/reset-password', {
        token, password: pwd, role
      });
      setStatus({ success: true, message: 'Mot de passe changé ! Vous pouvez vous connecter.' });
    } catch (err) {
      setStatus({ success: false, message: err.response.data.message });
    }
  };

  if (!token || !role) return <p>Lien invalide.</p>;

  return (
    <form onSubmit={handleSubmit}>
      <h2>Réinitialiser ({role})</h2>
      {status && <p className={status.success ? 'success' : 'error'}>{status.message}</p>}
      <input type="password"     value={pwd}     onChange={e => setPwd(e.target.value)} placeholder="Nouveau mot de passe" required />
      <input type="password"     value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Confirmer" required />
      <button type="submit">Mettre à jour</button>
    </form>
  );
}
