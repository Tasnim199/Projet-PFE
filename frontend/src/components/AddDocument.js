// src/components/AddDocument.jsx
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { NotificationContext } from '../NotificationContext';
import './AddDocument.css';

const AddDocument = () => {
  const navigate = useNavigate();
  const { addNotification } = useContext(NotificationContext);

  const [niveaux, setNiveaux] = useState([]);
  const [niveauId, setNiveauId] = useState('');
  const [niveauName, setNiveauName] = useState('');
  const [modules, setModules] = useState([]);
  const [moduleSelection, setModuleSelection] = useState('');
  const [categories, setCategories] = useState([]);
  const [categorie, setCategorie] = useState('');
  const [documentFile, setDocumentFile] = useState(null);
  const [title, setTitle] = useState('');
  const [teacherId, setTeacherId] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('teacher');
    try {
      const t = JSON.parse(stored);
      if (t && t._id) setTeacherId(t._id);
    } catch {}
  }, []);

  useEffect(() => {
    axios.get('http://localhost:5000/level')
      .then(res => {
        setNiveaux(res.data);
        if (res.data.length) {
          setNiveauId(res.data[0]._id);
          setNiveauName(res.data[0].name);
        }
      })
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (!niveauName) return;
    axios.get(`http://localhost:5000/module/modules/level/${niveauName}`)
      .then(res => setModules(res.data))
      .catch(err => console.error(err));
  }, [niveauName]);

  useEffect(() => {
    if (!niveauId) return;
    axios.get(`http://localhost:5000/categories/par-niveau/${niveauId}`)
      .then(res => setCategories(res.data))
      .catch(err => console.error(err));
  }, [niveauId]);

  const handleFileChange = e => setDocumentFile(e.target.files[0]);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!teacherId || !documentFile) {
      toast.error('Veuillez remplir tous les champs.');
      return;
    }

    const fd = new FormData();
    fd.append('document', documentFile);
    fd.append('title', title);
    fd.append('levelId', niveauId);
    fd.append('moduleId', moduleSelection);
    fd.append('categoryId', categorie);
    fd.append('teacherId', teacherId);

    try {
      await axios.post('http://localhost:5000/contents/ajouter-document', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Document ajouté avec succès!');
      addNotification(`Document ajouté : ${title}`);
      setTimeout(() => navigate('/teacher/menu'), 2000);
    } catch (err) {
      console.error(err);
      toast.error('Erreur lors de ajout du document.');
    }
  };

  return (
    <div className="add-doc-container">
      <h1 className="add-doc-title">Ajouter un document</h1>
      <form className="add-doc-form" onSubmit={handleSubmit}>
        <div className="add-doc-field">
          <label className="add-doc-label">Fichier</label>
          <input type="file" className="add-doc-input" onChange={handleFileChange} required />
        </div>
        <div className="add-doc-field">
          <label className="add-doc-label">Titre</label>
          <input type="text" className="add-doc-input" value={title} onChange={e => setTitle(e.target.value)} required />
        </div>
        <div className="add-doc-field">
          <label className="add-doc-label">Niveau</label>
          <select
            className="add-doc-select"
            value={niveauId}
            onChange={e => {
              const sel = niveaux.find(n => n._id === e.target.value);
              setNiveauId(e.target.value);
              setNiveauName(sel?.name || '');
            }}
            required
          >
            {niveaux.map(n => <option key={n._id} value={n._id}>{n.name}</option>)}
          </select>
        </div>
        <div className="add-doc-field">
          <label className="add-doc-label">Module</label>
          <select className="add-doc-select" value={moduleSelection} onChange={e => setModuleSelection(e.target.value)} required>
            <option value="">-- Sélectionner --</option>
            {modules.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
          </select>
        </div>
        <div className="add-doc-field">
          <label className="add-doc-label">Catégorie</label>
          <select className="add-doc-select" value={categorie} onChange={e => setCategorie(e.target.value)} required>
            <option value="">-- Sélectionner --</option>
            {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </div>
        <button type="submit" className="add-doc-button">Ajouter</button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default AddDocument;
