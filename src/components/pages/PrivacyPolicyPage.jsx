// src/components/pages/PrivacyPolicyPage.jsx
import React from "react";
// 1. Importa useNavigate
import { useNavigate } from "react-router-dom";
import PrivacyPolicyContent from "../organisms/content/PrivacyPolicyContent";
import Button from "../atoms/Button";

// 2. Ya no necesita props de navegación
function PrivacyPolicyPage() {
  
  // 3. Inicializa el hook
  const navigate = useNavigate();

  return (
    <>
      {/* El Header y Footer ya no se ponen aquí, 
        se renderizan automáticamente desde 'MainLayout' 
      */}
      <main className="container section">
        <div 
          className="registration-container" 
          style={{ maxWidth: '900px', padding: '2rem 3rem' }}
        >
          <div className="modal-header" style={{ borderBottom: 'none', paddingBottom: 0 }}>
            <h2 style={{ fontSize: '2.2rem' }}>Aviso de Privacidad</h2>
          </div>
          
          <div className="modal-body" style={{ maxHeight: 'none' }}>
            <PrivacyPolicyContent />
          </div>

          <div className="form-actions" style={{ justifyContent: 'center', marginTop: '2rem' }}>
            {/* 4. CAMBIO: El botón usa 'navigate' para volver */}
            <Button 
              text="Volver al inicio" 
              type="primary" 
              onClick={() => navigate('/')} 
            />
          </div>
        </div>
      </main>
    </>
  );
}

export default PrivacyPolicyPage;