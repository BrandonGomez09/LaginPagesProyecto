// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Importa tu layout
import MainLayout from './components/layout/MainLayout';

// Importa tus páginas
import LandingPage from './components/pages/LandingPage';
import KitchenRegistrationPage from './components/pages/KitchenRegistrationPage';
import PrivacyPolicyPage from './components/pages/PrivacyPolicyPage';
// 1. Importa la nueva página de Términos
import TermsPage from './components/pages/TermsPage'; 

function App() {
  
  return (
    <Routes>
      {/* El MainLayout sigue siendo el padre de todas las rutas */}
      <Route path="/" element={<MainLayout />}>
        
        <Route index element={<LandingPage />} />
        <Route path="/registro" element={<KitchenRegistrationPage />} />
        <Route path="/privacidad" element={<PrivacyPolicyPage />} />
        
        {/* 2. Añade la nueva ruta para Términos y Condiciones */}
        <Route path="/terminos" element={<TermsPage />} />
        
      </Route>
    </Routes>
  );
}

export default App;