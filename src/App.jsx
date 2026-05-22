import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilesPage from './pages/ProfilesPage';
import CreateProfile from './pages/CreateProfile';
import EditProfile from './pages/EditProfile';
import VerifyCodePage from './pages/VerifyCodePage';
import CatalogPage from './pages/catalog/CatalogPage';
import PlansPage from './pages/subscription/PlansPage';
import CheckoutPage from './pages/subscription/CheckoutPage';
import ManageSubscriptionPage from './pages/subscription/ManageSubscriptionPage';
import MyListPage from './pages/mylist/MyListPage';


const ProtectedRoute = ({ children }) => {
  const storedUser = JSON.parse(localStorage.getItem('user'));
  
  
  const tieneAccesoTotal = storedUser && storedUser.estado === "activo";

  if (!tieneAccesoTotal) {
    
    return <Navigate to="/subscription/plans" replace />;
  }

 
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirección Inicial */}
        <Route path="/" element={<Navigate to="/login" />} />
        
        {/* PORTAL PÚBLICO (Cualquiera entra para registrarse o loguearse) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-email" element={<VerifyCodePage />} />

        {/*  PASARELA DE PAGO (Accesible para inactivos para que puedan activar su suscripción) */}
        <Route path="/subscription/plans" element={<PlansPage />} />
        <Route path="/subscription/checkout/:planId" element={<CheckoutPage />} />
        <Route path="/subscription/manage" element={<ManageSubscriptionPage />} />
        
        {/*  TODAS LAS DEMÁS RUTAS BLINDADAS (Solo entran si 'estado' es 'activo') */}
        <Route path="/perfiles" element={<ProtectedRoute><ProfilesPage /></ProtectedRoute>} />
        <Route path="/create-profile" element={<ProtectedRoute><CreateProfile /></ProtectedRoute>} />
        <Route path="/edit-profile/:id" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
        <Route path="/catalog" element={<ProtectedRoute><CatalogPage /></ProtectedRoute>} />
        <Route path="/mylist" element={<ProtectedRoute><MyListPage /></ProtectedRoute>} />

        {/* Captura cualquier link roto y lo manda al login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;