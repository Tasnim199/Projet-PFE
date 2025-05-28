// src/components/Modules.jsx
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import './Modules.css';
import ModalWrapper from './ModalWrapper';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { SearchContext } from '../SearchContext';

const Modules = () => {
  const [modules, setModules] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [moduleName, setModuleName] = useState('');
  const [moduleLevel, setModuleLevel] = useState('3ème année');
  const [moduleNumber, setModuleNumber] = useState('1');
  const [editModuleId, setEditModuleId] = useState(null);
  const [notification, setNotification] = useState('');
  const [showNotification, setShowNotification] = useState(false);

  const { searchQuery } = useContext(SearchContext);
  const q = searchQuery.trim().toLowerCase();

  const moduleLimits = { "3ème année": 9, "4ème année": 10, "5ème année": 8, "6ème année": 8 };

  useEffect(() => {
    axios.get('http://localhost:5000/module/modules')
      .then(res => setModules(res.data))
      .catch(err => console.error("Erreur récupération modules", err));
  }, []);

  const openModal = () => {
    setShowModal(true);
    setEditModuleId(null);
    setModuleName('');
    setModuleNumber('1');
    setNotification('');
    setShowNotification(false);
  };
  const closeModal = () => setShowModal(false);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!moduleName.trim()) return;

    const num = Number(moduleNumber);
    const lowerName = moduleName.trim().toLowerCase();

    const numberExists = modules.some(m => m.level === moduleLevel && Number(m.number) === num && m._id !== editModuleId);
    const nameExists = modules.some(m => m.level === moduleLevel && m.name.trim().toLowerCase() === lowerName && m._id !== editModuleId);

    if (numberExists) {
      setNotification(`Un module numéro ${moduleNumber} existe déjà pour ${moduleLevel}.`);
      setShowNotification(true);
      return;
    }
    if (nameExists) {
      setNotification(`Le nom "${moduleName}" est déjà utilisé pour ${moduleLevel}.`);
      setShowNotification(true);
      return;
    }

    const data = { level: moduleLevel, number: num, name: moduleName };
    if (editModuleId) {
      await axios.put(`http://localhost:5000/module/modules/${editModuleId}`, data);
      setModules(prev => prev.map(m => m._id === editModuleId ? { ...m, ...data } : m));
    } else {
      const res = await axios.post('http://localhost:5000/module/modules', data);
      setModules(prev => [...prev, res.data]);
    }

    closeModal();
  };

  const handleDelete = id => {
    axios.delete(`http://localhost:5000/module/modules/${id}`)
      .then(() => setModules(prev => prev.filter(m => m._id !== id)))
      .catch(err => console.error("Erreur suppression", err));
  };

  const handleEdit = mod => {
    setEditModuleId(mod._id);
    setModuleLevel(mod.level);
    setModuleNumber(String(mod.number));
    setModuleName(mod.name);
    setShowModal(true);
  };

  return (
    <div className="main-content">
      <h3>Gestion des Modules</h3>
      <Button variant="primary" onClick={openModal}>Ajouter un Module</Button>

      {showNotification && (
        <div className="notification-popup">
          <p>{notification}</p>
          <Button variant="secondary" size="sm" onClick={() => setShowNotification(false)}>Fermer</Button>
        </div>
      )}

      <div className="modules-cards">
        {['3ème année','4ème année','5ème année','6ème année'].map(level => {
          const list = modules.filter(m => m.level === level && (m.name.toLowerCase().includes(q) || String(m.number).includes(q) || level.toLowerCase().includes(q)));
          if (!list.length) return null;
          return (
            <div key={level} className="card">
              <h4>{level}</h4>
              <ul>
                {list.map(m => (
                  <li key={m._id}>
                    <div className="module-info">
                      <span className="module-number">{m.number} - </span>
                      <span className="module-name">{m.name}</span>
                    </div>
                    <div className="module-buttons">
                      <Button size="sm" variant="danger" onClick={() => handleDelete(m._id)}>Supprimer</Button>{' '}
                      <Button size="sm" variant="warning" onClick={() => handleEdit(m)}>Modifier</Button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {showModal && (
        <ModalWrapper isOpen={showModal} onRequestClose={closeModal}>
          <div className="modal-header">
            <h5 className="modal-title">{editModuleId ? 'Modifier Module' : 'Ajouter Module'}</h5>
            <button className="btn-close" onClick={closeModal} />
          </div>
          <div className="modal-body">
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Niveau</Form.Label>
                <Form.Select value={moduleLevel} onChange={e => setModuleLevel(e.target.value)} disabled={!!editModuleId}>
                  {['3ème année','4ème année','5ème année','6ème année'].map(l => <option key={l}>{l}</option>)}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Numéro du Module</Form.Label>
                <Form.Select value={moduleNumber} onChange={e => setModuleNumber(e.target.value)} disabled={!!editModuleId}>
                  {[...Array(moduleLimits[moduleLevel])].map((_, i) => <option key={i+1} value={i+1}>{i+1}</option>)}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Libellé du module</Form.Label>
                <Form.Control type="text" value={moduleName} onChange={e => setModuleName(e.target.value)} required />
              </Form.Group>

              <div className="modal-footer">
                <Button variant="secondary" onClick={closeModal}>Annuler</Button>
                <Button variant="success" type="submit">{editModuleId ? 'Modifier' : 'Ajouter'}</Button>
              </div>
            </Form>
          </div>
        </ModalWrapper>
      )}
    </div>
  );
};

export default Modules;
