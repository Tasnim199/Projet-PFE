// src/NotificationContext.js
import React, { createContext, useState, useCallback, useEffect } from 'react';
import axios from 'axios';

// Forcer le backend

export const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback(text => {
    const id = Date.now();
    const date = new Date().toLocaleTimeString([], {
  hour:   '2-digit',
  minute: '2-digit'
});
    setNotifications(prev => [{ id, text: `${date} — ${text}`, read: false }, ...prev]);
  }, []);

  // Fonction pour récupérer les notifications du serveur
  const fetchNotifications = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/notifications/admin');
      console.log('Polling notifications:', res.data);
      res.data.forEach(n => {
        // n.text est le texte brut stocké en base
        if (!notifications.find(local => local.text.includes(n.text))) {
          addNotification(n.text);
        }
      });
    } catch (err) {
      console.error('Erreur polling notifications :', err);
    }
  };

  useEffect(() => {
    // fetch initial
    fetchNotifications();
    // ensuite toutes les 5 secondes
    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, [notifications, addNotification]);

  const markAllRead = () => {
    axios.post('http://localhost:5000/api/notifications/mark-read')
      .catch(err => console.error('Erreur mark-read:', err));
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, markAllRead }}>
      {children}
    </NotificationContext.Provider>
  );
}
