import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar'; 
//import DashboardCard from './DashboardCard'; 
import { Bar } from 'react-chartjs-2'; // Import de Chart.js
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import './Sidebar.css'; 

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const AdminDashboard = () => {
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
  
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('http://localhost:5000/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
        .then((response) => {
          setAdminData(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Erreur lors de la récupération des données du tableau de bord:", error);
          setLoading(false);
        });
    }
  }, []);

  // Données pour le graphique
  const chartData = {
    labels: ['Enseignants', 'Utilisateurs', 'Visites'], // Labels pour les barres
    datasets: [
      {
        label: 'Statistiques',
        data: [
          adminData?.teacherCount || 50, // Données des enseignants
          adminData?.userCount || 100, // Données des utilisateurs
          adminData?.visitCount || 200, // Données des visites
        ],
        backgroundColor: ['#4E73DF', '#1CC88A', '#36B9CC'], // Couleurs des barres
        hoverBackgroundColor: ['#2e59d9', '#17a673', '#2c9faf'],
        borderColor: 'rgba(234, 236, 244, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="admin-dashboard">
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <>
          <div className="dashboard-container">
            <Sidebar /> {/* Sidebar avec les liens vers les différentes sections */}

            <div className="dashboard-content">
            <div className="dashboard-cards">
    <div className="dashboard-card">
      <h4>Nombre d'utilisateurs</h4>
      <p className="value">100</p>
    </div>
    <div className="dashboard-card">
      <h4>Nombre d'enseignants</h4>
      <p className="value">50</p>
    </div>
  </div>
              <div className="chart-container">
                <h3>Statistiques Globales</h3>
                <div className="chart">
                  <Bar data={chartData} options={chartOptions} />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;





