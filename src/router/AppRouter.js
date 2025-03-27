import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';


// Importando componentes de páginas
import LoginPage from '../pages/Login.js';
import RegisterPage from '../pages/RegisterPage.js';
import HomePage from '../pages/HomePage.js';
import ProfilePage from '../pages/ProfilePage.js';
import ForgotPasswordPage from '../pages/ForgotPasswordPage.js';

// Componente para Rota Protegida
const ProtectedRoute = ({ children }) => {
  const [cookies] = useCookies(['userToken']);
  // Simples verificação de autenticação
  // Na implementação real, você pode usar Context API, Redux, etc.
  const isAuthenticated = cookies.userToken || null;

  
  if (!isAuthenticated) {
    // Redirecionar para login se não estiver autenticado
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

const AppRouter = () => {
  return (
      <Router>
        <Routes>
          {/* Rotas públicas */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          
          {/* Rotas protegidas */}
          <Route 
            path="/home" 
            element={
              
                <HomePage />
              
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />
          
          {/* Rotas especiais */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
  );
};

export default AppRouter;
