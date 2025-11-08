import React from "react";
import Header from "../organisms/Header";
import Footer from "../organisms/Footer";
import KitchenRegistrationForm from "../organisms/KitchenRegistrationForm";

// Añade { onOpenModal } aquí para recibir la prop
function KitchenRegistrationPage({ onNavigateToLanding, onOpenModal }) {
  return (
    <>
      <Header />
      <main className="container section">
        <KitchenRegistrationForm onBack={onNavigateToLanding} />
      </main>
      {/* Ahora la variable onOpenModal sí existe y se puede pasar al Footer */}
      <Footer onOpenModal={onOpenModal} />
    </>
  );
}

export default KitchenRegistrationPage;