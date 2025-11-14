// src/components/pages/TermsPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import TermsContent from "../organisms/content/TermsContent";
import Button from "../atoms/Button";

function TermsPage() {
  const navigate = useNavigate();

  return (
    <>
      {/* No necesitamos Header ni Footer aquí, 
        porque el MainLayout ya los pone. 
      */}
      <main className="container section">
        <div 
          className="registration-container" 
          style={{ maxWidth: '900px', padding: '2rem 3rem' }}
        >
          <div className="modal-header" style={{ borderBottom: 'none', paddingBottom: 0 }}>
            <h2 style={{ fontSize: '2.2rem' }}>Términos y Condiciones</h2>
          </div>
          
          <div className="modal-body" style={{ maxHeight: 'none' }}>
            {/* Aquí cargamos el contenido que ya teníamos */}
            <TermsContent />
          </div>

          <div className="form-actions" style={{ justifyContent: 'center', marginTop: '2rem' }}>
            <Button 
              text="Volver al inicio" 
              type="primary" 
              onClick={() => navigate('/')}
              htmlType="button" 
            />
          </div>
        </div>
      </main>
    </>
  );
}

export default TermsPage;