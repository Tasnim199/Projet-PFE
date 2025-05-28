import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TeacherSidebar from './TeacherSidebar';
import TeacherNavbar from './TeacherNavbar';
import ModalWrapper from './ModalWrapper';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './EditProfTeacher.css';

export default function TeacherProfile() {
  const [teacher, setTeacher] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '', prenom: '', email: '',
    schoolName: '', city: '', phone: '',
    password: '', newPassword: '', confirmPassword: ''
  });

  useEffect(() => {
    const stored = localStorage.getItem('teacher');
    if (stored) {
      const { _id } = JSON.parse(stored);
      axios.get(`http://localhost:5000/api/teachers/${_id}`)
        .then(res => {
          setTeacher(res.data);
          setFormData({
            name: res.data.name || '',
            prenom: res.data.prenom || '',
            email: res.data.email || '',
            schoolName: res.data.schoolName || '',
            city: res.data.city || '',
            phone: res.data.phone || '',
            password: '', newPassword: '', confirmPassword: ''
          });
        })
        .catch(console.error);
    }
  }, []);

  const handleChange = e =>
    setFormData(fd => ({ ...fd, [e.target.name]: e.target.value }));

  const handleUpdate = async () => {
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas.');
      return;
    }
    try {
      const updated = {
        name: formData.name,
        prenom: formData.prenom,
        email: formData.email,
        schoolName: formData.schoolName,
        city: formData.city,
        phone: formData.phone
      };
      if (formData.newPassword) {
        updated.password = formData.password;
        updated.newPassword = formData.newPassword;
      }
      const token = localStorage.getItem('token');
      const res = await axios.put(
        `http://localhost:5000/api/teachers/modifier/${teacher._id}`,
        updated,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTeacher(res.data);
      toast.success('Profil mis à jour !');
      setShowModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de la mise à jour.');
    }
  };

  if (!teacher) return <p className="loading">Chargement du profil…</p>;

  return (
    <div className="teacher-page-container">
      <TeacherNavbar />
      <TeacherSidebar />
      <div className="teacher-cont-content">
        <h2 className="page-title">Mon Profil</h2>

        <div className="profile-card">
          {[
            { label: 'Nom', key: 'name' },
            { label: 'Prénom', key: 'prenom' },
            { label: 'Email', key: 'email' },
            { label: 'École', key: 'schoolName' },
            { label: 'Ville', key: 'city' },
            { label: 'Téléphone', key: 'phone', prefix: '+216 ' }
          ].map(({ label, key, prefix }) => (
            <div className="field" key={key}>
              <span className="label">{label}</span>
              <span className="value">{prefix || ''}{teacher[key]}</span>
            </div>
          ))}
          <Button className="btn-modif" variant="warning" onClick={() => setShowModal(true)}>
            Modifier
          </Button>
        </div>

        <ToastContainer position="bottom-right" />

        <ModalWrapper
          isOpen={showModal}
          onRequestClose={() => setShowModal(false)}
          className="ReactModal__Content custom-modal-dialog"
          overlayClassName="ReactModal__Overlay"
        >
          <div className="custom-modal-header">
            <h5 className="modal-title">Modifier le Profil</h5>
            <button className="btn-close" onClick={() => setShowModal(false)}>
              ×
            </button>
          </div>
          <div className="custom-modal-body">
            <Form>
              {['name', 'prenom', 'email', 'schoolName', 'city', 'phone'].map(field => (
                <Form.Group key={field} className="mb-3">
                  <Form.Label>
                    {field === 'name' ? 'Nom':
                    field === 'prenom' ? 'Prénom'
                      : field === 'schoolName' ? 'École'
                      : field === 'city' ? 'Ville'
                      : field === 'phone' ? 'Téléphone (+216)'
                      : field.charAt(0).toUpperCase() + field.slice(1)}
                  </Form.Label>
                  <Form.Control
                    type={field === 'email' ? 'email' : 'text'}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                  />
                </Form.Group>
              ))}
              {['password', 'newPassword', 'confirmPassword'].map(field => (
                <Form.Group key={field} className="mb-3">
                  <Form.Label>
                    {field === 'password' ? 'Mot de passe actuel'
                      : field === 'newPassword' ? 'Nouveau mot de passe'
                      : 'Confirmer le mot de passe'}
                  </Form.Label>
                  <Form.Control
                    type="password"
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                  />
                </Form.Group>
              ))}
            </Form>
          </div>
          <div className="custom-modal-footer">
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Annuler
            </Button>
            <Button variant="success" onClick={handleUpdate}>
              Enregistrer
            </Button>
          </div>
        </ModalWrapper>
      </div>
    </div>
  );
}
