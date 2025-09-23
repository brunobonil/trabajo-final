import React from 'react';
import { Navigate, useParams } from 'react-router-dom'; // <-- Añade useParams

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('accessToken'); // Verificamos el token real
  const { idSuper } = useParams(); // <-- Leemos el idSuper de la ruta que estamos protegiendo

  if (!isAuthenticated) {
    // Si no está autenticado, lo redirige a la página de login
    // del supermercado correspondiente.
    return <Navigate to={`/${idSuper}/login`} replace />;
  }

  // Si está autenticado, muestra el componente Backoffice.
  return children;
};

export default ProtectedRoute;