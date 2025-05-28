// src/components/Levels.jsx
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import Modal from 'react-modal';
import 'react-toastify/dist/ReactToastify.css';
import './Sidebar.css';
import './ModalStyles.css';
import './Niveau.css';
import { SearchContext } from '../SearchContext';

Modal.setAppElement('#root');

const Levels = () => {
  const [levels, setLevels] = useState([]);
  const [newLevel, setNewLevel] = useState({ name: '', description: '' });
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState(null);

  // recherche globale
  const { searchQuery } = useContext(SearchContext);
  const q = searchQuery.trim().toLowerCase();

  useEffect(() => {
    axios.get('http://localhost:5000/level')
      .then(response => {
        if (Array.isArray(response.data)) {
          setLevels(response.data);
        }
      })
      .catch(err => {
        console.error('Erreur lors du chargement des niveaux:', err);
        toast.error('Impossible de charger les niveaux');
      });
  }, []);

  const normalizeLevelName = name => {
    let n = name.toLowerCase()
      .replace('quatrième année', '4').replace('4ème année', '4')
      .replace('quatrième', '4').replace('4ème', '4')
      .replace('cinquième année', '5').replace('5ème année', '5')
      .replace('cinquième', '5').replace('5ème', '5')
      .replace('sixième année', '6').replace('6ème année', '6')
      .replace('sixième', '6').replace('6ème', '6');
    return n.normalize('NFD').replace(/[\u0300-\u036f]/g, "").trim();
  };

  const addLevel = () => {
    if (!newLevel.name || !newLevel.description) {
      toast.warning('Veuillez entrer un nom et une description');
      return;
    }
    const normalizedName = normalizeLevelName(newLevel.name);
    if (levels.some(lvl => normalizeLevelName(lvl.name) === normalizedName)) {
      toast.warning('Ce niveau existe déjà');
      return;
    }
    axios.post('http://localhost:5000/level/add', newLevel)
      .then(res => {
        setLevels([...levels, res.data]);
        setNewLevel({ name: '', description: '' });
        toast.success('Niveau ajouté avec succès');
      })
      .catch(err => {
        console.error("Erreur lors de l'ajout:", err);
        toast.error("Impossible d'ajouter le niveau");
      });
  };

  const deleteLevel = id => {
    axios.delete(`http://localhost:5000/level/delete/${id}`)
      .then(() => {
        setLevels(levels.filter(lvl => lvl._id !== id));
        toast.info('Niveau supprimé avec succès');
      })
      .catch(err => {
        console.error('Erreur lors de la suppression:', err);
        toast.error('Impossible de supprimer');
      });
  };

  const openModal = lvl => {
    setSelectedLevel(lvl);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleModifyLevel = () => {
    if (!selectedLevel.name || !selectedLevel.description) {
      toast.warning('Veuillez remplir tous les champs');
      return;
    }
    axios.put(`http://localhost:5000/level/edit/${selectedLevel._id}`, selectedLevel)
      .then(() => {
        setLevels(levels.map(lvl =>
          lvl._id === selectedLevel._id ? selectedLevel : lvl
        ));
        toast.success('Niveau modifié avec succès');
        closeModal();
      })
      .catch(err => {
        console.error('Erreur lors de la modification:', err);
        toast.error('Impossible de modifier');
      });
  };

  // on filtre d'abord selon searchQuery sur nom OU description
  const filteredLevels = levels.filter(lvl =>
    lvl.name.toLowerCase().includes(q) ||
    lvl.description.toLowerCase().includes(q)
  );

  return (
    <div className="level-main-content">
      <div className="level-container">
        <h3>Gérer les niveaux</h3>
        <div className="level-form">
          <input
            type="text"
            value={newLevel.name}
            onChange={e => setNewLevel({ ...newLevel, name: e.target.value })}
            placeholder="Nom du niveau"
            className="level-input"
          />
          <input
            type="text"
            value={newLevel.description}
            onChange={e => setNewLevel({ ...newLevel, description: e.target.value })}
            placeholder="Description"
            className="level-input"
          />
          <button onClick={addLevel} className="level-add-btn">Ajouter</button>
        </div>

        <ul className="level-list">
          {filteredLevels.map(lvl => (
            <li key={lvl._id} className="level-item">
              <span className="level-info">
                {lvl.name} - {lvl.description}
              </span>
              <div className="level-actions">
                <button
                  onClick={() => deleteLevel(lvl._id)}
                  className="level-btn-delete"
                >
                  Supprimer
                </button>
                <button
                  onClick={() => openModal(lvl)}
                  className="level-btn-edit"
                >
                  Modifier
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="level-modal"
        overlayClassName="level-modal-overlay"
      >
        <h2>Modifier le niveau</h2>
        <input
          type="text"
          value={selectedLevel?.name || ''}
          onChange={e => setSelectedLevel({ ...selectedLevel, name: e.target.value })}
          className="level-input"
          placeholder="Nom"
        />
        <input
          type="text"
          value={selectedLevel?.description || ''}
          onChange={e => setSelectedLevel({ ...selectedLevel, description: e.target.value })}
          className="level-input"
          placeholder="Description"
        />
        <div className="level-modal-actions">
          <button onClick={handleModifyLevel} className="level-btn-save">
            Enregistrer
          </button>
          <button onClick={closeModal} className="level-btn-cancel">
            Annuler
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Levels;
