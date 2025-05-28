// src/components/ManageExercices.jsx
import React, { useEffect, useState, useCallback, useContext } from 'react';
import axios from 'axios';
import TeacherNavbar from './TeacherNavbar';
import TeacherSidebar from './TeacherSidebar';
import ModalWrapper from './ModalWrapper';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { SearchContext } from '../SearchContext';
import './ManageExercice.css';

export default function ManageExercices() {
  const [exercices, setExercices] = useState([]);
  const [exSelectionne, setExSelectionne] = useState(null);
  const [afficheModalVue, setAfficheModalVue] = useState(false);
  const [afficheModalModif, setAfficheModalModif] = useState(false);
  const { searchQuery } = useContext(SearchContext);

  const enseignantId = JSON.parse(localStorage.getItem('teacher'))?._id;

  const fetchExercices = useCallback(async () => {
    if (!enseignantId) return;
    try {
      const res = await axios.get(
        `http://localhost:5000/api/exercices/mes-exercices/${enseignantId}`
      );
      setExercices(res.data);
    } catch (err) {
      console.error('Erreur chargement exercices', err);
    }
  }, [enseignantId]);

  useEffect(() => { fetchExercices(); }, [fetchExercices]);

  const exercicesFiltres = exercices.filter(ex => {
    const txt = `${ex.title} ${ex.level?.name || ''} ${ex.module?.name || ''} ${ex.category?.name || ''}`.toLowerCase();
    return txt.includes(searchQuery.toLowerCase());
  });

  const voirExercice = ex => { setExSelectionne(ex); setAfficheModalVue(true); };
  const modifierExercice = ex => { setExSelectionne({ ...ex }); setAfficheModalModif(true); };
  const supprimerExercice = async id => {
    if (!window.confirm('Supprimer cet exercice ?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/exercices/${id}`);
      fetchExercices();
    } catch (err) {
      console.error('Erreur suppression', err);
    }
  };
  const enregistrerModifs = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/exercices/${exSelectionne._id}`,
        exSelectionne
      );
      setAfficheModalModif(false);
      fetchExercices();
    } catch (err) {
      console.error('Erreur modification', err);
    }
  };

  return (
    <>
      <TeacherNavbar />
      <div className="mng-exercices-page-container">
        <TeacherSidebar />
        <div className="mng-exercices-content">
          <h2 className="mng-exercices-title">Gestion de mes exercices</h2>

          {exercicesFiltres.length === 0 ? (
            <p className="mng-exercices-no-data">Aucun exercice trouvé.</p>
          ) : (
            <table className="mng-exercices-table">
              <thead>
                <tr>
                  <th>Titre</th><th>Niveau</th><th>Module</th><th>Catégorie</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {exercicesFiltres.map(ex => (
                  <tr key={ex._id}>
                    <td>{ex.title}</td>
                    <td>{ex.level?.name || '-'}</td>
                    <td>{ex.module?.name || '-'}</td>
                    <td>{ex.category?.name || '-'}</td>
                    <td className="mng-exercices-actions">
                      <Button size="sm" className="mng-exercices-btn-view" onClick={() => voirExercice(ex)}>Consulter</Button>{' '}
                      <Button size="sm" variant="warning" className="mng-exercices-btn-edit" onClick={() => modifierExercice(ex)}>Modifier</Button>{' '}
                      <Button size="sm" variant="danger" className="mng-exercices-btn-delete" onClick={() => supprimerExercice(ex._id)}>Supprimer</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {afficheModalVue && exSelectionne && (
            <ModalWrapper isOpen={afficheModalVue} onRequestClose={() => setAfficheModalVue(false)}>
              <div className="mng-exercices-modal-header">
                <h5 className="mng-exercices-modal-title">Consulter l’exercice</h5>
                <button className="mng-exercices-modal-close" onClick={() => setAfficheModalVue(false)}>×</button>
              </div>
              <div className="mng-exercices-modal-body mng-exercices-scroll">
                <h4>{exSelectionne.title}</h4>
                {exSelectionne.questions.map((q,i) => (
                  <div key={i} className="mng-exercices-question-block">
                    <p><strong>Q{i+1} :</strong> {q.questionText}</p>
                    <ul>
                      <li><strong>Bonne réponse :</strong> {q.correctAnswer}</li>
                      {q.incorrectAnswers.map((a,j) => <li key={j}>Fausse réponse {j+1} : {a}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
              <div className="mng-exercices-modal-footer">
                <Button variant="secondary" className="mng-exercices-btn-close" onClick={() => setAfficheModalVue(false)}>Fermer</Button>
              </div>
            </ModalWrapper>
          )}

          {afficheModalModif && exSelectionne && (
            <ModalWrapper isOpen={afficheModalModif} onRequestClose={() => setAfficheModalModif(false)}>
              <div className="mng-exercices-modal-header">
                <h5 className="mng-exercices-modal-title">Modifier l’exercice</h5>
                <button className="mng-exercices-modal-close" onClick={() => setAfficheModalModif(false)}>×</button>
              </div>
              <div className="mng-exercices-modal-body mng-exercices-scroll">
                <Form.Group className="mng-exercices-form-group">
                  <Form.Label className="mng-exercices-form-label">Titre</Form.Label>
                  <Form.Control
                    className="mng-exercices-form-control"
                    type="text"
                    value={exSelectionne.title}
                    onChange={e => setExSelectionne(se => ({ ...se, title: e.target.value }))}
                  />
                </Form.Group>
                {exSelectionne.questions.map((q,i) => (
                  <div key={i} className="mng-exercices-question-edit">
                    <Form.Control
                      className="mng-exercices-form-control mb-2"
                      value={q.questionText}
                      onChange={e => {
                        const arr = [...exSelectionne.questions];
                        arr[i].questionText = e.target.value;
                        setExSelectionne(se => ({ ...se, questions: arr }));
                      }}
                      placeholder={`Question ${i+1}`}
                    />
                    <Form.Control
                      className="mng-exercices-form-control mb-2"
                      value={q.correctAnswer}
                      onChange={e => {
                        const arr = [...exSelectionne.questions];
                        arr[i].correctAnswer = e.target.value;
                        setExSelectionne(se => ({ ...se, questions: arr }));
                      }}
                      placeholder="Bonne réponse"
                    />
                    {q.incorrectAnswers.map((a,j) => (
                      <Form.Control
                        key={j}
                        className="mng-exercices-form-control mb-2"
                        value={a}
                        onChange={e => {
                          const arr = [...exSelectionne.questions];
                          arr[i].incorrectAnswers[j] = e.target.value;
                          setExSelectionne(se => ({ ...se, questions: arr }));
                        }}
                        placeholder={`Fausse réponse ${j+1}`}
                      />
                    ))}
                  </div>
                ))}
              </div>
              <div className="mng-exercices-modal-footer">
                <Button variant="secondary" className="mng-exercices-btn-cancel" onClick={() => setAfficheModalModif(false)}>Annuler</Button>
                <Button variant="success" className="mng-exercices-btn-save" onClick={enregistrerModifs}>Enregistrer</Button>
              </div>
            </ModalWrapper>
          )}

        </div>
      </div>
    </>
  );
}
