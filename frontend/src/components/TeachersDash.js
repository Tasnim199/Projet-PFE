import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import './Sidebar.css';

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('http://localhost:5000/admin/teachers', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
        .then((response) => {
          setTeachers(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Erreur lors de la récupération des enseignants:", error);
          setLoading(false);
        });
    }
  }, []);

  const handleStatusChange = (teacherId, status) => {
    const token = localStorage.getItem('token');
    axios.put(`http://localhost:5000/admin/teachers/${teacherId}/status`, { status }, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(response => {
        setTeachers(teachers.map(teacher =>
          teacher._id === teacherId ? { ...teacher, status: response.data.status } : teacher
        ));
        console.log('Statut mis à jour:', response.data);
      })
      .catch(error => {
        console.error("Erreur lors de la mise à jour du statut de l'enseignant:", error);
      });
  };

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
                  <th>Nom de l'enseignant</th>
                  <th>Email</th>
                  <th>Niveau enseigné</th>
                  <th>Nom de l'école primaire</th>
                  <th>Ville</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {teachers.map((teacher) => (
                  <tr key={teacher._id}>
                    <td>{teacher.name}</td>
                    <td>{teacher.email}</td>
                    <td>{teacher.grade}</td>
                    <td>{teacher.schoolName}</td>
                    <td>{teacher.city}</td>
                    <td>{teacher.status}</td>
                    <td>
                      {teacher.status === 'pending' ? (
                        <>
                          <button onClick={() => handleStatusChange(teacher._id, 'valider')}>Valider </button>
                          <button onClick={() => handleStatusChange(teacher._id, 'rejeter')}>Rejeter</button>
                        </>
                      ) : (
                        <span>{teacher.status}</span>
                      )}
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