// src/App.js
// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css'
import Home from "./components/Home";
import LoginPage from "./components/LoginPage";
import EditProfile from "./components/EditProfile";
import TeacherRegister from './components/TeacherRegister';
import TeacherLogin from './components/TeacherLogin';
import TeacherMenu from "./components/TeacherMenu";
import AddDocument from './components/AddDocument';
import AddExercise from "./components/AddExercise";
import ManageDocument from "./components/ManageDocument";
import ConsultDocument from "./components/ConsultDocument";
import ManageExercice from "./components/ManageExercice";
import ConsultExercice from "./components/ConsultExercice";
import EditProfTeacher from "./components/EditProfTeacher";
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import AdminDashboard from "./components/AdminDashboard";
import Teachers from "./components/TeachersDash";
import Content from "./components/Contenu";
import Levels from "./components/Niveau";
import Categories from "./components/Categories";
import Modules from "./components/Modules";
import StudentLogin from "./components/StudentLogin";
import StudentSignup from "./components/StudentSignup";
import StudentDashboard from "./components/StudentDashboard";
import AcceuilPage from './components/AcceuilPage';
import StudentProfile from './components/StudentProfile';
import ContenuStudent from './components/ContenuStudent';
import EvaluationsPage from './components/EvaluationsPage';
import EvaluationStart from './components/EvaluationStart';
import ResultsPage from './components/ResultsPage';
import ConsultAdminExercice from './components/ConsultAdminExecice';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import PrivateRoute from "./PrivateRoute";
import PrivateRouteStudent from "./PrivateRouteStudent";
import { NotificationProvider } from './NotificationContext';
import { TeacherNotificationProvider } from './TeacherNotificationContext';
import { StudentNotificationProvider } from './StudentNotificationContext';
;

function App() {
  return (
    <NotificationProvider>
      <TeacherNotificationProvider>
      <StudentNotificationProvider>
      <Router>
        <Routes>
          {/* Publiques */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/edit-profile" element={<EditProfile />} />

          <Route path="/teacher/register" element={<TeacherRegister />} />
          <Route path="/teacher/login"    element={<TeacherLogin />} />
           <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password"  element={<ResetPassword />} />
          <Route
            path="/teacher/Menu/*"
            element={
              <TeacherNotificationProvider>
                <TeacherMenu />
              </TeacherNotificationProvider>
            }
          />

          <Route path="/ajouter-document"   element={<AddDocument />} />
          <Route path="/ajouter-exercices"  element={<AddExercise />} />
          <Route path="/gerer-documents"    element={<ManageDocument />} />
          <Route path="/consulter-documents" element={<ConsultDocument />} />
          <Route path="/gerer-exercices"     element={<ManageExercice />} />
          <Route path="/consulter-exercices" element={<ConsultExercice />} />
          <Route path="/EditProfilTeacher"   element={<EditProfTeacher />} />

          {/* Étudiant */}
          <Route path="/student-login"  element={<StudentLogin />} />
          <Route path="/student-signup" element={<StudentSignup />} />
          <Route element={<PrivateRouteStudent />}>
            <Route path="/student-dashboard" element={<StudentDashboard />}>
              <Route index element={<div>Page d'accueil du dashboard étudiant</div>} />
              <Route path="acceuil" element={<AcceuilPage />} /> 
              <Route path="profile" element={<StudentProfile />} />
              <Route path="documents" element={<ContenuStudent />} />
              <Route path="evaluations" element={<EvaluationsPage />} />
              <Route path="evaluation/start" element={<EvaluationStart />} />
              <Route path="results" element={<ResultsPage />} />
            </Route>
          </Route>

          {/* Admin */}
          <Route element={<PrivateRoute />}>
            <Route
              path="/admin/dashboard"
              element={
                <> <Navbar /> <AdminDashboard /> </>
              }
            />
            <Route path="/admin/teachers" element={<> <Navbar /> <Teachers /> </>} />
            <Route path="/admin/content"  element={<> <Navbar /> <Sidebar /> <Content /> </>} />
            <Route path="/admin/levels"   element={<> <Navbar /> <Sidebar /> <Levels /> </>} />
            <Route path="/admin/exercices" element={<><Navbar /><Sidebar /><ConsultAdminExercice /></>} />
            <Route path="/admin/categorie" element={<> <Navbar /> <Sidebar /> <Categories /> </>} />
            <Route path="/admin/modules"   element={<> <Navbar /> <Sidebar /> <Modules /> </>} />
          </Route>

          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      </StudentNotificationProvider>
      </TeacherNotificationProvider>
    </NotificationProvider>
  );
}

export default App;