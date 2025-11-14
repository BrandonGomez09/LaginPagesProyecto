import React from "react";
import Header from "../organisms/Header";
import Footer from "../organisms/Footer";
import KitchenRegistrationForm from "../organisms/KitchenRegistrationForm";

// 1. LIMPIEZA: Se eliminan todas las props de navegación
function KitchenRegistrationPage() {
  return (
    <>
      {/* Header y Footer ya no se ponen aquí, 
        se renderizan automáticamente desde 'MainLayout' 
      */}
      <main className="container section">
        {/* 2. KitchenRegistrationForm ya no necesita props */}
        <KitchenRegistrationForm />
      </main>
    </>
  );
}

export default KitchenRegistrationPage;