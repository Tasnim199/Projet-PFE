// src/components/AddExercise.jsx
import React, { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { NotificationContext } from '../NotificationContext';
import './AddExercise.css';

const AddExercise = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('teacherToken');
  const { addNotification } = useContext(NotificationContext);

  const [niveaux, setNiveaux] = useState([]);
  const [niveauId, setNiveauId] = useState('');
  const [niveauName, setNiveauName] = useState('');
  const [modules, setModules] = useState([]);
  const [moduleSelection, setModuleSelection] = useState('');
  const [categories, setCategories] = useState([]);
  const [categorie, setCategorie] = useState('');
  const [title, setTitle] = useState('');
  const [numQuestions, setNumQuestions] = useState(1);
  const [questions, setQuestions] = useState([
    { questionText: '', correctAnswer: '', incorrectAnswer1: '', incorrectAnswer2: '' }
  ]);

  const prevNiveauName = useRef('');

  useEffect(() => {
    if (!token) {
      alert('Vous devez être connecté pour ajouter un exercice.');
      navigate('/teacher/login');
    }
  }, [token, navigate]);

  useEffect(() => {
    axios.get('http://localhost:5000/level')
      .then(res => {
        setNiveaux(res.data);
        if (res.data.length > 0) {
          setNiveauId(res.data[0]._id);
          setNiveauName(res.data[0].name);
        }
      });
  }, []);

  useEffect(() => {
    if (niveauName && niveauName !== prevNiveauName.current) {
      axios.get(`http://localhost:5000/module/modules/level/${niveauName}`)
        .then(res => setModules(res.data));
      prevNiveauName.current = niveauName;
    }
  }, [niveauName]);

  useEffect(() => {
    if (niveauId) {
      axios.get(`http://localhost:5000/categories/par-niveau/${niveauId}`)
        .then(res => setCategories(res.data));
    }
  }, [niveauId]);

  useEffect(() => {
    setQuestions(prev =>
      Array.from({ length: numQuestions }, (_, i) => prev[i] || { questionText: '', correctAnswer: '', incorrectAnswer1: '', incorrectAnswer2: '' })
    );
  }, [numQuestions]);

  const handleQuestionChange = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!title || !niveauId || !moduleSelection || !categorie) {
      toast.error('Veuillez remplir tous les champs.');
      return;
    }

    const payload = {
      title,
      level: niveauId,
      module: moduleSelection,
      category: categorie,
      questions: questions.map(q => ({ questionText: q.questionText, correctAnswer: q.correctAnswer, incorrectAnswers: [q.incorrectAnswer1, q.incorrectAnswer2] }))
    };

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.post('http://localhost:5000/api/exercices', payload, config);
      if (res.status >= 200 && res.status < 300) {
        toast.success('Exercice ajouté avec succès!');
        addNotification(`Exercice ajouté : ${title}`);
        setTimeout(() => navigate('/teacher/menu'), 2000);
      }
    } catch {
      toast.error("Erreur lors de l'enregistrement de l'exercice.");
    }
  };

  return (
    <div className="teacher-page-container">
      <div className="teacher-content">
        <h1>Ajouter un Exercice</h1>
        <form onSubmit={handleSubmit} className="exercise-form">
          <label>Niveau :</label>
          <select value={niveauId} onChange={e => { setNiveauId(e.target.value); const sel = niveaux.find(n => n._id === e.target.value); setNiveauName(sel?.name || ''); }}>
            {niveaux.map(n => <option key={n._id} value={n._id}>{n.name}</option>)}
          </select>

          <label>Module :</label>
          <select value={moduleSelection} onChange={e => setModuleSelection(e.target.value)}>
            <option value="">-- Sélectionner --</option>
            {modules.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
          </select>

          <label>Catégorie :</label>
          <select value={categorie} onChange={e => setCategorie(e.target.value)}>
            <option value="">-- Sélectionner --</option>
            {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>

          <label>Titre de l'exercice :</label>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} />

          <label>Nombre de questions :</label>
          <select value={numQuestions} onChange={e => setNumQuestions(+e.target.value)}>
            {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n}</option>)}
          </select>

          {questions.map((q, i) => (
            <div key={i} className="question-block">
              <h3>Question {i+1}</h3>
              <textarea value={q.questionText} onChange={e => handleQuestionChange(i, 'questionText', e.target.value)} placeholder="Question..." />
              <input type="text" value={q.correctAnswer} onChange={e => handleQuestionChange(i, 'correctAnswer', e.target.value)} placeholder="Bonne réponse" className="correct-answer" />
              <input type="text" value={q.incorrectAnswer1} onChange={e => handleQuestionChange(i, 'incorrectAnswer1', e.target.value)} placeholder="Mauvaise réponse 1" className="incorrect-answer" />
              <input type="text" value={q.incorrectAnswer2} onChange={e => handleQuestionChange(i, 'incorrectAnswer2', e.target.value)} placeholder="Mauvaise réponse 2" className="incorrect-answer" />
            </div>
          ))}

          <button type="submit" className="btn-add-exo">Ajouter l'exercice</button>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default AddExercise;