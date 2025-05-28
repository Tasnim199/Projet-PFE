// src/components/ConsultAdminExercice.jsx
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import ModalWrapper from './ModalWrapper';
import Button from 'react-bootstrap/Button';
import { SearchContext } from '../SearchContext';
import './ConsultAdminExercice.css';

export default function ConsultAdminExercice({ onRefresh = () => {} }) {
  const [exercises, setExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { searchQuery } = useContext(SearchContext);

  useEffect(() => {
    async function fetchExercises() {
      try {
        const res = await axios.get('http://localhost:5000/api/exercices/');
        setExercises(res.data);
      } catch (err) {
        console.error('Erreur chargement exercices admin', err);
      }
    }
    fetchExercises();
  }, []);

  const filteredExercises = exercises.filter(ex => {
    const text = `${ex.title} ${ex.level?.name || ''} ${ex.module?.name || ''} ${ex.category?.name || ''} ${ex.teacher?.name || ''} ${ex.teacher?.prenom || ''}`.toLowerCase();
    return text.includes(searchQuery.toLowerCase());
  });

  function handleView(ex) {
    setSelectedExercise(ex);
    setShowModal(true);
    onRefresh();
  }

  return (
    <div className="admin-page-container">
      <Sidebar />
      <div className="admin-content consult-admin-exercises">
        <h2 className="section-title">Liste des Exercices</h2>
        {filteredExercises.length === 0 ? (
          <p>Aucun exercice trouvé.</p>
        ) : (
          <table className="modern-table exercises-table">
            <thead>
              <tr>
                <th>Titre</th>
                <th>Niveau</th>
                <th>Module</th>
                <th>Catégorie</th>
                <th>Ajouté par</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredExercises.map(ex => (
                <tr key={ex._id}>
                  <td data-label="Titre">{ex.title}</td>
                  <td data-label="Niveau">{ex.level?.name || '-'}</td>
                  <td data-label="Module">{ex.module?.name || '-'}</td>
                  <td data-label="Catégorie">{ex.category?.name || '-'}</td>
                  <td data-label="Ajouté par">{ex.teacher?.name || '-'} {ex.teacher?.prenom || ''}</td>
                  <td data-label="Action">
                    <button className="btn-19" onClick={() => handleView(ex)}>Consulter</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {selectedExercise && (
          <ModalWrapper isOpen={showModal} onRequestClose={() => setShowModal(false)}>
            <div className="modal-header">
              <h5 className="modal-title">Consulter l’exercice</h5>
              <button className="btn-close" onClick={() => setShowModal(false)} />
            </div>
            <div className="modal-body">
              <h4>{selectedExercise.title}</h4>
              {selectedExercise.questions?.map((q, i) => (
                <div key={i} className="question-block">
                  <p><strong>Q{i + 1} :</strong> {q.questionText}</p>
                  <ul>
                    <li><strong>Bonne réponse :</strong> {q.correctAnswer}</li>
                    {q.incorrectAnswers.map((a, j) => (
                      <li key={j}>Fausse réponse {j + 1} : {a}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="modal-footer">
              <Button variant="secondary" onClick={() => setShowModal(false)}>Fermer</Button>
            </div>
          </ModalWrapper>
        )}
      </div>
    </div>
  );
}
