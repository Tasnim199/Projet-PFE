import React, { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaBell, FaSearch, FaChevronDown } from "react-icons/fa";
import "./Navbar.css";
import { NotificationContext } from '../NotificationContext';
import { SearchContext } from '../SearchContext';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const { searchQuery, setSearchQuery } = useContext(SearchContext);
  const [adminName, setAdminName] = useState({ 
    firstName: "", 
    lastName: "" 
  });
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Context des notifications
  const { notifications, markAllRead } = useContext(NotificationContext);
  console.log("🟡 Notifications dans Navbar :", notifications);
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotifToggle = () => {
    const willOpen = !isNotifOpen;
    setIsNotifOpen(willOpen);
    if (willOpen) markAllRead();
  };

  useEffect(() => {
    const savedAvatar = localStorage.getItem("adminAvatarUrl");
    if (savedAvatar && !savedAvatar.startsWith("blob:")) {
      setAvatarUrl(savedAvatar);
    } else {
      localStorage.removeItem("avatarUrl");
    }
  }, []);

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/admin/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data.firstName && response.data.lastName) {
          setAdminName({
            firstName: response.data.firstName,
            lastName: response.data.lastName
          });
        } else if (response.data.name) {
          const [firstName, ...rest] = response.data.name.split(" ");
          setAdminName({ 
            firstName, 
            lastName: rest.join(" ") 
          });
        }
      } catch (error) {
        console.error("Erreur chargement profil admin:", error);
      }
    };
    fetchAdminProfile();
  }, []);

  const handleMenuToggle = () => setIsMenuOpen(!isMenuOpen);
  
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleAvatarClick = () => fileInputRef.current.click();

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result);
        localStorage.setItem("adminAvatarUrl", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <span className="navbar-title">Dashboard</span>
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Rechercher..."
            className="navbar-search"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="navbar-right">
        {/* Section Notifications */}
        <div className="notif-container">
          <div 
            className="bell-wrapper" 
            onClick={handleNotifToggle}
            role="button"
            tabIndex={0}
          >
            <FaBell className="bell-icon" />
            {unreadCount > 0 && (
              <span className="notif-badge">{unreadCount}</span>
            )}
          </div>
          
          {isNotifOpen && (
            <div className="notif-dropdown">
              <ul>
                {notifications.map(notification => (
                  <li 
                    key={notification.id} 
                    className={notification.read ? "" : "unread"}
                  >
                    {notification.text}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Section Profil */}
        <div className="navbar-avatar">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="avatar-input"
          />
          
          <div 
            className="avatar-wrapper" 
            onClick={handleAvatarClick}
            role="button"
            tabIndex={0}
          >
            {avatarUrl ? (
              <img 
                src={avatarUrl} 
                alt="Avatar admin" 
                className="avatar-img" 
              />
            ) : (
              <div className="avatar-placeholder">+</div>
            )}
          </div>

          <div 
            className="admin-name-dropdown" 
            onClick={handleMenuToggle}
            role="button"
            tabIndex={0}
          >
            <span className="admin-name">
              {adminName.firstName} {adminName.lastName}
            </span>
            <FaChevronDown className="dropdown-arrow" />
          </div>

          {isMenuOpen && (
            <div className="user-menu">
              <ul>
                <li onClick={() => navigate("/edit-profile")}>
                  Modifier le profil
                </li>
                <li onClick={handleLogout}>
                  Se déconnecter
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}