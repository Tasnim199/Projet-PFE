import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import './Sidebar.css';
import './TeachersDash.css';
import { SearchContext } from '../SearchContext';

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { searchQuery } = useContext(SearchContext);

  // Récupération des enseignants
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('http://localhost:5000/admin/teachers', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        setTeachers(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erreur récup enseignants:", err);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  // Fonction pour basculer le statut
  const toggleStatus = (teacherId, currentStatus) => {
    const newStatus = currentStatus === 'validé' ? 'bloqué' : 'validé';
    const confirmMsg = currentStatus === 'validé'
      ? "Voulez-vous vraiment bloquer cet enseignant ?"
      : "Voulez-vous activer cet enseignant ?";
    if (!window.confirm(confirmMsg)) return;

    const token = localStorage.getItem('token');
    axios.put(
      `http://localhost:5000/admin/teachers/${teacherId}/status`,
      { status: newStatus },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .then(() => {
      setTeachers(prev =>
        prev.map(t =>
          t._id === teacherId ? { ...t, status: newStatus } : t
        )
      );
    })
    .catch(err => console.error("Erreur mise à jour statut:", err));
  };

  // Filtre global
  const filtered = teachers.filter(t => {
    const text = `
      ${t.name} ${t.prenom}
      ${t.email}
      ${t.schoolName}
      ${t.city}
      ${t.status}
    `.toLowerCase();
    return text.includes(searchQuery.toLowerCase());
  });

  return (
    <div className="teachers-page">
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <>
          <Sidebar />
          <div className="teachers-content">
            <h1>Liste des enseignants</h1>
            <table>
              <thead>
                <tr>
                  <th>Nom</th><th>Prénom</th><th>Email</th>
                  <th>École</th><th>Ville</th><th>Statut</th><th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(teacher => (
                  <tr key={teacher._id}>
                    <td>{teacher.name}</td>
                    <td>{teacher.prenom}</td>
                    <td>{teacher.email}</td>
                    <td>{teacher.schoolName}</td>
                    <td>{teacher.city}</td>
                    <td>{teacher.status}</td>
                    <td>
                      <button
                        className={teacher.status === 'validé' ? 'btn-block' : 'btn-activate'}
                        onClick={() => toggleStatus(teacher._id, teacher.status)}
                      >
                        {teacher.status === 'validé' ? 'Bloquer' : 'Activer'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default Teachers;
