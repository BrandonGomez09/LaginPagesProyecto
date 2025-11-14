// src/components/layout/MainLayout.jsx
import React from 'react';
// 1. Outlet es lo único que necesitamos de react-router-dom
import { Outlet } from 'react-router-dom';

// 2. Importa solo los componentes compartidos
import Header from '../organisms/Header';
import Footer from '../organisms/Footer';

// 3. Se eliminó 'useState', 'Modal' y 'TermsContent'

function MainLayout() {
  // 4. Se eliminó el estado 'modalContent' y las funciones 'openModal'/'closeModal'

  return (
    <>
      <Header />

      <main>
        {/* Outlet renderiza la página actual (Landing, Registro, Privacidad, o Términos) */}
        <Outlet />
      </main>

      {/* 5. El Footer ya no necesita ninguna prop */}
      <Footer />

      {/* 6. Se eliminó todo el componente <Modal> de aquí */}
    </>
  );
}

export default MainLayout;