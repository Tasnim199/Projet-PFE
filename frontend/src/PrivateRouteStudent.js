import { Navigate, Outlet } from 'react-router-dom';

export default function PrivateRouteStudent() {
  const token = localStorage.getItem('studentToken');
  console.log('▶ Token élève dans PrivateRouteStudent :', token);

  if (!token) {
    return <Navigate to="/student-login" replace />;
  }

  return <Outlet />;
}
