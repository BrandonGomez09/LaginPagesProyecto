import React, { useState } from "react";
import LandingPage from "./components/pages/LandingPage";
import KitchenRegistrationPage from "./components/pages/KitchenRegistrationPage";
import Modal from "./components/molecules/Modal";
import TermsContent from "./components/organisms/content/TermsContent";
import PrivacyPolicyContent from "./components/organisms/content/PrivacyPolicyContent";

function App() {
  const [currentPage, setCurrentPage] = useState("landing");
  const [modalContent, setModalContent] = useState(null); // null, 'terms', or 'privacy'

  const showRegistration = () => setCurrentPage("registration");
  const showLanding = () => setCurrentPage("landing");

  const openModal = (content) => setModalContent(content);
  const closeModal = () => setModalContent(null);

  const renderPage = () => {
    const pageProps = {
      onNavigateToRegistration: showRegistration,
      onOpenModal: openModal,
    };
    if (currentPage === "landing") {
      return <LandingPage {...pageProps} />;
    }
    if (currentPage === "registration") {
      return <KitchenRegistrationPage onNavigateToLanding={showLanding} onOpenModal={openModal} />;
    }
    return <LandingPage {...pageProps} />;
  };

  return (
    <>
      {renderPage()}

      <Modal
        isOpen={!!modalContent}
        onClose={closeModal}
        title={
          modalContent === "terms"
            ? "Términos y Condiciones"
            : "Política de Privacidad"
        }
      >
        {modalContent === "terms" && <TermsContent />}
        {modalContent === "privacy" && <PrivacyPolicyContent />}
      </Modal>
    </>
  );
}

export default App;