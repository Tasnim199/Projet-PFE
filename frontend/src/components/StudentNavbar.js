import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaBell, FaSearch, FaSignOutAlt } from "react-icons/fa";
import { StudentNotificationContext } from '../StudentNotificationContext';
import { SearchContext } from '../SearchContext';
import './StudentNavbar.css';

export default function StudentNavbar() {
  const [notifOpen, setNotifOpen] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [studentName, setStudentName] = useState({ firstName: "", lastName: "" });
  const { searchQuery, setSearchQuery } = useContext(SearchContext);
  const fileInput = useRef(null);
  const navigate  = useNavigate();

  // Notifications du contexte
  const { notifications = [], loading, markAllRead } = useContext(StudentNotificationContext);
  const unreadCount = notifications.filter(n => !n.read).length;

  // Avatar
  useEffect(() => {
    const saved = localStorage.getItem("studentAvatar");
    if (saved && !saved.startsWith("blob:")) setAvatar(saved);
  }, []);

  // Nom étu
  useEffect(() => {
    const stored = localStorage.getItem("student");
    if (stored) {
      const { firstName, lastName } = JSON.parse(stored);
      setStudentName({ firstName, lastName });
    }
  }, []);

  const toggleNotif = () => {
    if (!notifOpen && unreadCount > 0) markAllRead();
    setNotifOpen(o => !o);
  };
  const handleLogout = () => { 
    localStorage.removeItem('studentToken');
    localStorage.removeItem('student');
    navigate('/student-login');
  };
  const pickAvatar = () => fileInput.current.click();
  const onFileChange = e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => { 
        setAvatar(reader.result);
        localStorage.setItem('studentAvatar', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <nav className="student-navbar">
      <div className="student-navbar-left">
        <span className="student-navbar-title">Espace Élève</span>
        <div className="student-search-container">
          <FaSearch className="student-search-icon" />
          <input
  className="student-navbar-search"
  placeholder="Rechercher..."
  value={searchQuery}
  onChange={e => setSearchQuery(e.target.value)}
/>
        </div>
      </div>

      <div className="student-navbar-right">
        <div className="student-notif-container">
          <FaBell className="student-bell-icon" onClick={toggleNotif} />
          {unreadCount > 0 && <span className="student-notif-badge">{unreadCount}</span>}
          {notifOpen && (
            <div className="student-notif-dropdown">
              <ul>
                {!loading && notifications.length === 0 && <li>Aucune notification</li>}
                {notifications.map(n => (
                  <li
                    key={n.id}
                    style={{
                      fontWeight: n.read ? 'normal' : 'bold',
                      opacity:    n.read ? 0.6      : 1
                    }}
                  >
                    {n.text}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="student-avatar-section">
          <input type="file" ref={fileInput} accept="image/*"
                 onChange={onFileChange} className="student-avatar-input" />
          <div className="student-avatar-wrapper" onClick={pickAvatar}>
            {avatar
              ? <img src={avatar} className="student-avatar-img" alt="Avatar" />
              : <div className="student-avatar-placeholder">+</div>
            }
          </div>
          <div className="student-name-logout">
            <span className="student-name-text">
              {studentName.firstName} {studentName.lastName}
            </span>
            <FaSignOutAlt className="student-logout-icon"
                         onClick={handleLogout}
                         title="Déconnexion" />
          </div>
        </div>
      </div>
    </nav>
  );
}
