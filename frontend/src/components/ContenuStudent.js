// src/components/ContenuStudent.jsx
import React, { useEffect, useState, useContext } from 'react';
import { useOutletContext } from 'react-router-dom';
import axios from 'axios';
import './ContenuStudent.css';
import { SearchContext } from '../SearchContext';

export default function ContenuStudent() {
  const { student } = useOutletContext();
  const [documents, setDocuments] = useState([]);
  const [modules, setModules] = useState([]);
  
  // recherche locale
  const [searchTerm, setSearchTerm] = useState('');
  // sélection de module
  const [selectedModule, setSelectedModule] = useState('');
  // modal PDF
  const [showModal, setShowModal] = useState(false);
  const [modalFileUrl, setModalFileUrl] = useState('');

  // recherche globale depuis la Navbar
  const { searchQuery } = useContext(SearchContext);

  useEffect(() => {
    if (!student) return;

    // charger les documents du niveau de l'élève
    axios.get('http://localhost:5000/contents')
      .then(res => {
        const filteredDocs = res.data.filter(doc =>
          doc.levelId && doc.levelId._id === student.level._id
        );
        setDocuments(filteredDocs);
      })
      .catch(err => console.error('Erreur chargement documents', err));

    // charger la liste des modules
    axios.get('http://localhost:5000/module/modules')
      .then(res => setModules(res.data))
      .catch(err => console.error('Erreur chargement modules', err));
  }, [student]);

  if (!student) return <div className="loading">Chargement…</div>;

  // on combine : 
  // – correspondance avec searchQuery (Navbar) 
  // – ET correspondance avec searchTerm (locale) 
  // – ET filtre module
  const filteredDocuments = documents.filter(doc => {
    const text = `${doc.title} ${doc.moduleId?.name || ''}`.toLowerCase();

    const matchesGlobal = text.includes(searchQuery.toLowerCase());
    const matchesLocal  = text.includes(searchTerm.toLowerCase());
    const matchesModule = selectedModule 
      ? doc.moduleId?._id === selectedModule 
      : true;

    return matchesGlobal && matchesLocal && matchesModule;
  });

  const openInModal = fileName => {
    const url = `http://localhost:5000/${fileName.replace("\\", "/")}#view=fitH`;
    setModalFileUrl(url);
    setShowModal(true);
  };

  const handleDownload = async fileName => {
    try {
      const url = `http://localhost:5000/${fileName.replace("\\", "/")}`;
      const res = await fetch(url);
      const blob = await res.blob();
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = fileName.split('\\').pop();
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(link.href);
      document.body.removeChild(link);
    } catch (err) {
      console.error('Erreur téléchargement', err);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setModalFileUrl('');
  };

  return (
    <div className="contenu-container">
      <h2 className="main-title">Documents disponibles pour {student.firstName}</h2>

      <div className="filters-container">
        {/* Recherche locale */}
        <input
          type="text"
          placeholder="Rechercher un document..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="search-input"
        />

        {/* Filtre par module */}
        <select
          value={selectedModule}
          onChange={e => setSelectedModule(e.target.value)}
          className="module-select"
        >
          <option value="">Tous les modules</option>
          {modules.map(mod => (
            <option key={mod._id} value={mod._id}>
              {mod.name}
            </option>
          ))}
        </select>
      </div>

      <div className="documents-list">
        {filteredDocuments.length === 0 && (
          <p className="no-documents">
            {selectedModule
              ? 'Aucun document pour ce module.'
              : 'Aucun document disponible.'}
          </p>
        )}
        {filteredDocuments.map(doc => (
          <div key={doc._id} className="document-card">
            <div className="document-info">
              <h3 className="document-title">{doc.title}</h3>
              <p className="document-module">
                Module : {doc.moduleId?.name || 'Non spécifié'}
              </p>
              <p className="document-teacher">
                Ajouté par : {doc.teacherId
                  ? `${doc.teacherId.name} ${doc.teacherId.prenom}`
                  : 'Inconnu'}
              </p>
            </div>
            <div className="document-actions">
              <button
                className="consult-button"
                onClick={() => {
                  const url = `http://localhost:5000/${doc.file.replace("\\", "/")}#view=fitH`;
                  window.open(url, '_blank');
                }}
              >
                Consulter
              </button>
              <button
                className="download-button"
                onClick={() => handleDownload(doc.file)}
              >
                Télécharger
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="pdf-modal-backdrop">
          <div className="pdf-modal-container">
            <div className="pdf-modal-header">
              <h2 className="pdf-modal-title">{modalFileUrl.split('/').pop()}</h2>
              <button onClick={closeModal} className="pdf-modal-close">
                ✕
              </button>
            </div>
            <div className="pdf-modal-content">
              <iframe src={modalFileUrl} title="Document" className="pdf-iframe" />
            </div>
            <div className="pdf-modal-footer">
              <button
                className="download-button"
                onClick={() => handleDownload(modalFileUrl.split('/').pop())}
              >
                Télécharger
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
