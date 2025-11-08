import React from "react";
import "../../styles/components.css";
import Button from "../atoms/Button";

function CTASection({ onNavigateToRegistration }) { // Recibe la prop
  return (
    <section className="section cta">
      <div className="container cta-content">
        <h2>Únete a Bienestar Integral</h2>
        <p>
          Sé parte del cambio positivo. Dona, colabora o crea una cocina
          comunitaria para mejorar vidas.
        </p>
        <div className="cta-buttons">
          <a href="#contact">
            <Button text="Unirme como voluntario" />
          </a>
          {/* Este botón ahora cambia la vista */}
          <Button 
            text="Registrar mi cocina" 
            onClick={onNavigateToRegistration} 
          />
        </div>
      </div>
    </section>
  );
}

export default CTASection;