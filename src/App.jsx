import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilesPage from './pages/ProfilesPage';
import CreateProfile from './pages/CreateProfile';
import EditProfile from './pages/EditProfile';
import VerifyCodePage from './pages/VerifyCodePage';
import CatalogPage from './pages/catalog/CatalogPage';


function App() {
  return (
    <Router>
      <Routes>
        
        <Route path="/" element={<Navigate to="/login" />} />
        
     
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-email" element={<VerifyCodePage />} />
        <Route path="/perfiles" element={<ProfilesPage />} />
        <Route path="/create-profile" element={<CreateProfile />} />
        <Route path="/edit-profile/:id" element={<EditProfile />} />
        <Route path="/catalog" element={<CatalogPage />} />
      </Routes>
    </Router>
  );
}

export default App;