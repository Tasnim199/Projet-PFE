import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar'; 
import DashboardCard from './DashboardCard'; 
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import './Sidebar.css'; 
import './AdminDashboard.css';



ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const AdminDashboard = () => {
  const [visitCount, setVisitCount] = useState(0);
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
   const cnt = Number(localStorage.getItem('siteVisits') || 0);
    setVisitCount(cnt);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('http://localhost:5000/admin/dashboard', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => { setAdminData(res.data); setLoading(false); })
      .catch(() => setLoading(false));
    }
  }, []);

  const chartData = {
    labels: ['Enseignants', 'Utilisateurs', 'Visites', 'Documents', 'Exercices', 'Devoirs'],
    datasets: [
      {
        label: 'Statistiques',
        data: [
          adminData?.teacherCount  || 0,
          adminData?.userCount     || 0,
          adminData?.visitCount    || 0,
          adminData?.documentCount || 0,
          adminData?.exerciseCount || 0,
          adminData?.homeworkCount || 0,
        ],
        backgroundColor: [
          '#FFC107', '#FF7043',
          '#FFC107', '#FF7043',
          '#FFC107', '#FF7043'
        ],
        hoverBackgroundColor: [
          '#FFA000', '#E64A19',
          '#FFA000', '#E64A19',
          '#FFA000', '#E64A19'
        ],
        borderColor: 'rgba(234, 236, 244, 1)',
        borderWidth: 1,
        borderRadius: 10,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1, color: '#6c757d' },
        grid:  { color: '#e5e5e5' },
      },
      x: {
        ticks: { color: '#6c757d' },
        grid:  { display: false },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#fff',
        titleColor: '#333',
        bodyColor: '#666',
        borderColor: '#ccc',
        borderWidth: 1,
      },
    },
  };

  return (
    <div className="admin-dashboard">
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <div className="admin-dashboard-container">
          <Sidebar />
          <div className="admin-dashboard-content">
            <div className="admin-dashboard-cards">
              <DashboardCard title="Nombre d'élèves" value={adminData?.userCount} />
              <DashboardCard title="Nombre d'enseignants" value={adminData?.teacherCount} />
              <DashboardCard title="Nombre de documents"  value={adminData?.documentCount} />
              <DashboardCard title="Nombre d'exercices"   value={adminData?.exerciseCount} />
              <DashboardCard title="Nombre de devoirs"     value={adminData?.homeworkCount} />
              <DashboardCard title="Nombre de visites"     value={visitCount} />
            </div>
            <div className="chart-container">
              <h3>Statistiques Globales</h3>
              <div className="chart"><Bar data={chartData} options={chartOptions} /></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;






