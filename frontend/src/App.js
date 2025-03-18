import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import Navbar from './components/Navbar';
import AdminDashboard from "./components/AdminDashboard";
import Teachers from "./components/TeachersDash";
import Content from "./components/Contenu";
import Levels from "./components/Niveau";
import Modules from "./components/Modules";
import PrivateRoute from "./PrivateRoute";
import Sidebar from './components/Sidebar';  // Assurez-vous d'importer Sidebar

function App() {
  return (
    <Router>
      <Routes>
        {/* Route de login (pas de Navbar ici) */}
        <Route path="/" element={<LoginPage />} />

        {/* Protéger les routes admin avec PrivateRoute */}
        <Route element={<PrivateRoute />}>
          {/* Routes de l'administration avec Navbar et Sidebar */}
          <Route path="/admin/dashboard" element={<><Navbar /><AdminDashboard /></>} />
          <Route path="/admin/teachers" element={<><Navbar /><Teachers /></>} />
          
          {/* Pages avec Sidebar */}
          <Route path="/admin/content" element={<><Navbar /><Sidebar /><Content /></>} />
          <Route path="/admin/levels" element={<><Navbar /><Sidebar /><Levels /></>} />
          <Route path="/admin/modules" element={<><Navbar /><Sidebar /><Modules /></>} />
        </Route>

        {/* Redirection de /admin vers /admin/dashboard si l'utilisateur va sur /admin */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;



