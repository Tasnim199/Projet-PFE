
// src/components/ManageDocuments.jsx
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import TeacherNavbar from './TeacherNavbar';
import TeacherSidebar from './TeacherSidebar';
import ModalWrapper from './ModalWrapper';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ManageDocuments.css';
import { SearchContext } from '../SearchContext';

const ManageDocuments = () => {
  const { searchQuery } = useContext(SearchContext);
  const [documents, setDocuments] = useState([]);
  const [teacherId, setTeacherId] = useState('');
  const [levels, setLevels] = useState([]);
  const [modules, setModules] = useState([]);
  const [categories, setCategories] = useState([]);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [docToDelete, setDocToDelete] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    levelId: '',
    moduleId: '',
    categoryId: '',
    file: null,
  });

  // 1. Récupère teacherId
  useEffect(() => {
    const stored = localStorage.getItem('teacher');
    if (stored && stored !== 'undefined') {
      try {
        const t = JSON.parse(stored);
        if (t._id) setTeacherId(t._id);
      } catch {}
    }
  }, []);

  // 2. Récupère documents
  useEffect(() => {
    if (!teacherId) return;
    axios.get(`http://localhost:5000/contents/enseignant/${teacherId}`)
      .then(res => setDocuments(res.data))
      .catch(console.error);
  }, [teacherId]);

  // 3. Récupère niveaux
  useEffect(() => {
    axios.get('http://localhost:5000/level')
      .then(res => setLevels(res.data))
      .catch(console.error);
  }, []);

  // 4. Récupère modules et catégories selon le nom du niveau
  useEffect(() => {
    if (!formData.levelId || !levels.length) return;
    const lvl = levels.find(l => l._id === formData.levelId);
    if (!lvl) return;

    // fetch modules by level name
    axios.get(`http://localhost:5000/module/modules/level/${lvl.name}`)
      .then(res => setModules(res.data))
      .catch(console.error);

    // fetch categories by level id
    axios.get(`http://localhost:5000/categories/par-niveau/${formData.levelId}`)
      .then(res => setCategories(res.data))
      .catch(console.error);
  }, [formData.levelId, levels]);

  const handleChange = e => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value,
      ...(name === 'levelId' ? { moduleId: '', categoryId: '' } : {})
    }));
  };

  const handleEdit = doc => {
    setSelectedDoc(doc);
    setFormData({
      title: doc.title,
      levelId: doc.levelId._id,
      moduleId: doc.moduleId._id,
      categoryId: doc.categoryId._id,
      file: null
    });
    setShowEditModal(true);
  };

  const handleSubmit = e => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([k, v]) => {
      if (v != null) data.append(k, v);
    });
    axios.put(
      `http://localhost:5000/contents/modifier-document/${selectedDoc._id}`,
      data
    )
      .then(() => axios.get(`http://localhost:5000/contents/enseignant/${teacherId}`))
      .then(res => {
        setDocuments(res.data);
        toast.success('Document modifié !');
        setShowEditModal(false);
      })
      .catch(() => toast.error('Erreur modification'));
  };

  const confirmDelete = id => {
    setDocToDelete(id);
    setShowDeleteModal(true);
  };

  const handleConfirmedDelete = () => {
    axios
      .delete(`http://localhost:5000/contents/supprimer-document/${docToDelete}`)
      .then(() => {
        setDocuments(prev => prev.filter(d => d._id !== docToDelete));
        toast.success('Document supprimé !');
      })
      .catch(() => toast.error('Erreur suppression'))
      .finally(() => setShowDeleteModal(false));
  };

  return (
    <>
      <TeacherNavbar />
      <div className="teacher-page-container">
        <TeacherSidebar />
        <div className="teacher-content">
          <h2 className="section-title">Gérer les Documents</h2>

          <div className="docs-grid">
            {documents
              .filter(doc =>
                `${doc.title} ${doc.levelId?.name || ''} ${doc.moduleId?.name || ''}`
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase())
              )
              .map(doc => (
                <div key={doc._id} className="doc-card">
                  <div className="doc-info">
                    <h4>{doc.title}</h4>
                    <p>Niveau: {doc.levelId?.name}</p>
                    <p>Module: {doc.moduleId?.name}</p>
                    <p>Catégorie: {doc.categoryId?.name}</p>
                  </div>
                  <div className="doc-actions">
                    <Button className='action-btn'
                      variant="info"
                      onClick={() =>
                        window.open(`http://localhost:5000/${doc.file}`, '_blank')
                      }
                    >
                      Consulter
                    </Button>
                    <Button className='action-btn'
                      variant="warning"
                      onClick={() => handleEdit(doc)}
                    >
                      Modifier
                    </Button>
                    <Button className='action-btn'
                      variant="danger"
                      onClick={() => confirmDelete(doc._id)}
                    >
                      Supprimer
                    </Button>
                  </div>
                </div>
              ))}
          </div>

          {/* Edit Modal */}
          <ModalWrapper
            isOpen={showEditModal}
            onRequestClose={() => setShowEditModal(false)}
          >
            <div className="modal-header">
              <h5 className="modal-title">Modifier Document</h5>
              <button
                className="btn-close"
                onClick={() => setShowEditModal(false)}
              />
            </div>
            <form
              onSubmit={handleSubmit}
              encType="multipart/form-data"
            >
              <div className="modal-body">
                <Form.Group>
                  <Form.Label>Titre</Form.Label>
                  <Form.Control
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Niveau</Form.Label>
                  <Form.Select
                    name="levelId"
                    value={formData.levelId}
                    onChange={handleChange}
                  >
                    <option value="">-- Choisir --</option>
                    {levels.map(lvl => (
                      <option key={lvl._id} value={lvl._id}>
                        {lvl.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Module</Form.Label>
                  <Form.Select
                    name="moduleId"
                    value={formData.moduleId}
                    onChange={handleChange}
                  >
                    <option value="">-- Choisir --</option>
                    {modules.map(mod => (
                      <option key={mod._id} value={mod._id}>
                        {mod.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Catégorie</Form.Label>
                  <Form.Select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                  >
                    <option value="">-- Choisir --</option>
                    {categories.map(cat => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Remplacer le fichier</Form.Label>
                  <Form.Control
                    type="file"
                    name="file"
                    onChange={handleChange}
                  />
                </Form.Group>
              </div>
              <div className="modal-footer">
                <Button
                  variant="secondary"
                  onClick={() => setShowEditModal(false)}
                >
                  Annuler
                </Button>
                <Button variant="primary" type="submit">
                  Enregistrer
                </Button>
              </div>
            </form>
          </ModalWrapper>

          {/* Delete Modal */}
          <ModalWrapper
            isOpen={showDeleteModal}
            onRequestClose={() => setShowDeleteModal(false)}
          >
            <div className="modal-header">
              <h5 className="modal-title">Confirmer</h5>
              <button
                className="btn-close"
                onClick={() => setShowDeleteModal(false)}
              />
            </div>
            <div className="modal-body">
              Voulez-vous vraiment supprimer ce document ?
            </div>
            <div className="modal-footer">
              <Button
                variant="secondary"
                onClick={() => setShowDeleteModal(false)}
              >
                Non
              </Button>
              <Button
                variant="danger"
                onClick={handleConfirmedDelete}
              >
                Oui
              </Button>
            </div>
          </ModalWrapper>

          <ToastContainer position="bottom-right" />
        </div>
      </div>
    </>
  );
};

export default ManageDocuments;

