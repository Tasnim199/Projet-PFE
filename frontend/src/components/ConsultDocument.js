import React, { useEffect, useState , useContext} from 'react';
import axios from 'axios';
import TeacherNavbar from './TeacherNavbar';
import TeacherSidebar from './TeacherSidebar';
import Button from 'react-bootstrap/Button';
import './ConsulterDocuments.css';
import { SearchContext } from '../SearchContext'; 

const ConsulterDocuments = ({ onRefresh = () => {} }) => {
  const [documents, setDocuments] = useState([]);
  const { searchQuery } = useContext(SearchContext); 
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await axios.get('http://localhost:5000/contents/tous-les-documents');
        setDocuments(res.data);
      } catch (err) {
        console.error('Erreur récupération documents :', err);
      }
    };
    fetchAll();
  }, []);
  const filteredDocuments = documents.filter(doc => {
    const text = `
      ${doc.title}
      ${doc.levelId?.name || ''}
      ${doc.moduleId?.name || ''}
      ${doc.categoryId?.name || ''}
      ${doc.teacherId?.fullName || ''}
    `.toLowerCase();
    return text.includes(searchQuery.toLowerCase());
  });
  const handleConsult = async (doc) => {
    try {
      await axios.get(`http://localhost:5000/contents/${doc._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('teacherToken')}` }
      });
      window.open(`http://localhost:5000/${doc.file}`, '_blank');
      onRefresh();
    } catch (err) {
      console.error('Erreur:', err.response?.data || err.message);
    }
  };

  return (
    <>
      <TeacherNavbar />
      <div className="teacher-page-container">
        <TeacherSidebar />
        <div className="teacher-content consult-docs-wrapper">
          <h2 className="section-title">Consulter les Documents</h2>
          {filteredDocuments.length === 0 ? (
            <p>Aucun document disponible pour le moment.</p>
          ) : (
            <div className="docs-list">
              {filteredDocuments.map(doc => (
                <div key={doc._id} className="doc-item">
                  <h4>{doc.title}</h4>
                  <p>Niveau : {doc.levelId?.name}</p>
                  <p>Module : {doc.moduleId?.name}</p>
                  <p>Catégorie : {doc.categoryId?.name}</p>
                  <p>Proposé par : {doc.teacherId?.name} {doc.teacherId?.prenom || 'Inconnu'}</p>
                  <Button className="btn-consult" onClick={() => handleConsult(doc)}>
                    Consulter
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ConsulterDocuments;
