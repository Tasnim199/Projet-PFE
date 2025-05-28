import React, { useEffect, useState } from 'react';
import axios from 'axios';
import StudentNavbar from '../components/StudentNavbar';
import StudentSidebar from '../components/StudentSidebar';
import './Dashboard.css';
import { Outlet, useNavigate } from 'react-router-dom';

export default function StudentDashboard() {
  const [student, setStudent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('studentToken');
    if (!token) return navigate('/student-login');

    axios.get('http://localhost:5000/api/students/profile', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setStudent(res.data))
      .catch(() => navigate('/student-login'));
  }, [navigate]);

  if (!student) return <div className="loading">Chargement…</div>;

  return (
    <div
      style={{
        backgroundImage: 'url("/bgstudent.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        overflow: 'hidden'
      }}
    >
      <StudentNavbar />
      <StudentSidebar />
      <main style={{ flex: 1, padding: '20px', color: '#fff', marginTop: '64px' }}>
        <header>
        
        </header>
        <section>
          <Outlet context={{ student, setStudent }} />
        </section>
      </main>
    </div>
  );
}
