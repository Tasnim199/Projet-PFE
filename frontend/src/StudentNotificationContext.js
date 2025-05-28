import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const StudentNotificationContext = createContext();

export function StudentNotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('studentToken');

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(
        'http://localhost:5000/api/notifications/student',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.data?.success || !Array.isArray(res.data.data)) {
        throw new Error('Format de réponse invalide');
      }
      const formattedNotifs = res.data.data.map(n => ({
        id: n._id,
        text: `${new Date(n.createdAt).toLocaleTimeString('fr-FR')} — ${n.text}`,
        read: n.read,
        _raw: n
      }));
      setNotifications(formattedNotifs);
    } catch (err) {
      console.error('Erreur notifications:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => {
      clearInterval(interval);
      setNotifications([]);
    };
  }, [token]);

  const markAllRead = async () => {
    try {
      await axios.post(
        'http://localhost:5000/api/notifications/student/mark-read',
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications(prev =>
        prev.map(n => ({ ...n, read: true }))
      );
    } catch (err) {
      console.error('Erreur marquage lu:', err.response?.data || err.message);
    }
  };

  return (
    <StudentNotificationContext.Provider value={{
      notifications,
      loading,
      markAllRead
    }}>
      {children}
    </StudentNotificationContext.Provider>
  );
}
