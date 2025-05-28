import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import TeacherNavbar from './TeacherNavbar';
import TeacherSidebar from './TeacherSidebar';
import ModalWrapper from './ModalWrapper';
import Button from 'react-bootstrap/Button';
import { SearchContext } from '../SearchContext';
import './ConsultExercice.css';

export default function ConsultExercice() {
  const [exercices, setExercices] = useState([]);
  const [selectedExercice, setSelectedExercice] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { searchQuery } = useContext(SearchContext);

  useEffect(() => {
    async function fetchExercices() {
      try {
        const res = await axios.get('http://localhost:5000/api/exercices/');
        setExercices(res.data);
      } catch (err) {
        console.error('Erreur chargement exercices', err);
      }
    }
    fetchExercices();
  }, []);

  const filtered = exercices.filter(ex => {
    const txt = `${ex.title} ${ex.level?.name || ''} ${ex.module?.name || ''} ${ex.category?.name || ''} ${ex.teacher?.name || ''} ${ex.teacher?.prenom || ''}`.toLowerCase();
    return txt.includes(searchQuery.toLowerCase());
  });

  const handleView = ex => {
    setSelectedExercice(ex);
    setShowModal(true);
  };

  return (
    <>
      <TeacherNavbar />
      <div className="consult-page-container">
        <TeacherSidebar />
        <div className="consult-content-wrapper">
          <h2 className="consult-section-title">Liste des Exercices</h2>

          {filtered.length === 0 ? (
            <p className="consult-no-data">Aucun exercice disponible.</p>
          ) : (
            <table className="consult-table">
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
                {filtered.map(ex => (
                  <tr key={ex._id}>
                    <td data-label="Titre">{ex.title}</td>
                    <td data-label="Niveau">{ex.level?.name || '-'}</td>
                    <td data-label="Module">{ex.module?.name || '-'}</td>
                    <td data-label="Catégorie">{ex.category?.name || '-'}</td>
                    <td data-label="Ajouté par">{ex.teacher?.name} {ex.teacher?.prenom}</td>
                    <td data-label="Action">
                      <button className="consult-btn-view" onClick={() => handleView(ex)}>
                        Consulter
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {showModal && selectedExercice && (
            <ModalWrapper
              isOpen={showModal}
              onRequestClose={() => setShowModal(false)}
              contentClassName="consult-modal-content"
              dialogClassName="consult-modal-dialog"
            >
              <div className="consult-modal-header">
                <h5 className="consult-modal-title">Consulter l’exercice</h5>
                <button className="consult-modal-close" onClick={() => setShowModal(false)}>×</button>
              </div>
              <div className="consult-modal-body consult-scrollable-body">
                <h4 className="consult-ex-title">{selectedExercice.title}</h4>
                {selectedExercice.questions.map((q, i) => (
                  <div key={i} className="consult-question-block">
                    <p><strong>Q{i + 1} :</strong> {q.questionText}</p>
                    <ul className="consult-answer-list">
                      <li><strong>Bonne réponse :</strong> {q.correctAnswer}</li>
                      {q.incorrectAnswers.map((a, j) => (
                        <li key={j}>Fausse réponse {j + 1} : {a}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div className="consult-modal-footer">
                <Button variant="secondary" className="consult-btn-close-footer" onClick={() => setShowModal(false)}>
                  Fermer
                </Button>
              </div>
            </ModalWrapper>
          )}

        </div>
      </div>
    </>
  );
}