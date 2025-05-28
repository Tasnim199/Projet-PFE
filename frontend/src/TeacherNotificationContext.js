import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const TeacherNotificationContext = createContext();

export function TeacherNotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const stored = localStorage.getItem('teacher');
  const currentTeacherId = stored ? JSON.parse(stored)._id : null;
  const token = localStorage.getItem('teacherToken');

  useEffect(() => {
    if (!currentTeacherId || !token) return;

    const formatTime = dateStr =>
      new Date(dateStr).toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
      });

    const fetchNotifications = async () => {
      try {
        const res = await axios.get(
          'http://localhost:5000/api/notifications/teacher',
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const newNotifs = res.data
          .filter(n =>
            (!n.sender || n.sender.toString() !== currentTeacherId) &&
            !n.read
          )
          .map(n => ({
            id:   n._id,
            text: `${formatTime(n.createdAt)} — ${n.text}`,
            read: n.read
          }));

        // Remplacer complètement la liste par les nouvelles non-lues
        setNotifications(newNotifs);
      } catch (err) {
        console.error('Erreur polling notifications teacher :', err);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, [currentTeacherId, token]);

  const markAllRead = async () => {
    try {
      await axios.post(
        'http://localhost:5000/api/notifications/mark-read',
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications([]); // on vide la liste dès qu'on marque tout lu
    } catch (err) {
      console.error('Erreur mark-read teacher :', err);
    }
  };

  return (
    <TeacherNotificationContext.Provider value={{ notifications, markAllRead }}>
      {children}
    </TeacherNotificationContext.Provider>
  );
}
