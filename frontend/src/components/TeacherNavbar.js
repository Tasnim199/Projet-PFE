import React, { useState, useRef, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaBell, FaSearch, FaSignOutAlt } from 'react-icons/fa';
import { TeacherNotificationContext } from '../TeacherNotificationContext';
import { SearchContext } from '../SearchContext';
import './TeacherNavbar.css';

export default function TeacherNavbar() {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [teacherName, setTeacherName] = useState({ firstName: '', lastName: '' });
  const fileInputRef = useRef(null);
  const { searchQuery, setSearchQuery } = useContext(SearchContext);
  const navigate = useNavigate();

  const { notifications, markAllRead } = useContext(TeacherNotificationContext);
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleToggleNotif = () => {
    if (!isNotifOpen && unreadCount > 0) markAllRead();
    setIsNotifOpen(open => !open);
  };

  const handleLogout = () => { localStorage.removeItem('token'); navigate('/teacher/login'); };
  const pickAvatar = () => fileInputRef.current.click();
  const onFileChange = e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => { setAvatarUrl(reader.result); localStorage.setItem('teacherAvatarUrl', reader.result); };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem('teacherAvatarUrl');
    if (saved && !saved.startsWith('blob:')) setAvatarUrl(saved);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem('teacher');
    if (stored) {
      const { _id } = JSON.parse(stored);
      axios.get(`http://localhost:5000/api/teachers/${_id}`)
        .then(res => setTeacherName({ firstName: res.data.prenom, lastName: res.data.name }))
        .catch(() => {});
    }
  }, []);

  return (
    <nav className="teacher-navbar">
      <div className="navbar-left">
        <span className="navbar-title">Tableau de bord</span>
        <div className="search-container"><FaSearch className="search-icon" /><input
  className="teacher-navbar-search"
  placeholder="Rechercher..."
  value={searchQuery}
  onChange={e => setSearchQuery(e.target.value)}
/></div>
      </div>

      <div className="navbar-right">
        <div className="notif-container">
          <FaBell className="bell-icon" onClick={handleToggleNotif}/>
          {unreadCount>0 && <span className="notif-badge">{unreadCount}</span>}
          {isNotifOpen && (
            <div className="notif-dropdown">
              <div className="notif-header">Notifications</div>
              <ul>
                {notifications.map(n=> <li key={n.id} style={{fontWeight: n.read? 'normal':'bold'}}>{n.text}</li>)}
                {notifications.length===0 && <li>Aucune notification</li>}
              </ul>
            </div>
          )}
        </div>

        <div className="avatar-section">
          <input type="file" ref={fileInputRef} accept="image/*" onChange={onFileChange} className="avatar-input"/>
          <div className="avatar-wrapper" onClick={pickAvatar}>
            {avatarUrl? <img src={avatarUrl} className="avatar-img" alt="avatar"/> : <div className="avatar-placeholder">+</div>}
          </div>
          <div className="admin-name-logout"><span className="admin-name">{teacherName.firstName} {teacherName.lastName}</span><FaSignOutAlt className="logout-icon" onClick={handleLogout} title="Se déconnecter"/></div>
        </div>
      </div>
    </nav>
  );
}