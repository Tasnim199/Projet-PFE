import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import './Categories.css';
import { SearchContext } from '../SearchContext';

const Categories = () => {
  const [levels, setLevels] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [message, setMessage] = useState('');
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [editedName, setEditedName] = useState('');
  const token = localStorage.getItem('token');
  const { searchQuery } = useContext(SearchContext);
  const q = searchQuery.trim().toLowerCase();

  useEffect(() => {
    fetchLevels();
    fetchCategories();
  }, []);

  const fetchLevels = async () => {
    try {
      const res = await axios.get('http://localhost:5000/level', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLevels(res.data);
    } catch (err) {
      console.error('Erreur fetch levels :', err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get('http://localhost:5000/categories', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(res.data);
    } catch (err) {
      console.error('Erreur fetch categories :', err);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory || !selectedLevel) return;
    try {
      const response = await axios.post(
        'http://localhost:5000/categories',
        { name: newCategory, level: selectedLevel },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCategories([...categories, response.data]);
      setMessage('✅ Catégorie ajoutée');
      setNewCategory('');
      setSelectedLevel('');
    } catch {
      setMessage("❌ Erreur lors de l'ajout");
    } finally {
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleDelete = async id => {
    if (!window.confirm('Supprimer cette catégorie ?')) return;
    try {
      await axios.delete(`http://localhost:5000/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(categories.filter(cat => cat._id !== id));
      setMessage('🗑️ Catégorie supprimée');
    } catch (err) {
      console.error('Erreur DELETE:', err);
      setMessage("❌ Erreur lors de la suppression");
    } finally {
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleEdit = cat => {
    setEditCategoryId(cat._id);
    setEditedName(cat.name);
  };

  const handleUpdate = async id => {
    try {
      await axios.put(
        `http://localhost:5000/categories/${id}`,
        { name: editedName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCategories(categories.map(cat =>
        cat._id === id ? { ...cat, name: editedName } : cat
      ));
      setEditCategoryId(null);
      setMessage('✏️ Catégorie modifiée');
    } catch (err) {
      console.error('Erreur PUT:', err);
      setMessage("❌ Erreur lors de la modification");
    } finally {
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="categories-page">
      <Sidebar />
      <div className="categories-content">
        <h2>Gérer les Catégories</h2>
        
        {message && (
          <div className={`categories-popup ${message.includes('❌') ? 'error' : ''}`}>
            {message}
          </div>
        )}

        <div className="categories-form-section">
          <select
            value={selectedLevel}
            onChange={e => setSelectedLevel(e.target.value)}
          >
            <option value="">-- Choisir un niveau --</option>
            {levels.map(lvl => (
              <option key={lvl._id} value={lvl._id}>{lvl.name}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Nom de la catégorie"
            value={newCategory}
            onChange={e => setNewCategory(e.target.value)}
          />
          <button onClick={handleAddCategory}>Ajouter</button>
        </div>

        <div className="categories-levels-grid">
          {levels.map(lvl => {
            const catsForLevel = categories.filter(cat => (
              (cat.level && typeof cat.level === 'object'
                ? cat.level._id
                : cat.level
              ) === lvl._id
            ));
            const visibleCats = catsForLevel.filter(cat =>
              lvl.name.toLowerCase().includes(q) ||
              cat.name.toLowerCase().includes(q)
            );
            if (visibleCats.length === 0) return null;
            return (
              <div key={lvl._id} className="categories-level-card">
                <div className="categories-level-card-header">
                  <h3>{lvl.name}</h3>
                </div>
                <div className="categories-level-card-body">
                  <ul className="categories-category-list">
                    {visibleCats.map(cat => (
                      <li key={cat._id} className="categories-category-item">
                        {editCategoryId === cat._id ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <input
                              type="text"
                              value={editedName}
                              onChange={e => setEditedName(e.target.value)}
                            />
                            <button
                              className="categories-btn-edit"
                              onClick={() => handleUpdate(cat._id)}
                            >
                              ✅
                            </button>
                          </div>
                        ) : (
                          <>
                            <span className="categories-category-name">{cat.name}</span>
                            <div className="categories-category-actions">
                              <button
                                className="categories-btn-edit"
                                onClick={() => handleEdit(cat)}
                              >
                                ✏️
                              </button>
                              <button
                                className="categories-btn-delete"
                                onClick={() => handleDelete(cat._id)}
                              >
                                🗑️
                              </button>
                            </div>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Categories;